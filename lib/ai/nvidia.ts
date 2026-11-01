import 'server-only'

// Minimal client for NVIDIA's hosted models (build.nvidia.com). The API is
// OpenAI-compatible, so switching provider later only means changing
// AI_BASE_URL / AI_MODEL / NVIDIA_API_KEY.

const DEFAULT_BASE_URL = 'https://integrate.api.nvidia.com/v1'
// Tried in order after AI_MODEL. NVIDIA retires hosted models without notice
// (410 Gone) and not every catalog model is enabled for every key, so this
// list comes from /api/admin/ai-models measurements, fastest first.
const FALLBACK_MODELS = [
    'nvidia/nemotron-3.5-lightning-30b-a3b',
    'minimaxai/minimax-m3.1-flash',
    'mistralai/mistral-large-4-1t-a52b',
]
// These are reasoning models: the hidden "thinking" counts against
// max_tokens, so callers' limits get this much extra room or the visible
// answer comes back empty.
const REASONING_HEADROOM_TOKENS = 1024
// Per-model timeout and total budget per completion: a slow or queued model
// must not use up the whole request before the fallbacks get a chance.
const MODEL_TIMEOUT_MS = 9_000
const TOTAL_BUDGET_MS = 25_000
// A model that timed out or was rejected is skipped for this long.
const COOLDOWN_MS = 10 * 60 * 1000
// Reported as upstream status when a model did not answer in time.
const TIMEOUT_STATUS = 504
// Statuses that mean "this model can't serve this request", not "the key or
// service is broken": move on to the next model.
const TRY_NEXT_MODEL = new Set([400, 404, 410, 422])

export type ChatMessage = {
    role: 'system' | 'user' | 'assistant'
    content: string
}

export class AiUnavailableError extends Error {
    constructor(message: string, readonly upstreamStatus?: number) {
        super(message)
    }
}

export function isAiConfigured(): boolean {
    return Boolean(process.env.NVIDIA_API_KEY)
}

// Request shapes tried in order when a model rejects one with 400: thinking
// switched off (fast, short answers), then the model's defaults, then
// without a system role for models that don't support it.
type Variant = { thinkingOff: boolean; systemRole: boolean }
const VARIANTS: Variant[] = [
    { thinkingOff: true, systemRole: true },
    { thinkingOff: false, systemRole: true },
    { thinkingOff: false, systemRole: false },
]

// Remembered per warm serverless instance so later requests skip dead or slow
// models and go straight to the request shape a model accepted.
let workingModel: string | null = null
const variantIndex = new Map<string, number>()
const cooldownUntil = new Map<string, number>()

function candidateModels(): string[] {
    const configured = (process.env.AI_MODEL ?? '').split(',').map((m) => m.trim()).filter(Boolean)
    const all = [...new Set([...(workingModel ? [workingModel] : []), ...configured, ...FALLBACK_MODELS])]
    const now = Date.now()
    const available = all.filter((m) => (cooldownUntil.get(m) ?? 0) <= now)
    return available.length ? available : all
}

function coolDown(model: string) {
    cooldownUntil.set(model, Date.now() + COOLDOWN_MS)
    if (workingModel === model) workingModel = null
}

// Some models don't accept a system role; fold it into the first user turn.
function withoutSystemRole(messages: ChatMessage[]): ChatMessage[] {
    const system = messages.filter((m) => m.role === 'system').map((m) => m.content).join('\n\n')
    const rest = messages.filter((m) => m.role !== 'system')
    const firstUser = rest.findIndex((m) => m.role === 'user')
    if (!system || firstUser === -1) return rest
    return rest.map((m, i) => (i === firstUser ? { ...m, content: `${system}\n\n---\n\n${m.content}` } : m))
}

async function requestCompletion(
    model: string,
    messages: ChatMessage[],
    { maxTokens, temperature, timeoutMs, variant }: {
        maxTokens: number
        temperature: number
        timeoutMs: number
        variant: Variant
    },
): Promise<Response | null> {
    const baseUrl = (process.env.AI_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, '')
    try {
        return await fetch(`${baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.NVIDIA_API_KEY}`,
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                model,
                messages: variant.systemRole ? messages : withoutSystemRole(messages),
                max_tokens: maxTokens + REASONING_HEADROOM_TOKENS,
                temperature,
                stream: false,
                ...(variant.thinkingOff ? { chat_template_kwargs: { enable_thinking: false } } : {}),
            }),
            signal: AbortSignal.timeout(timeoutMs),
            cache: 'no-store',
        })
    } catch (error) {
        // Timeout or network error: let the caller try the next model.
        console.error(`AI model ${model} did not respond: ${error instanceof Error ? error.name : 'error'}`)
        return null
    }
}

export async function chatCompletion(
    messages: ChatMessage[],
    { maxTokens = 400, temperature = 0.2 }: { maxTokens?: number; temperature?: number } = {},
): Promise<string> {
    if (!isAiConfigured()) throw new AiUnavailableError('NVIDIA_API_KEY is not set')

    const deadline = Date.now() + TOTAL_BUDGET_MS
    const timeLeft = () => Math.min(MODEL_TIMEOUT_MS, deadline - Date.now())
    const hasSystem = messages.some((m) => m.role === 'system')

    let lastStatus: number | undefined
    for (const model of candidateModels()) {
        if (timeLeft() < 2_000) break
        let v = variantIndex.get(model) ?? 0
        let res = await requestCompletion(model, messages, { maxTokens, temperature, timeoutMs: timeLeft(), variant: VARIANTS[v] })
        while (res?.status === 400 && v + 1 < VARIANTS.length && timeLeft() >= 2_000) {
            v += 1
            if (!hasSystem && !VARIANTS[v].systemRole) break
            res = await requestCompletion(model, messages, { maxTokens, temperature, timeoutMs: timeLeft(), variant: VARIANTS[v] })
        }
        if (res?.ok) variantIndex.set(model, v)

        if (!res) {
            lastStatus = TIMEOUT_STATUS
            coolDown(model)
            continue
        }
        if (!res.ok) {
            lastStatus = res.status
            // Never log the response body verbatim; it can echo the request.
            console.error(`AI model ${model} returned status ${res.status}`)
            if (TRY_NEXT_MODEL.has(res.status)) {
                coolDown(model)
                continue
            }
            throw new AiUnavailableError(`AI request failed with status ${res.status}`, res.status)
        }

        const content = visibleContent(await res.json().catch(() => null))
        if (!content) {
            console.error(`AI model ${model} returned an empty response`)
            coolDown(model)
            continue
        }
        workingModel = model
        return content
    }
    throw new AiUnavailableError('No AI model is available', lastStatus)
}

// Models sometimes wrap JSON in prose or ``` fences; take the first object.
export function extractJsonObject(text: string): unknown {
    const start = text.indexOf('{')
    const end = text.lastIndexOf('}')
    if (start === -1 || end <= start) return null
    try {
        return JSON.parse(text.slice(start, end + 1))
    } catch {
        return null
    }
}

type CompletionBody = {
    choices?: { finish_reason?: string; message?: { content?: string | null; reasoning_content?: string | null } }[]
} | null

// The answer without any chain of thought reasoning models put in the content.
function visibleContent(data: CompletionBody): string {
    return (data?.choices?.[0]?.message?.content ?? '').replace(/<think>[\s\S]*?<\/think>/g, '').trim()
}

export type ModelProbe = {
    model: string
    thinkingOff: boolean
    status: number | 'timeout'
    ms: number
    finishReason?: string
    reasoningChars?: number
    sample?: string
}

// Admin diagnostics: which models this API key can actually use, how fast,
// and what they answer to a real FoodAi prompt, with thinking on and off.
// Runs a few at a time to stay under the free tier's per-minute limit.
export async function probeModels(models: string[], messages: ChatMessage[]): Promise<ModelProbe[]> {
    const results: ModelProbe[] = []
    const queue = models.flatMap((model) => [true, false].map((thinkingOff) => ({ model, thinkingOff })))
    const worker = async () => {
        for (let job = queue.shift(); job; job = queue.shift()) {
            const start = Date.now()
            const res = await requestCompletion(job.model, messages, {
                maxTokens: 200,
                temperature: 0,
                timeoutMs: 20_000,
                variant: { thinkingOff: job.thinkingOff, systemRole: false },
            })
            const probe: ModelProbe = { ...job, status: res ? res.status : 'timeout', ms: Date.now() - start }
            if (res?.ok) {
                const data = (await res.json().catch(() => null)) as CompletionBody
                const choice = data?.choices?.[0]
                probe.finishReason = choice?.finish_reason
                probe.reasoningChars = (choice?.message?.reasoning_content ?? '').length
                probe.sample = visibleContent(data).replace(/\s+/g, ' ').slice(0, 200)
            }
            results.push(probe)
        }
    }
    await Promise.all(Array.from({ length: 3 }, worker))
    return results.sort((a, b) => Number(a.status !== 200) - Number(b.status !== 200) || a.ms - b.ms)
}

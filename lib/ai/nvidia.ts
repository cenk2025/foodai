import 'server-only'

// Minimal client for NVIDIA's hosted models (build.nvidia.com). The API is
// OpenAI-compatible, so switching provider later only means changing
// AI_BASE_URL / AI_MODEL / NVIDIA_API_KEY.

const DEFAULT_BASE_URL = 'https://integrate.api.nvidia.com/v1'
// Tried in order after AI_MODEL. NVIDIA retires hosted models without notice
// (410 Gone), so a single hardcoded model is not enough.
const FALLBACK_MODELS = [
    'google/gemma-4-31b-it',
    'mistralai/mistral-large-2-instruct',
    'nvidia/nemotron-3-super-120b-a12b',
]
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

// Remembered per warm serverless instance so later requests skip dead or slow
// models and don't repeat a system-role request a model has already rejected.
let workingModel: string | null = null
const noSystemRoleModels = new Set<string>()
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
    maxTokens: number,
    temperature: number,
    timeoutMs: number,
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
            body: JSON.stringify({ model, messages, max_tokens: maxTokens, temperature, stream: false }),
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
        let res = await requestCompletion(
            model,
            noSystemRoleModels.has(model) ? withoutSystemRole(messages) : messages,
            maxTokens,
            temperature,
            timeLeft(),
        )
        if (res?.status === 400 && hasSystem && !noSystemRoleModels.has(model) && timeLeft() >= 2_000) {
            res = await requestCompletion(model, withoutSystemRole(messages), maxTokens, temperature, timeLeft())
            if (res?.ok) noSystemRoleModels.add(model)
        }

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

        const data = (await res.json()) as { choices?: { message?: { content?: string | null } }[] }
        // Reasoning models may prepend their chain of thought.
        const content = data.choices?.[0]?.message?.content?.replace(/<think>[\s\S]*?<\/think>/g, '').trim()
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

export type ModelProbe = { model: string; status: number | 'timeout'; ms: number; sample?: string }

// Admin diagnostics: which models this API key can actually use, how fast,
// and what they answer to a real FoodAi prompt. Runs a few at a time to stay
// under the free tier's per-minute limit.
export async function probeModels(models: string[], messages: ChatMessage[]): Promise<ModelProbe[]> {
    const results: ModelProbe[] = []
    const queue = [...models]
    const worker = async () => {
        for (let model = queue.shift(); model; model = queue.shift()) {
            const start = Date.now()
            const res = await requestCompletion(model, withoutSystemRole(messages), 120, 0, 15_000)
            const probe: ModelProbe = { model, status: res ? res.status : 'timeout', ms: Date.now() - start }
            if (res?.ok) {
                const data = (await res.json().catch(() => null)) as
                    | { choices?: { message?: { content?: string | null } }[] }
                    | null
                probe.sample = (data?.choices?.[0]?.message?.content ?? '').replace(/\s+/g, ' ').slice(0, 200)
            }
            results.push(probe)
        }
    }
    await Promise.all(Array.from({ length: 4 }, worker))
    return results.sort((a, b) => Number(a.status !== 200) - Number(b.status !== 200) || a.ms - b.ms)
}

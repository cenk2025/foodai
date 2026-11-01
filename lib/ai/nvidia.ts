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
const TIMEOUT_MS = 20_000
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

function candidateModels(): string[] {
    const configured = (process.env.AI_MODEL ?? '').split(',').map((m) => m.trim()).filter(Boolean)
    return [...new Set([...(workingModel ? [workingModel] : []), ...configured, ...FALLBACK_MODELS])]
}

// Remembered per warm serverless instance so later requests skip dead models
// and don't repeat a system-role request a model has already rejected.
let workingModel: string | null = null
const noSystemRoleModels = new Set<string>()

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
): Promise<Response> {
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
            signal: AbortSignal.timeout(TIMEOUT_MS),
            cache: 'no-store',
        })
    } catch (error) {
        throw new AiUnavailableError(`AI request to ${model} failed: ${String(error)}`)
    }
}

export async function chatCompletion(
    messages: ChatMessage[],
    { maxTokens = 400, temperature = 0.2 }: { maxTokens?: number; temperature?: number } = {},
): Promise<string> {
    if (!isAiConfigured()) throw new AiUnavailableError('NVIDIA_API_KEY is not set')

    let lastStatus: number | undefined
    for (const model of candidateModels()) {
        const hasSystem = messages.some((m) => m.role === 'system')
        let res = await requestCompletion(
            model,
            noSystemRoleModels.has(model) ? withoutSystemRole(messages) : messages,
            maxTokens,
            temperature,
        )
        if (res.status === 400 && hasSystem && !noSystemRoleModels.has(model)) {
            res = await requestCompletion(model, withoutSystemRole(messages), maxTokens, temperature)
            if (res.ok) noSystemRoleModels.add(model)
        }

        if (!res.ok) {
            lastStatus = res.status
            // Never log the response body verbatim; it can echo the request.
            console.error(`AI model ${model} returned status ${res.status}`)
            if (workingModel === model) workingModel = null
            if (TRY_NEXT_MODEL.has(res.status)) continue
            throw new AiUnavailableError(`AI request failed with status ${res.status}`, res.status)
        }

        const data = (await res.json()) as { choices?: { message?: { content?: string | null } }[] }
        // Reasoning models may prepend their chain of thought.
        const content = data.choices?.[0]?.message?.content?.replace(/<think>[\s\S]*?<\/think>/g, '').trim()
        if (!content) {
            console.error(`AI model ${model} returned an empty response`)
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

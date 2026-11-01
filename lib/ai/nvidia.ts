import 'server-only'

// Minimal client for NVIDIA's hosted models (build.nvidia.com). The API is
// OpenAI-compatible, so switching provider later only means changing
// AI_BASE_URL / AI_MODEL / NVIDIA_API_KEY.

const DEFAULT_BASE_URL = 'https://integrate.api.nvidia.com/v1'
const DEFAULT_MODEL = 'meta/llama-3.3-70b-instruct'
const TIMEOUT_MS = 20_000

export type ChatMessage = {
    role: 'system' | 'user' | 'assistant'
    content: string
}

export class AiUnavailableError extends Error {}

export function isAiConfigured(): boolean {
    return Boolean(process.env.NVIDIA_API_KEY)
}

export async function chatCompletion(
    messages: ChatMessage[],
    { maxTokens = 400, temperature = 0.2 }: { maxTokens?: number; temperature?: number } = {},
): Promise<string> {
    const apiKey = process.env.NVIDIA_API_KEY
    if (!apiKey) throw new AiUnavailableError('NVIDIA_API_KEY is not set')

    const baseUrl = (process.env.AI_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, '')
    let res: Response
    try {
        res = await fetch(`${baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                model: process.env.AI_MODEL || DEFAULT_MODEL,
                messages,
                max_tokens: maxTokens,
                temperature,
                stream: false,
            }),
            signal: AbortSignal.timeout(TIMEOUT_MS),
            cache: 'no-store',
        })
    } catch (error) {
        throw new AiUnavailableError(`AI request failed: ${String(error)}`)
    }

    if (!res.ok) {
        // Never log the response body verbatim; it can echo the request.
        throw new AiUnavailableError(`AI request failed with status ${res.status}`)
    }

    const data = (await res.json()) as { choices?: { message?: { content?: string | null } }[] }
    const content = data.choices?.[0]?.message?.content
    if (typeof content !== 'string' || !content.trim()) {
        throw new AiUnavailableError('AI returned an empty response')
    }
    return content.trim()
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

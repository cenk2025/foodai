import { NextResponse } from 'next/server'
import { AiUnavailableError, isAiConfigured } from '@/lib/ai/nvidia'
import { interpretSearch, searchByIntent } from '@/lib/ai/offer-search'
import { takeRateLimit } from '@/lib/rate-limit'

const MAX_TEXT_LENGTH = 200

// Natural-language search for the homepage search box. Returns the interpreted
// filters (shown to the user) and the matching offers from the database.
// Each AI call may try several models (see lib/ai/nvidia.ts).
export const maxDuration = 60

export async function POST(request: Request) {
    if (!isAiConfigured()) return NextResponse.json({ error: 'ai_unavailable' }, { status: 503 })

    const body = (await request.json().catch(() => null)) as { text?: unknown; city?: unknown } | null
    const text = typeof body?.text === 'string' ? body.text.trim() : ''
    const city = typeof body?.city === 'string' ? body.city.slice(0, 40) : undefined
    if (!text || text.length > MAX_TEXT_LENGTH) {
        return NextResponse.json({ error: 'invalid_request' }, { status: 400 })
    }

    if (!(await takeRateLimit({ scope: 'ai-search', max: 30, windowMs: 10 * 60 * 1000 }))) {
        return NextResponse.json({ error: 'rate_limited' }, { status: 429 })
    }

    try {
        const { intent, cities } = await interpretSearch([{ role: 'user', content: text }])
        const { results, city: resolvedCity } = await searchByIntent(intent, city, cities)
        return NextResponse.json({ intent, city: resolvedCity ?? null, offers: results.slice(0, 60) })
    } catch (error) {
        if (error instanceof AiUnavailableError) {
            console.error('AI search unavailable:', error.message)
            // upstream is NVIDIA's HTTP status: no secrets, but it tells 410 (model
            // retired) apart from 401 (bad key) without access to server logs.
            return NextResponse.json({ error: 'ai_unavailable', upstream: error.upstreamStatus ?? null }, { status: 503 })
        }
        throw error
    }
}

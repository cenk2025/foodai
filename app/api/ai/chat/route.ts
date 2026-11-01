import { NextResponse } from 'next/server'
import { AiUnavailableError, chatCompletion, isAiConfigured, type ChatMessage } from '@/lib/ai/nvidia'
import { interpretSearch, searchByIntent, toAiOffer, type AiOffer } from '@/lib/ai/offer-search'
import { takeRateLimit } from '@/lib/rate-limit'

const MAX_MESSAGES = 8
const MAX_MESSAGE_LENGTH = 500
const MAX_OFFERS = 5

function parseConversation(raw: unknown): ChatMessage[] | null {
    if (!Array.isArray(raw) || raw.length === 0) return null
    const messages: ChatMessage[] = []
    for (const m of raw.slice(-MAX_MESSAGES)) {
        if (typeof m !== 'object' || m === null) return null
        const { role, content } = m as { role?: unknown; content?: unknown }
        if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string') return null
        const text = content.trim().slice(0, MAX_MESSAGE_LENGTH)
        if (text) messages.push({ role, content: text })
    }
    // The model must always be answering the user.
    if (messages.at(-1)?.role !== 'user') return null
    return messages
}

// Prices pre-formatted so the model copies them instead of converting cents.
function forPrompt(o: AiOffer, locale: 'fi' | 'en') {
    const euros = (cents: number) =>
        locale === 'fi' ? `${(cents / 100).toFixed(2).replace('.', ',')} €` : `€${(cents / 100).toFixed(2)}`
    return {
        meal: o.meal,
        restaurant: o.restaurant,
        service: o.source,
        price: euros(o.priceCents),
        ...(o.oldPriceCents && o.oldPriceCents > o.priceCents ? { oldPrice: euros(o.oldPriceCents) } : {}),
        deliveryFee: o.isPickup ? undefined : euros(o.deliveryFeeCents),
        pickup: o.isPickup,
        etaMinutes: o.etaMinutes ?? undefined,
        rating: o.rating,
    }
}

// Models sometimes ignore "no markdown"; the chat bubble shows plain text.
function plainText(reply: string): string {
    return reply.replace(/\*\*(.+?)\*\*/g, '$1').replace(/__(.+?)__/g, '$1').replace(/^#+\s*/gm, '').trim()
}

function answerPrompt(locale: 'fi' | 'en', offers: AiOffer[] | null, city?: string): string {
    const language = locale === 'fi' ? 'Finnish' : 'English'
    const lines = [
        "You are FoodAi's assistant. FoodAi compares discounted meal deals from partner food-delivery services in Finland",
        'and sends users to the partner to order. FoodAi itself does not take orders, payments or deliveries.',
        `Reply in ${language} unless the user clearly writes in another language. Be brief: at most 80 words, plain text, no markdown or links.`,
        'Only talk about food, meal deals and how FoodAi works. For anything else (poems, stories, code, homework,',
        'general questions) reply with ONE short sentence that you can only help with food deals. Do not do the task.',
    ]
    if (offers === null) {
        lines.push('No search was run for this message. If the user seems to want food, ask what they would like and where.')
    } else if (offers.length === 0) {
        lines.push(`A search was run${city ? ` in ${city}` : ''} and found NO matching deals. Say so and suggest loosening one filter.`)
    } else {
        lines.push(
            `A search was run${city ? ` in ${city}` : ''}. These are the ONLY deals you may mention:`,
            JSON.stringify(offers.map((o) => forPrompt(o, locale))),
            'Recommend at most 3 of them by meal and restaurant name. Write prices exactly as given (e.g. 6,17 €).',
            'Never invent deals, restaurants, prices or discounts. The deals are shown to the user as cards under your reply.',
        )
    }
    return lines.join('\n')
}

// Each AI call may try several models (see lib/ai/nvidia.ts).
export const maxDuration = 60

export async function POST(request: Request) {
    if (!isAiConfigured()) return NextResponse.json({ error: 'ai_unavailable' }, { status: 503 })

    const body = (await request.json().catch(() => null)) as
        | { messages?: unknown; locale?: unknown; city?: unknown }
        | null
    const conversation = parseConversation(body?.messages)
    if (!conversation) return NextResponse.json({ error: 'invalid_request' }, { status: 400 })
    const locale = body?.locale === 'en' ? 'en' : 'fi'
    const defaultCity = typeof body?.city === 'string' ? body.city.slice(0, 40) : undefined

    if (!(await takeRateLimit({ scope: 'ai-chat', max: 20, windowMs: 10 * 60 * 1000 }))) {
        return NextResponse.json({ error: 'rate_limited' }, { status: 429 })
    }

    try {
        const { intent, cities } = await interpretSearch(conversation)
        let offers: AiOffer[] | null = null
        let city: string | undefined
        if (intent.search) {
            const found = await searchByIntent(intent, defaultCity, cities)
            offers = found.results.slice(0, MAX_OFFERS).map(toAiOffer)
            city = found.city
        }

        const reply = await chatCompletion(
            [{ role: 'system', content: answerPrompt(locale, offers, city) }, ...conversation],
            { maxTokens: 300, temperature: 0.4 },
        )
        return NextResponse.json({ reply: plainText(reply), offers: offers ?? [] })
    } catch (error) {
        if (error instanceof AiUnavailableError) {
            console.error('AI chat unavailable:', error.message)
            // upstream is NVIDIA's HTTP status: no secrets, but it tells 410 (model
            // retired) apart from 401 (bad key) without access to server logs.
            return NextResponse.json({ error: 'ai_unavailable', upstream: error.upstreamStatus ?? null }, { status: 503 })
        }
        throw error
    }
}

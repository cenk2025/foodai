import 'server-only'
import { searchOffers, getCities, type SearchParams } from '@/app/actions/offers'
import type { OfferWithDetails } from '@/lib/types/database'
import { chatCompletion, extractJsonObject, type ChatMessage } from './nvidia'
import { buildIntentPrompt, validateIntent, type SearchIntent } from './search-intent'

// Compact, display-ready view of an offer. Prices shown to users always come
// from here (the database), never from model output.
export type AiOffer = {
    id: string
    meal: string
    restaurant: string
    city: string
    source: string
    priceCents: number
    oldPriceCents: number | null
    deliveryFeeCents: number
    etaMinutes: number | null
    isPickup: boolean
    rating: number
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function interpretSearch(
    conversation: ChatMessage[],
): Promise<{ intent: SearchIntent; cities: { id: string; name: string }[] }> {
    const cities = await getCities()
    const cityNames = cities.map((c) => c.name)
    const reply = await chatCompletion(
        [{ role: 'system', content: buildIntentPrompt(cityNames) }, ...conversation],
        { maxTokens: 200, temperature: 0 },
    )
    const userText = conversation.filter((m) => m.role === 'user').map((m) => m.content).join('\n')
    return { intent: validateIntent(extractJsonObject(reply), cityNames, userText), cities }
}

export async function searchByIntent(
    intent: SearchIntent,
    defaultCity: string | undefined,
    cities: { id: string; name: string }[],
): Promise<{ results: OfferWithDetails[]; city?: string }> {
    const cityName = intent.city ?? cities.find((c) => c.name.toLowerCase() === defaultCity?.toLowerCase())?.name
    const cityId = cities.find((c) => c.name === cityName)?.id

    const params: SearchParams = {
        query: intent.query,
        maxPrice: intent.maxPriceCents,
        dietFlags: intent.dietFlags,
        freeDelivery: intent.freeDelivery,
        deliveryOnly: intent.deliveryOnly,
        pickupOnly: intent.pickupOnly,
        minRating: intent.minRating,
        sortBy: intent.sortBy ?? 'price_asc',
    }
    // Cities only exist in the database once they have offers.
    if (cityName) {
        if (!cityId || !UUID_RE.test(cityId)) return { results: [], city: cityName }
        params.cityId = cityId
    }

    return { results: await searchOffers(params), city: cityName }
}

export function toAiOffer(o: OfferWithDetails): AiOffer {
    return {
        id: o.id,
        meal: o.meal.name,
        restaurant: o.meal.restaurant.name,
        city: o.meal.restaurant.city?.name ?? '',
        source: o.source.name,
        priceCents: o.price_cents,
        oldPriceCents: o.old_price_cents,
        deliveryFeeCents: o.delivery_fee_cents,
        etaMinutes: o.eta_minutes,
        isPickup: o.is_pickup,
        rating: Number(o.meal.restaurant.rating),
    }
}

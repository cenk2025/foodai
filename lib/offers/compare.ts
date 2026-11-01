import { OfferWithDetails } from '@/lib/types/database'
import { calculateDiscount } from '@/lib/utils'

type PricedOffer = Pick<OfferWithDetails, 'price_cents' | 'delivery_fee_cents' | 'is_pickup'>

/**
 * What the customer actually pays: pickup orders have no delivery fee to add
 */
export function getOfferTotal(offer: PricedOffer): number {
    return offer.is_pickup ? offer.price_cents : offer.price_cents + offer.delivery_fee_cents
}

export function sortByTotal<T extends PricedOffer>(offers: T[]): T[] {
    return [...offers].sort((a, b) => getOfferTotal(a) - getOfferTotal(b))
}

export interface MealComparison {
    best: OfferWithDetails
    others: OfferWithDetails[]
}

const offerDiscount = (offer: OfferWithDetails) => calculateDiscount(offer.old_price_cents ?? 0, offer.price_cents)

/**
 * One entry per meal, cheapest source first. Grouped by meal_id rather than
 * group_key: seeded group keys span restaurants, and only the same restaurant's
 * meal is a fair price comparison. Meals keep the order they first appear in,
 * except for savings, where the deal a meal now shows is what must rank it.
 */
export function compareByMeal(offers: OfferWithDetails[], sortBy?: string): MealComparison[] {
    const byMeal = new Map<string, OfferWithDetails[]>()
    for (const offer of offers) {
        byMeal.set(offer.meal_id, [...(byMeal.get(offer.meal_id) ?? []), offer])
    }

    const comparisons = [...byMeal.values()].map((group) => {
        const [best, ...others] = sortByTotal(group)
        return { best, others }
    })

    return sortBy === 'savings_desc'
        ? comparisons.sort((a, b) => offerDiscount(b.best) - offerDiscount(a.best))
        : comparisons
}

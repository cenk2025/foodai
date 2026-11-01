// Turns free text ("vegaani alle 10 € Kampissa ilmainen toimitus") into the
// structured filters the existing offer search understands.
//
// The model only proposes filters; every field is validated here against fixed
// lists and ranges, so nothing it returns reaches the database unchecked.

export const DIET_FLAGS = ['vegan', 'vegetarian', 'gluten_free', 'halal', 'healthy', 'pescatarian'] as const
export const SORT_OPTIONS = ['price_asc', 'savings_desc', 'rating', 'eta'] as const

const GENERIC_QUERY_WORDS = new Set([
    'food', 'meal', 'meals', 'lunch', 'dinner', 'breakfast', 'snack', 'deal', 'deals', 'cheap', 'restaurant',
    'ruoka', 'lounas', 'päivällinen', 'illallinen', 'aamiainen', 'halpa', 'tarjous', 'ravintola',
    'vegan', 'vegetarian', 'gluten free', 'gluten-free', 'halal', 'healthy', 'pescatarian',
])

export type DietFlag = (typeof DIET_FLAGS)[number]
export type SortOption = (typeof SORT_OPTIONS)[number]

export type SearchIntent = {
    // false for small talk / questions that need no offer lookup
    search: boolean
    query?: string
    city?: string
    maxPriceCents?: number
    dietFlags?: DietFlag[]
    freeDelivery?: boolean
    deliveryOnly?: boolean
    pickupOnly?: boolean
    minRating?: number
    sortBy?: SortOption
}

export function buildIntentPrompt(cityNames: string[]): string {
    return [
        'You convert a food-deal search request into JSON filters for a Finnish meal-deal comparison site.',
        'The request may be in Finnish or English. Reply with ONE JSON object and nothing else.',
        'Fields (omit any field the user did not ask for):',
        '- "search": true if the user wants to find food or deals, false for greetings or unrelated questions.',
        '- "query": ONE short English keyword for a SPECIFIC dish or cuisine, as it would appear in an English menu item name',
        '  (e.g. "pizza", "sushi", "burger", "kebab", "salad", "pasta", "bowl", "wrap"). Translate Finnish dish names to English.',
        '  Omit it for generic words like food/ruoka, lunch/lounas, dinner, meal, and for diets (those go in dietFlags).',
        '- "city": one of ' + JSON.stringify(cityNames) + '. Map districts to their city (Kamppi, Kallio -> Helsinki; Tapiola -> Espoo).',
        '- "maxPriceEuros": number, ONLY if the user states a price limit ("alle 10 €" -> 10). "halpa"/"cheap" is NOT a price limit: use sortBy price_asc.',
        '- "dietFlags": array, subset of ' + JSON.stringify(DIET_FLAGS) + '.',
        '- "freeDelivery": true ONLY if they explicitly ask for free delivery ("ilmainen toimitus/kuljetus", "free delivery").',
        '- "deliveryOnly": true if they want home delivery ("kotiinkuljetus").',
        '- "pickupOnly": true if they will pick it up themselves ("nouto", "noutona", "haen itse", "pickup", "pick it up").',
        '- "fast"/"nopea" means sortBy eta, not a delivery filter.',
        '- "minRating": number 1-5 if they ask for well-rated places ("hyvät arvostelut" -> 4).',
        '- "sortBy": one of ' + JSON.stringify(SORT_OPTIONS) + ' ("halvin" -> price_asc, "isoin alennus" -> savings_desc, "nopein" -> eta, "paras" -> rating).',
        'Use only information from the conversation. Never invent restaurants or prices.',
    ].join('\n')
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function validateIntent(raw: unknown, cityNames: string[]): SearchIntent {
    if (!isRecord(raw)) return { search: true }
    const intent: SearchIntent = { search: raw.search !== false }

    if (typeof raw.query === 'string') {
        const q = raw.query.trim().toLowerCase()
        // The query is a substring match on meal names, so generic or diet words
        // would only hide results the other filters already cover.
        if (/^[\p{L}\p{N} '-]{2,30}$/u.test(q) && !GENERIC_QUERY_WORDS.has(q)) intent.query = q
    }

    if (typeof raw.city === 'string') {
        const match = cityNames.find((c) => c.toLowerCase() === raw.city!.toString().trim().toLowerCase())
        if (match) intent.city = match
    }

    const maxPrice = Number(raw.maxPriceEuros)
    if (Number.isFinite(maxPrice) && maxPrice > 0 && maxPrice <= 200) {
        intent.maxPriceCents = Math.round(maxPrice * 100)
    }

    if (Array.isArray(raw.dietFlags)) {
        const flags = raw.dietFlags.filter((f): f is DietFlag => DIET_FLAGS.includes(f as DietFlag))
        if (flags.length) intent.dietFlags = [...new Set(flags)]
    }

    if (raw.freeDelivery === true) intent.freeDelivery = true
    if (raw.pickupOnly === true) intent.pickupOnly = true
    else if (raw.deliveryOnly === true) intent.deliveryOnly = true

    const rating = Number(raw.minRating)
    if (Number.isFinite(rating) && rating >= 1 && rating <= 5) intent.minRating = rating

    if (SORT_OPTIONS.includes(raw.sortBy as SortOption)) intent.sortBy = raw.sortBy as SortOption

    return intent
}

// Heuristic for the main search box: plain keywords keep using the fast
// substring search, sentences go through the AI.
export function looksLikeNaturalLanguage(text: string): boolean {
    const t = text.trim()
    if (t.length < 8) return false
    return t.split(/\s+/).length >= 3 || /\d|€/.test(t)
}

type IntentLabels = {
    under: string
    free_delivery: string
    delivery: string
    pickup: string
    min_rating: string
    sort: Record<SortOption, string>
    diet: Record<DietFlag, string>
}

// Human-readable chips so users can see how their sentence was understood.
export function describeIntent(intent: SearchIntent, city: string | null, t: IntentLabels): string[] {
    const labels: string[] = []
    if (intent.query) labels.push(intent.query)
    for (const flag of intent.dietFlags ?? []) labels.push(t.diet[flag])
    if (intent.maxPriceCents) labels.push(`${t.under} ${(intent.maxPriceCents / 100).toFixed(2).replace('.00', '')} €`)
    if (intent.freeDelivery) labels.push(t.free_delivery)
    if (intent.deliveryOnly) labels.push(t.delivery)
    if (intent.pickupOnly) labels.push(t.pickup)
    if (intent.minRating) labels.push(`${t.min_rating} ${intent.minRating}`)
    if (intent.sortBy && intent.sortBy !== 'price_asc') labels.push(t.sort[intent.sortBy])
    if (city) labels.push(city)
    return labels
}

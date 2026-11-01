/**
 * Format price in cents to EUR display format
 */
export function formatPrice(cents: number): string {
    return `€${(cents / 100).toFixed(2)}`
}

/**
 * Calculate discount percentage
 */
export function calculateDiscount(oldPrice: number, newPrice: number): number {
    if (!oldPrice || oldPrice <= newPrice) return 0
    return Math.round(((oldPrice - newPrice) / oldPrice) * 100)
}

/**
 * Get discount badge text
 */
export function getDiscountBadge(oldPrice: number | null, newPrice: number): string | null {
    if (!oldPrice) return null
    const discount = calculateDiscount(oldPrice, newPrice)
    return discount > 0 ? `-${discount}%` : null
}

/**
 * Format delivery time
 */
export function formatDeliveryTime(minutes: number | null): string {
    if (!minutes) return 'N/A'
    if (minutes < 60) return `${minutes} min`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`
}

/**
 * Get total price including delivery
 */
export function getTotalPrice(priceCents: number, deliveryFeeCents: number): number {
    return priceCents + deliveryFeeCents
}

/**
 * Get Supabase storage URL for meal image
 */
export function getMealImageUrl(imagePath: string | null): string {
    if (!imagePath) return '/images/placeholder-meal.jpg'

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!supabaseUrl) return '/images/placeholder-meal.jpg'

    return `${supabaseUrl}/storage/v1/object/public/meal-images/${imagePath}`
}

/**
 * Get source logo URL
 */
export function getSourceLogoUrl(logoUrl: string | null): string {
    if (!logoUrl) return '/images/placeholder-source.svg'
    return logoUrl
}

/**
 * Format rating
 */
export function formatRating(rating: number): string {
    return rating.toFixed(1)
}

/**
 * Check if diet flag matches filter
 */
export function matchesDietFilter(
    mealDietFlags: string[],
    filterDietFlags: string[]
): boolean {
    if (filterDietFlags.length === 0) return true
    return filterDietFlags.every(flag => mealDietFlags.includes(flag))
}

const MEAT_OR_FISH_FREE = ['vegan', 'vegetarian']

// The stock photos show specific food (pepperoni pizza, beef burger, salmon sushi),
// so they are only used for meals they truthfully depict.
function getStockPhoto(name: string, dietFlags: string[]): string | undefined {
    if (dietFlags.some(flag => MEAT_OR_FISH_FREE.includes(flag))) return undefined
    if (/veg|tofu|kasvis/.test(name)) return undefined
    if (name.includes('pepperoni')) return '/images/pizza.jpg'
    if (/burger/.test(name) && !/chicken|kana|fish|kala/.test(name)) return '/images/burger.jpg'
    if (/sushi|maki|nigiri|california roll/.test(name)) return '/images/sushi.jpg'
    return undefined
}

const DISH_EMOJI: Array<[RegExp, string]> = [
    [/smoothie/, '🥤'],
    [/veg|tofu|kasvis/, '🥦'],
    [/pizza/, '🍕'],
    [/burger/, '🍔'],
    [/sushi|maki|nigiri|sashimi|roll/, '🍣'],
    [/kebab|falafel|wrap/, '🥙'],
    [/salad|salaatti/, '🥗'],
    [/pasta|penne|spaghetti|lasagn|carbonara/, '🍝'],
    [/bowl|stir-fry|wok/, '🍜'],
    [/chicken|kana|grill/, '🍗'],
]

/**
 * What to show for a meal: its own photo, a stock photo that matches it, or a dish icon
 */
export function getMealVisual(
    mealName: string,
    imagePath?: string | null,
    dietFlags?: string[] | null
): { src?: string; emoji: string } {
    const name = mealName.toLowerCase()
    const emoji = DISH_EMOJI.find(([pattern]) => pattern.test(name))?.[1] ?? '🍽️'
    if (imagePath?.startsWith('http')) return { src: imagePath, emoji }
    return { src: getStockPhoto(name, dietFlags ?? []), emoji }
}

/**
 * Demo sources hold example data: no real restaurant, price or partner behind them
 */
export function isDemoSource(source?: { type?: string | null } | null): boolean {
    return source?.type === 'demo'
}

/**
 * Source name for display. Demo sources must stay distinct from each other in a
 * comparison without their made-up names passing for real platforms.
 */
export function getSourceLabel(source: { name: string; type?: string | null }, exampleWord: string): string {
    return isDemoSource(source) ? `${exampleWord} ${source.name.charAt(0)}` : source.name
}

/**
 * Generate tracking URL for offer
 */
export function getTrackingUrl(offerId: string): string {
    // Relative so it always points at the current deployment.
    return `/go/${offerId}`
}

/**
 * Parse UTM parameters from URL
 */
export function parseUtmParams(url: string): {
    utm_source?: string
    utm_medium?: string
    utm_campaign?: string
} {
    try {
        const urlObj = new URL(url)
        return {
            utm_source: urlObj.searchParams.get('utm_source') || undefined,
            utm_medium: urlObj.searchParams.get('utm_medium') || undefined,
            utm_campaign: urlObj.searchParams.get('utm_campaign') || undefined,
        }
    } catch {
        return {}
    }
}

/**
 * Hash IP address for privacy
 */
export function hashIp(ip: string): string {
    // Simple hash for demo - in production use crypto
    let hash = 0
    for (let i = 0; i < ip.length; i++) {
        const char = ip.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash
    }
    return hash.toString(36)
}

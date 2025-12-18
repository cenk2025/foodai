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

/**
 * Generate tracking URL for offer
 */
export function getTrackingUrl(offerId: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    return `${baseUrl}/go/${offerId}`
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

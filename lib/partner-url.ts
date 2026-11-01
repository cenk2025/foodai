// Builds the outbound URL for a partner offer so the partner can attribute the
// visit (and any resulting order) to FoodAi.
//
// Each source can define its own parameters in sources.tracking_params, e.g.
//   { "ref": "foodai", "subid": "{click_id}" }
// "{click_id}" is replaced with the click_events id, which lets partner
// conversion reports be matched back to individual clicks.

export const CLICK_ID_PLACEHOLDER = '{click_id}'

const DEFAULT_PARAMS: Record<string, string> = {
    utm_source: 'foodai',
    utm_medium: 'referral',
}

export function buildPartnerUrl(
    sourceUrl: string,
    trackingParams: Record<string, unknown> | null | undefined,
    clickId: string | null,
): string | null {
    let url: URL
    try {
        url = new URL(sourceUrl)
    } catch {
        return null
    }
    // Only ever send users to web pages.
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null

    // Defaults never override what the offer URL already carries.
    for (const [key, value] of Object.entries(DEFAULT_PARAMS)) {
        if (!url.searchParams.has(key)) url.searchParams.set(key, value)
    }

    // Partner-specific parameters win over everything else.
    for (const [key, raw] of Object.entries(trackingParams ?? {})) {
        if (typeof raw !== 'string' && typeof raw !== 'number') continue
        const value = String(raw)
        if (value.includes(CLICK_ID_PLACEHOLDER)) {
            if (!clickId) continue
            url.searchParams.set(key, value.replaceAll(CLICK_ID_PLACEHOLDER, clickId))
        } else {
            url.searchParams.set(key, value)
        }
    }

    return url.toString()
}

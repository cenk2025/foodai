'use server'

import { createServiceClient } from '@/lib/supabase/service'
import { hashIp, parseUtmParams } from '@/lib/utils'
import { headers } from 'next/headers'

export async function trackClick(
    offerId: string,
    referrer?: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const supabase = createServiceClient()
        const headersList = await headers()

        // Get request metadata
        const userAgent = headersList.get('user-agent') || undefined
        const forwardedFor = headersList.get('x-forwarded-for')
        const realIp = headersList.get('x-real-ip')
        const ip = forwardedFor?.split(',')[0] || realIp || 'unknown'
        const ipHash = hashIp(ip)

        // Parse UTM parameters from referrer
        const utmParams = referrer ? parseUtmParams(referrer) : {}

        // Insert click event
        const { error } = await supabase
            .from('click_events')
            .insert({
                offer_id: offerId,
                referrer: referrer || undefined,
                utm_source: utmParams.utm_source,
                utm_medium: utmParams.utm_medium,
                utm_campaign: utmParams.utm_campaign,
                ip_hash: ipHash,
                user_agent: userAgent,
            })

        if (error) {
            console.error('Error tracking click:', error)
            return { success: false, error: error.message }
        }

        return { success: true }
    } catch (error) {
        console.error('Error tracking click:', error)
        return { success: false, error: 'Failed to track click' }
    }
}

'use server'

import { createServiceClient } from '@/lib/supabase/service'
import { clientKey } from '@/lib/rate-limit'
import { parseUtmParams } from '@/lib/utils'
import { headers } from 'next/headers'

export async function trackClick(
    offerId: string,
    referrer?: string
): Promise<{ success: boolean; clickId?: string; error?: string }> {
    try {
        const supabase = createServiceClient()
        const headersList = await headers()

        // Get request metadata
        const userAgent = headersList.get('user-agent') || undefined
        const ipHash = await clientKey()

        // Parse UTM parameters from referrer
        const utmParams = referrer ? parseUtmParams(referrer) : {}

        // Insert click event
        const { data, error } = await supabase
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
            .select('id')
            .single()

        if (error) {
            console.error('Error tracking click:', error)
            return { success: false, error: error.message }
        }

        return { success: true, clickId: data.id }
    } catch (error) {
        console.error('Error tracking click:', error)
        return { success: false, error: 'Failed to track click' }
    }
}

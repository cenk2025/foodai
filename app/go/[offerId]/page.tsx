import { redirect } from 'next/navigation'
import { getOfferById } from '@/app/actions/offers'
import { trackClick } from '@/app/actions/tracking'
import { headers } from 'next/headers'

interface PageProps {
    params: Promise<{
        offerId: string
    }>
}

export default async function TrackingRedirectPage({ params }: PageProps) {
    const { offerId } = await params

    // Get the offer
    const offer = await getOfferById(offerId)

    if (!offer) {
        // Redirect to home if offer not found
        redirect('/')
    }

    // Get referrer from headers
    const headersList = await headers()
    const referrer = headersList.get('referer') || undefined

    // Track the click (fire and forget - don't wait)
    trackClick(offerId, referrer).catch(console.error)

    // Redirect to the source URL
    redirect(offer.source_url)
}

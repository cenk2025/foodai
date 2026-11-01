import { redirect } from 'next/navigation'
import { getOfferById } from '@/app/actions/offers'
import { trackClick } from '@/app/actions/tracking'
import { buildPartnerUrl } from '@/lib/partner-url'
import { isDemoSource } from '@/lib/utils'
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

    if (!offer || !offer.active) {
        // Redirect to home if offer not found or no longer valid
        redirect('/')
    }

    // Example data has no real partner: no click to record, nowhere to send anyone
    if (isDemoSource(offer.source)) {
        redirect(`/offer/${offerId}`)
    }

    // Get referrer from headers
    const headersList = await headers()
    const referrer = headersList.get('referer') || undefined

    // Record the click first: its id is passed to the partner for attribution.
    // A tracking failure must never block the redirect.
    const { clickId } = await trackClick(offerId, referrer)

    const destination = buildPartnerUrl(offer.source_url, offer.source?.tracking_params, clickId ?? null)
    if (!destination) {
        console.error('Invalid source_url for offer', offerId)
        redirect(`/offer/${offerId}`)
    }

    redirect(destination)
}

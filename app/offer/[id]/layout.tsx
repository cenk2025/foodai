import { getOfferById } from '@/app/actions/offers'
import { pageMetadata } from '@/lib/seo'
import { isDemoSource } from '@/lib/utils'

interface LayoutProps {
    params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: LayoutProps) {
    const { id } = await params
    const path = `/offer/${id}`
    const offer = await getOfferById(id)
    if (!offer) return pageMetadata({ title: 'Tarjousta ei löytynyt', path, noindex: true })

    const { name: meal, restaurant } = offer.meal
    return pageMetadata({
        title: `${meal} – ${restaurant.name}`,
        description: `${meal} ravintolasta ${restaurant.name}, ${restaurant.city.name}. Vertaile hintaa, toimitusmaksua ja toimitusaikaa FoodAissa.`,
        path,
        // Example offers must not turn up in search results as if they were real deals
        noindex: isDemoSource(offer.source) || !offer.active,
    })
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return children
}

import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
    title: 'Evästeet',
    description: 'FoodAi käyttää palvelun toimintaan tarvittavia evästeitä eikä mainos- tai seurantaevästeitä. Nimettömät tilastot vain luvallasi.',
    path: '/cookies',
})

export default function Layout({ children }: { children: React.ReactNode }) {
    return children
}

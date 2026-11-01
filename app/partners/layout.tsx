import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
    title: 'Ravintoloille ja ruokapalveluille',
    description: 'Tuo tarjouksesi FoodAi-hintavertailuun. Tilaus, maksu ja asiakassuhde pysyvät sinulla.',
    path: '/partners',
})

export default function Layout({ children }: { children: React.ReactNode }) {
    return children
}

import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
    title: 'Käyttöehdot',
    description: 'FoodAi-hintavertailupalvelun käyttöehdot. Tilaus ja maksu tehdään aina kumppanin palvelussa.',
    path: '/terms',
})

export default function Layout({ children }: { children: React.ReactNode }) {
    return children
}

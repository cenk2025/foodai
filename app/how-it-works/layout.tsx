import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
    title: 'Miten FoodAi toimii?',
    description: 'Etsi ateria, vertaile hintoja ja toimitusmaksuja ja siirry kumppanin palveluun tilaamaan. Näin FoodAi toimii.',
    path: '/how-it-works',
})

export default function Layout({ children }: { children: React.ReactNode }) {
    return children
}

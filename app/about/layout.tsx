import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
    title: 'Tietoa FoodAista',
    description: 'FoodAi on suomalainen hintavertailupalvelu alennetuille ruokatarjouksille. Tilaus ja maksu tehdään kumppanin palvelussa.',
    path: '/about',
})

export default function Layout({ children }: { children: React.ReactNode }) {
    return children
}

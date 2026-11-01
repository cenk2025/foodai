import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
    title: 'Tietosuojaseloste',
    description: 'Mitä tietoja FoodAi käsittelee, miksi ja kuinka kauan, sekä miten käytät omia oikeuksiasi.',
    path: '/privacy',
})

export default function Layout({ children }: { children: React.ReactNode }) {
    return children
}

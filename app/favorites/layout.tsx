import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
    title: 'Suosikit',
    path: '/favorites',
    noindex: true,
})

export default function Layout({ children }: { children: React.ReactNode }) {
    return children
}

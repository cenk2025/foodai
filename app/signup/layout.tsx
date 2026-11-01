import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
    title: 'Luo tili',
    path: '/signup',
    noindex: true,
})

export default function Layout({ children }: { children: React.ReactNode }) {
    return children
}

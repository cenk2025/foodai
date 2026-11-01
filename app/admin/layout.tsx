import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
    title: 'Ylläpito',
    path: '/admin',
    noindex: true,
})

export default function Layout({ children }: { children: React.ReactNode }) {
    return children
}

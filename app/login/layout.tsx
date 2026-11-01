import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
    title: 'Kirjaudu sisään',
    path: '/login',
    noindex: true,
})

export default function Layout({ children }: { children: React.ReactNode }) {
    return children
}

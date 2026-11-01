import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
    title: 'Hae ruokatarjouksia',
    description: 'Hae alennettuja ruokatarjouksia omin sanoin, esimerkiksi vegaaninen alle 12 € noutona. Suodata kaupungin, hinnan ja ruokavalion mukaan.',
    path: '/search',
})

export default function Layout({ children }: { children: React.ReactNode }) {
    return children
}

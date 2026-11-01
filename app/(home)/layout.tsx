import { pageMetadata, SITE_NAME } from '@/lib/seo'

const TITLE = `${SITE_NAME} – vertaile alennettuja ruokatarjouksia`

export const metadata = { ...pageMetadata({ title: TITLE, path: '/' }), title: { absolute: TITLE } }

export default function Layout({ children }: { children: React.ReactNode }) {
    return children
}

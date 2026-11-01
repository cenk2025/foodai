import type { Metadata } from 'next'

export const SITE_NAME = 'FoodAi'
export const SITE_DESCRIPTION =
    'FoodAi kokoaa alennetut ruokatarjoukset yhteen näkymään. Vertaile hintoja, toimitusmaksuja ja noutoa tai hae tekoälyllä omin sanoin. Palvelu on vielä kehitysvaiheessa.'

const OPEN_GRAPH_IMAGE = { url: '/opengraph-image', width: 1200, height: 630, alt: 'FoodAi' }

type PageSeo = {
    title: string
    description?: string
    path: string
    // For pages that shouldn't appear in search results: account pages, example data
    noindex?: boolean
}

// Child metadata replaces its parent's openGraph and twitter objects whole, so every
// page sets them together with its own title and canonical address.
export function pageMetadata({ title, description = SITE_DESCRIPTION, path, noindex }: PageSeo): Metadata {
    return {
        title,
        description,
        alternates: { canonical: path },
        openGraph: {
            title,
            description,
            url: path,
            type: 'website',
            locale: 'fi_FI',
            siteName: SITE_NAME,
            images: [OPEN_GRAPH_IMAGE],
        },
        twitter: { card: 'summary_large_image', title, description, images: [OPEN_GRAPH_IMAGE.url] },
        ...(noindex ? { robots: { index: false, follow: true } } : {}),
    }
}

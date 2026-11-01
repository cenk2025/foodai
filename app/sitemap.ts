import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://foodai.fi'

    return ['', '/search', '/about', '/how-it-works'].map((route) => ({
        url: `${baseUrl}${route}`,
    }))
}

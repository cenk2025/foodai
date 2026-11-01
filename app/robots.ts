import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            // /go records a click for the partner, so crawlers must stay out of it
            disallow: ['/profile/', '/settings/', '/auth/', '/go/', '/api/', '/admin/'],
        },
        sitemap: 'https://foodai.fi/sitemap.xml',
    }
}

import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',      // Blocks the admin panel
        '/api/',        // Blocks your backend
        '/_next/',      // Blocks Next.js internal files
      ],
    },
    sitemap: 'https://jumbaglass.co.ke/sitemap.xml',
  }
}

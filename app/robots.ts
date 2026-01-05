import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: 'GPTBot',
        disallow: '/',
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/*'],
      },
    ],
    sitemap: 'https://bookworm.today/sitemap.xml',
  };
}

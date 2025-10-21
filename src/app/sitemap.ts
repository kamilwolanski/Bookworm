import { MetadataRoute } from 'next';
import { getAllAuthorsForSitemap } from '@/lib/author';
import { getAllBooksEditionForSitemap } from '@/lib/books';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://bookworm.today';

  const [bookEditions, authors] = await Promise.all([
    getAllBooksEditionForSitemap(),
    getAllAuthorsForSitemap(),
  ]);

  const pages = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/books`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/authors`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ];

  const bookPages = bookEditions.map((edition) => ({
    url: `${baseUrl}/books/${edition.book.slug}/${edition.id}`,
    lastModified: edition.updatedAt ?? new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const authorPages = authors.map((author) => ({
    url: `${baseUrl}/authors/${author.slug}`,
    lastModified: author.updatedAt ?? new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...pages, ...bookPages, ...authorPages];
}

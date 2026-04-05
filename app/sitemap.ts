import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering — sitemap needs DB access at runtime, not build time
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://brightears.io';
  const locales = ['en', 'th'] as const;
  const currentDate = new Date();

  // Define static pages with their priorities and change frequencies
  const staticPages = [
    {
      path: '',
      priority: 1.0,
      changefreq: 'weekly' as const,
      lastModified: currentDate
    },
    {
      path: 'apply',
      priority: 0.8,
      changefreq: 'monthly' as const,
      lastModified: currentDate
    },
    {
      path: 'entertainment',
      priority: 0.9,
      changefreq: 'weekly' as const,
      lastModified: currentDate
    },
    {
      path: 'events',
      priority: 0.9,
      changefreq: 'monthly' as const,
      lastModified: currentDate
    },
    {
      path: 'faq',
      priority: 0.7,
      changefreq: 'monthly' as const,
      lastModified: currentDate
    },
  ];

  // Build sitemap entries for static pages (both locales)
  const staticEntries: MetadataRoute.Sitemap = staticPages.flatMap((page) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}${page.path ? `/${page.path}` : ''}`,
      lastModified: page.lastModified,
      changeFrequency: page.changefreq,
      priority: page.priority,
      alternates: {
        languages: {
          en: `${baseUrl}/en${page.path ? `/${page.path}` : ''}`,
          th: `${baseUrl}/th${page.path ? `/${page.path}` : ''}`,
        },
      },
    }))
  );

  // Dynamic DJ profile pages — fetched at runtime
  let djEntries: MetadataRoute.Sitemap = [];
  try {
    const artists = await prisma.artist.findMany({
      where: {
        category: 'DJ',
        user: { isActive: true },
      },
      select: { id: true, updatedAt: true },
    });

    djEntries = artists.flatMap((artist) =>
      locales.map((locale) => ({
        url: `${baseUrl}/${locale}/entertainment/${artist.id}`,
        lastModified: artist.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
        alternates: {
          languages: {
            en: `${baseUrl}/en/entertainment/${artist.id}`,
            th: `${baseUrl}/th/entertainment/${artist.id}`,
          },
        },
      }))
    );
  } catch {
    // DB not reachable during build — DJ entries will be served at runtime
    console.log('Sitemap: DB not reachable, serving static entries only');
  }

  return [...staticEntries, ...djEntries];
}

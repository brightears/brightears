import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
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
      path: 'about',
      priority: 0.8,
      changefreq: 'monthly' as const,
      lastModified: currentDate
    },
    {
      path: 'faq',
      priority: 0.7,
      changefreq: 'monthly' as const,
      lastModified: currentDate
    },
    {
      path: 'contact',
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

  return staticEntries;
}

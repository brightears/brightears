import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://brightears.onrender.com';
  const locales = ['en', 'th'] as const;
  const currentDate = new Date();

  // Define static pages with their priorities and change frequencies
  const staticPages = [
    {
      path: '',
      priority: 1.0,
      changefreq: 'daily' as const,
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

  // Fetch dynamic artist pages from database
  let artistEntries: MetadataRoute.Sitemap = [];

  try {
    const artists = await prisma.artist.findMany({
      where: {
        user: {
          isActive: true
        }
      },
      select: {
        id: true,
        updatedAt: true,
        stageName: true
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    // Create artist profile entries for both locales
    artistEntries = artists.flatMap((artist) =>
      locales.map((locale) => ({
        url: `${baseUrl}/${locale}/artists/${artist.id}`,
        lastModified: artist.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
        alternates: {
          languages: {
            en: `${baseUrl}/en/artists/${artist.id}`,
            th: `${baseUrl}/th/artists/${artist.id}`,
          },
        },
      }))
    );
  } catch (error) {
    console.error('Error fetching artists for sitemap:', error);
    // Return static entries only if database fails
  }

  // Combine all entries
  return [...staticEntries, ...artistEntries];
}

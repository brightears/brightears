import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import DJGallery from '@/components/entertainment/DJGallery';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;

  const title = locale === 'th'
    ? 'ดีเจและศิลปินของเรา | Bright Ears'
    : 'Our DJs & Entertainment | Bright Ears';

  const description = locale === 'th'
    ? 'พบกับดีเจมืออาชีพของ Bright Ears ที่ให้บริการในสถานที่ชั้นนำของกรุงเทพ จากเลานจ์สุดหรูไปจนถึงรูฟท็อปบาร์'
    : 'Meet the professional DJs of Bright Ears, performing at Bangkok\'s finest venues. From luxury lounges to rooftop bars, find the right sound for your venue.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/${locale}/entertainment`,
      siteName: 'Bright Ears',
      locale: locale === 'th' ? 'th_TH' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `/${locale}/entertainment`,
      languages: {
        'en': '/en/entertainment',
        'th': '/th/entertainment',
        'x-default': '/en/entertainment',
      }
    },
  };
}

export default async function EntertainmentPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;

  // Query all DJs with their venue assignment history
  const artists = await prisma.artist.findMany({
    where: {
      category: 'DJ',
    },
    select: {
      id: true,
      stageName: true,
      profileImage: true,
      bio: true,
      bioTh: true,
      genres: true,
      instagram: true,
      averageRating: true,
      venueAssignments: {
        select: {
          venue: {
            select: {
              name: true,
            }
          }
        },
        where: {
          status: 'COMPLETED',
        },
        distinct: ['venueId'],
      },
    },
    orderBy: {
      stageName: 'asc',
    },
  });

  // Transform data for the client component
  const djs = artists.map((artist) => ({
    id: artist.id,
    stageName: artist.stageName,
    profileImage: artist.profileImage,
    bio: locale === 'th' && artist.bioTh ? artist.bioTh : artist.bio,
    genres: artist.genres,
    instagram: artist.instagram,
    averageRating: artist.averageRating,
    venues: [...new Set(artist.venueAssignments.map((va) => va.venue.name))],
  }));

  // Collect all unique genres for the filter
  const allGenres = [...new Set(djs.flatMap((dj) => dj.genres))].sort();

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-900 via-deep-teal/90 to-stone-900">
      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Decorative orbs */}
        <div className="absolute top-10 right-10 w-72 h-72 bg-brand-cyan/10 rounded-full filter blur-3xl" />
        <div className="absolute bottom-10 left-10 w-56 h-56 bg-earthy-brown/10 rounded-full filter blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
            {locale === 'th' ? 'ดีเจของเรา' : 'Our DJs'}
          </h1>
          <p className="font-inter text-lg sm:text-xl text-white/70 max-w-2xl mx-auto">
            {locale === 'th'
              ? 'ดีเจมืออาชีพที่คัดสรรมาเพื่อสร้างบรรยากาศให้สถานที่ชั้นนำของกรุงเทพ'
              : 'Handpicked professional DJs setting the tone at Bangkok\'s most prestigious venues.'}
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <DJGallery djs={djs} genres={allGenres} locale={locale} />
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-deep-teal via-deep-teal/95 to-earthy-brown/80 relative overflow-hidden">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-brand-cyan/10 rounded-full filter blur-3xl" />

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-white mb-4">
            {locale === 'th'
              ? 'กำลังมองหาดีเจที่ใช่สำหรับสถานที่ของคุณ?'
              : 'Looking for the right DJ for your venue?'}
          </h2>
          <p className="font-inter text-lg text-white/70 mb-8">
            {locale === 'th'
              ? 'บอกเราเกี่ยวกับสถานที่และบรรยากาศที่ต้องการ เราจะจับคู่ดีเจที่เหมาะสมให้'
              : 'Tell us about your venue and the vibe you\'re after. We\'ll match you with the right talent.'}
          </p>
          <a
            href={`/${locale}/#contact`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand-cyan text-white font-inter font-semibold rounded-2xl transition-all duration-300 hover:bg-brand-cyan/90 hover:shadow-lg hover:shadow-brand-cyan/25 hover:-translate-y-0.5"
          >
            {locale === 'th' ? 'ติดต่อเรา' : 'Get in Touch'}
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </section>
    </div>
  );
}

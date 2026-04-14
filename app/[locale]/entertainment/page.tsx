import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import DJGallery from '@/components/entertainment/DJGallery';
import { generateArtistListSchema } from '@/lib/schemas/structured-data';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;

  const title = locale === 'th'
    ? '\u0E14\u0E35\u0E40\u0E08\u0E02\u0E2D\u0E07\u0E40\u0E23\u0E32 | Bright Ears'
    : 'Our DJs | Bright Ears';

  const description = locale === 'th'
    ? 'ค้นหาดีเจมืออาชีพสำหรับสถานที่และงานอีเวนต์ของคุณ'
    : 'Professional DJs for hotels, restaurants, and premium venues. Browse profiles, listen to sets, and enquire directly.';

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

  const artists = await prisma.artist.findMany({
    where: {
      user: { isActive: true },
      isVisible: true,
    },
    select: {
      id: true,
      stageName: true,
      category: true,
      profileImage: true,
      bio: true,
      bioTh: true,
      genres: true,
      instagram: true,
      contactEmail: true,
      lineId: true,
      averageRating: true,
      baseCity: true,
      startingRate: true,
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

  const djs = artists.map((artist) => ({
    id: artist.id,
    stageName: artist.stageName,
    category: artist.category,
    profileImage: artist.profileImage,
    bio: locale === 'th' && artist.bioTh ? artist.bioTh : artist.bio,
    genres: artist.genres,
    instagram: artist.instagram,
    contactEmail: artist.contactEmail,
    lineId: artist.lineId,
    averageRating: artist.averageRating,
    baseCity: artist.baseCity,
    startingRate: artist.startingRate ? Number(artist.startingRate) : null,
    venues: [...new Set(artist.venueAssignments.map((va) => va.venue.name))],
  }));

  const allGenres = [...new Set(djs.flatMap((dj) => dj.genres))].sort();

  // JSON-LD for AI search indexing
  const listSchema = generateArtistListSchema({
    locale,
    artists: djs.map((dj) => ({
      id: dj.id,
      stageName: dj.stageName,
      bio: dj.bio,
      category: dj.category,
      baseCity: dj.baseCity,
      profileImage: dj.profileImage,
      averageRating: dj.averageRating,
      genres: dj.genres,
    })),
  });

  return (
    <div className="min-h-screen bg-[#131313]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema) }}
      />
      {/* Hero Section */}
      <section className="relative py-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#4fd6ff]/5 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <span className="text-[#f1bca6] font-bold tracking-widest uppercase text-sm mb-4 block">
            {locale === 'th' ? 'ดีเจของเรา' : 'Our DJs'}
          </span>
          <h1 className="font-playfair text-4xl sm:text-5xl md:text-7xl font-bold text-neutral-100 mb-6 tracking-tighter">
            {locale === 'th' ? 'ดีเจทั้งหมด' : 'The Roster'}
          </h1>
          <p className="font-inter text-lg sm:text-xl text-[#bcc9ce] max-w-2xl mx-auto text-balance">
            {locale === 'th'
              ? 'ดีเจมืออาชีพสำหรับโรงแรม ร้านอาหาร และสถานที่ระดับพรีเมียม'
              : 'Professional DJs for hotels, restaurants, and premium venues.'}
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
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#00bbe4] opacity-5" />
        <div className="relative z-10 max-w-2xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="font-playfair text-4xl sm:text-5xl font-bold text-neutral-100 mb-4 tracking-tighter italic">
            {locale === 'th'
              ? '\u0E01\u0E33\u0E25\u0E31\u0E07\u0E21\u0E2D\u0E07\u0E2B\u0E32\u0E14\u0E35\u0E40\u0E08\u0E17\u0E35\u0E48\u0E43\u0E0A\u0E48\u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E2A\u0E16\u0E32\u0E19\u0E17\u0E35\u0E48\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13?'
              : 'Looking for the right entertainment for your venue?'}
          </h2>
          <p className="font-inter text-lg text-neutral-400 mb-8 text-balance">
            {locale === 'th'
              ? '\u0E1A\u0E2D\u0E01\u0E40\u0E23\u0E32\u0E40\u0E01\u0E35\u0E48\u0E22\u0E27\u0E01\u0E31\u0E1A\u0E2A\u0E16\u0E32\u0E19\u0E17\u0E35\u0E48\u0E41\u0E25\u0E30\u0E1A\u0E23\u0E23\u0E22\u0E32\u0E01\u0E32\u0E28\u0E17\u0E35\u0E48\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23 \u0E40\u0E23\u0E32\u0E08\u0E30\u0E08\u0E31\u0E1A\u0E04\u0E39\u0E48\u0E14\u0E35\u0E40\u0E08\u0E17\u0E35\u0E48\u0E40\u0E2B\u0E21\u0E32\u0E30\u0E2A\u0E21\u0E43\u0E2B\u0E49'
              : 'Tell us about your venue and the vibe you\'re after. We\'ll match you with the right talent.'}
          </p>
          <a
            href={`/${locale}/#contact`}
            className="inline-flex items-center gap-2 px-10 py-5 bg-[#f1bca6] text-[#131313] font-bold rounded-md transition-all duration-300 hover:bg-[#d3a18c] uppercase tracking-widest shadow-xl"
          >
            {locale === 'th' ? '\u0E15\u0E34\u0E14\u0E15\u0E48\u0E2D\u0E40\u0E23\u0E32' : 'Get in Touch'}
          </a>
        </div>
      </section>
    </div>
  );
}

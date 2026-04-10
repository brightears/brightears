import { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import {
  MapPinIcon, CalendarIcon, ClockIcon, CurrencyDollarIcon,
  BuildingStorefrontIcon, ArrowLeftIcon,
} from '@heroicons/react/24/outline';

export const dynamic = 'force-dynamic';

async function getVenue(id: string) {
  return prisma.venue.findFirst({
    where: { id, isActive: true },
    include: {
      corporate: { select: { companyName: true } },
      openGigs: {
        where: { status: 'OPEN', date: { gte: new Date() } },
        include: {
          _count: { select: { applications: true } },
        },
        orderBy: { date: 'asc' },
        take: 10,
      },
    },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const venue = await getVenue(id);
  if (!venue) return { title: 'Venue Not Found | Bright Ears' };

  return {
    title: `${venue.name} — ${venue.venueType || 'Venue'} in ${venue.city} | Bright Ears`,
    description: `${venue.name} is a ${venue.venueType?.toLowerCase() || 'venue'} in ${venue.city} on the Bright Ears marketplace. Browse open gigs and apply directly.`,
    alternates: {
      canonical: `/${locale}/venues/${id}`,
    },
  };
}

export default async function PublicVenuePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const venue = await getVenue(id);

  if (!venue) notFound();

  // Aggregate stats — distinct artists played and completed gig count
  const [artistsPlayed, completedGigs] = await Promise.all([
    prisma.venueAssignment.findMany({
      where: { venueId: venue.id, status: 'COMPLETED', artistId: { not: null } },
      select: { artistId: true },
      distinct: ['artistId'],
    }),
    prisma.venueAssignment.count({
      where: { venueId: venue.id, status: 'COMPLETED' },
    }),
  ]);

  const fmtDate = (d: Date) =>
    d.toLocaleDateString('en-GB', {
      weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
    });

  const fmtBudget = (g: any) => {
    const min = g.budgetMin ? Number(g.budgetMin) : null;
    const max = g.budgetMax ? Number(g.budgetMax) : null;
    if (!min && !max) return 'Budget: TBD';
    if (min && max) return `${g.currency} ${min.toLocaleString()}–${max.toLocaleString()}`;
    if (min) return `${g.currency} ${min.toLocaleString()}+`;
    return `up to ${g.currency} ${max!.toLocaleString()}`;
  };

  // JSON-LD for AI search (NightClub/LocalBusiness schema)
  const schemaType =
    venue.venueType === 'Club' || venue.venueType === 'NightClub'
      ? 'NightClub'
      : venue.venueType === 'Restaurant'
      ? 'Restaurant'
      : venue.venueType === 'Bar'
      ? 'BarOrPub'
      : venue.venueType === 'Hotel'
      ? 'Hotel'
      : 'LocalBusiness';

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    '@id': `https://brightears.io/${locale}/venues/${venue.id}`,
    name: venue.name,
    url: `https://brightears.io/${locale}/venues/${venue.id}`,
    ...(venue.address && {
      address: {
        '@type': 'PostalAddress',
        streetAddress: venue.address,
        addressLocality: venue.city,
        addressCountry: 'TH',
      },
    }),
    ...(venue.contactEmail && { email: venue.contactEmail }),
    ...(venue.contactPhone && { telephone: venue.contactPhone }),
    ...(venue.corporate?.companyName && {
      parentOrganization: {
        '@type': 'Organization',
        name: venue.corporate.companyName,
      },
    }),
    ...(venue.openGigs.length > 0 && {
      event: venue.openGigs.map((g) => ({
        '@type': 'MusicEvent',
        name: g.title,
        startDate: `${g.date.toISOString().split('T')[0]}T${g.startTime}:00+07:00`,
        location: {
          '@type': 'Place',
          name: venue.name,
        },
      })),
    }),
  };

  return (
    <main className="min-h-screen bg-[#131313] text-[#e5e2e1] pt-20 pb-20 px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="max-w-5xl mx-auto">
        <Link
          href={`/${locale}/gigs`}
          className="inline-flex items-center gap-2 text-stone-400 hover:text-white text-sm transition mb-6"
        >
          <ArrowLeftIcon className="w-4 h-4" /> Back to gigs
        </Link>

        {/* Venue header */}
        <div className="bg-[#1c1b1b] border border-stone-800 rounded-2xl p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 rounded-xl bg-[#4fd6ff]/10 border border-[#4fd6ff]/30 flex items-center justify-center flex-shrink-0">
              <BuildingStorefrontIcon className="w-8 h-8 text-[#4fd6ff]" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-4xl md:text-5xl font-playfair font-bold text-white tracking-tight">
                {venue.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-stone-400 text-sm mt-2">
                <span className="flex items-center gap-1">
                  <MapPinIcon className="w-4 h-4" /> {venue.city}
                </span>
                {venue.venueType && (
                  <>
                    <span className="text-stone-600">·</span>
                    <span className="px-2 py-0.5 bg-[#4fd6ff]/10 border border-[#4fd6ff]/30 rounded-full text-[#4fd6ff] text-xs font-bold uppercase tracking-wider">
                      {venue.venueType}
                    </span>
                  </>
                )}
                {venue.corporate?.companyName && (
                  <>
                    <span className="text-stone-600">·</span>
                    <span>Operated by {venue.corporate.companyName}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Activity stats */}
          {completedGigs > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="glass border border-white/5 rounded-lg px-4 py-3">
                <div className="text-2xl font-playfair font-bold text-[#4fd6ff]">{completedGigs}</div>
                <div className="text-[10px] uppercase tracking-widest text-stone-500 mt-1">
                  Completed Gigs
                </div>
              </div>
              <div className="glass border border-white/5 rounded-lg px-4 py-3">
                <div className="text-2xl font-playfair font-bold text-[#f0bba5]">{artistsPlayed.length}</div>
                <div className="text-[10px] uppercase tracking-widest text-stone-500 mt-1">
                  Artists Hosted
                </div>
              </div>
              <div className="glass border border-white/5 rounded-lg px-4 py-3">
                <div className="text-2xl font-playfair font-bold text-[#4fd6ff]">{venue.openGigs.length}</div>
                <div className="text-[10px] uppercase tracking-widest text-stone-500 mt-1">
                  Open Gigs Now
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Open gigs at this venue */}
        <h2 className="text-2xl font-playfair font-bold text-white mb-4">
          Open Gigs at {venue.name}
        </h2>
        {venue.openGigs.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-stone-700 rounded-xl">
            <p className="text-stone-400">No open gigs posted right now.</p>
            <p className="text-sm text-stone-500 mt-2">
              Check back soon or{' '}
              <Link href={`/${locale}/entertainment`} className="text-cyan-300 hover:underline">
                browse artists
              </Link>{' '}
              in the meantime.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {venue.openGigs.map((gig) => (
              <div
                key={gig.id}
                className="bg-[#1c1b1b] border border-stone-800 rounded-xl p-6 hover:border-[#4fd6ff]/40 transition"
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="text-lg font-bold text-white">{gig.title}</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#4fd6ff]/20 text-[#4fd6ff] border border-[#4fd6ff]/40 uppercase tracking-widest">
                    {gig.category}
                  </span>
                </div>
                <p className="text-stone-400 text-sm mb-3 line-clamp-2">{gig.description}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-stone-300">
                  <span className="flex items-center gap-1.5">
                    <CalendarIcon className="w-4 h-4" /> {fmtDate(gig.date)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <ClockIcon className="w-4 h-4" /> {gig.startTime}–{gig.endTime}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CurrencyDollarIcon className="w-4 h-4" /> {fmtBudget(gig)}
                  </span>
                  <span className="text-stone-500 text-xs">
                    {gig._count.applications} applicant{gig._count.applications !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href={`/${locale}/gigs`}
            className="inline-block px-6 py-3 bg-stone-800 border border-stone-700 text-white font-bold rounded-lg hover:bg-stone-700 transition"
          >
            View all open gigs →
          </Link>
        </div>
      </div>
    </main>
  );
}

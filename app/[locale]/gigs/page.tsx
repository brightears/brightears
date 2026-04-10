import { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import {
  CalendarIcon, ClockIcon, CurrencyDollarIcon, MapPinIcon,
  MegaphoneIcon,
} from '@heroicons/react/24/outline';
import { generateGigListSchema } from '@/lib/schemas/structured-data';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Open Gigs | Bright Ears',
    description: 'Browse open entertainment gigs posted by venues across Thailand. DJs, bands, singers, and performers — find your next booking.',
    alternates: {
      canonical: `/${locale}/gigs`,
    },
  };
}

export default async function PublicGigsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const gigs = await prisma.openGig.findMany({
    where: {
      status: 'OPEN',
      date: { gte: new Date() },
    },
    include: {
      venue: { select: { id: true, name: true, city: true, venueType: true } },
      _count: { select: { applications: true } },
    },
    orderBy: { date: 'asc' },
    take: 100,
  });

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

  // JSON-LD for AI search + SEO
  const listSchema = generateGigListSchema({
    locale,
    gigs: gigs.map((g) => ({
      id: g.id,
      title: g.title,
      description: g.description,
      category: g.category,
      genres: g.genres,
      date: g.date,
      startTime: g.startTime,
      endTime: g.endTime,
      budgetMin: g.budgetMin ? Number(g.budgetMin) : null,
      budgetMax: g.budgetMax ? Number(g.budgetMax) : null,
      currency: g.currency,
      venue: {
        id: g.venue.id,
        name: g.venue.name,
        city: g.venue.city,
        venueType: g.venue.venueType,
      },
      locale,
    })),
  });

  return (
    <main className="min-h-screen bg-[#131313] text-[#e5e2e1] pt-24 pb-20 px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema) }}
      />
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs tracking-widest text-[#4fd6ff] font-bold mb-4 uppercase">Open Gigs</p>
          <h1 className="text-5xl md:text-7xl font-playfair font-bold tracking-tighter mb-6">
            Venues are hiring.
          </h1>
          <p className="text-xl text-[#bcc8ce] max-w-2xl mx-auto">
            Real gigs posted by real venues across Thailand. Sign up free, apply in one click, get booked directly.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link
              href="/sign-up"
              className="bg-gradient-to-r from-[#b8ebff] to-[#4fd6ff] text-[#003543] px-8 py-3 font-bold rounded-lg hover:brightness-110 transition"
            >
              Join as Artist — Apply Free
            </Link>
            <Link
              href="/sign-up/venue"
              className="glass-card text-[#f0bba5] px-8 py-3 font-bold rounded-lg hover:bg-white/5 transition"
            >
              I&apos;m a Venue — Post a Gig
            </Link>
          </div>
        </div>

        {gigs.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-stone-700 rounded-xl">
            <MegaphoneIcon className="w-16 h-16 mx-auto mb-4 text-stone-600" />
            <p className="text-stone-400 text-lg">No open gigs posted right now.</p>
            <p className="text-sm text-stone-500 mt-2">
              Check back soon — venues post new gigs regularly.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-stone-500 mb-4">{gigs.length} open gig{gigs.length !== 1 ? 's' : ''}</p>
            {gigs.map((gig) => (
              <div
                key={gig.id}
                className="bg-[#1c1b1b] border border-stone-800 rounded-xl p-6 hover:border-[#4fd6ff]/40 transition"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#4fd6ff]/20 text-[#4fd6ff] border border-[#4fd6ff]/40 uppercase tracking-widest">
                        {gig.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white">{gig.title}</h3>
                  </div>
                </div>

                <p className="text-stone-400 text-sm mb-4 line-clamp-3 whitespace-pre-wrap">{gig.description}</p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-stone-300">
                  <Link
                    href={`/${locale}/venues/${gig.venue.id}`}
                    className="flex items-center gap-1.5 hover:text-[#4fd6ff] transition"
                  >
                    <MapPinIcon className="w-4 h-4" /> {gig.venue.name}, {gig.venue.city}
                  </Link>
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

                {gig.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {gig.genres.map((g) => (
                      <span key={g} className="px-2 py-0.5 bg-stone-800 text-stone-400 text-xs rounded">
                        {g}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-stone-800 flex justify-between items-center">
                  <p className="text-xs text-stone-500">Sign in as an artist to apply</p>
                  <Link
                    href={`/sign-in?redirect_url=/${locale}/dj-portal/gigs`}
                    className="px-4 py-2 bg-[#4fd6ff] text-[#003543] font-bold text-sm rounded-lg hover:brightness-110 transition"
                  >
                    Apply →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

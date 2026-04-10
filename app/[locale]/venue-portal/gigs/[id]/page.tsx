import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  CalendarIcon, ClockIcon, CurrencyDollarIcon, MapPinIcon,
  ArrowLeftIcon, UserGroupIcon,
} from '@heroicons/react/24/outline';
import ApplicantActions from './ApplicantActions';

export const dynamic = 'force-dynamic';

export default async function VenueGigDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/sign-in?redirect_url=/${locale}/venue-portal/gigs/${id}`);
  }
  if (user.role !== 'CORPORATE' && user.role !== 'ADMIN') {
    redirect(`/${locale}`);
  }

  // Ownership check (admins bypass)
  const gig = await prisma.openGig.findFirst({
    where: {
      id,
      ...(user.role === 'ADMIN' ? {} : { venue: { corporate: { userId: user.id } } }),
    },
    include: {
      venue: { select: { id: true, name: true, city: true } },
      applications: {
        include: {
          artist: {
            select: {
              id: true,
              stageName: true,
              profileImage: true,
              bio: true,
              genres: true,
              category: true,
              averageRating: true,
              hourlyRate: true,
              baseCity: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!gig) {
    notFound();
  }

  // Auto-suggest top 3 artist matches for this gig (ranked by rating, genre overlap, recency)
  // Excludes artists who already applied.
  const appliedArtistIds = gig.applications.map((a) => a.artist.id);
  const suggestionCandidates = gig.status === 'OPEN'
    ? await prisma.artist.findMany({
        where: {
          isVisible: true,
          user: { isActive: true },
          category: gig.category,
          id: { notIn: appliedArtistIds },
          // Match at least one genre if gig has genres, otherwise show any
          ...(gig.genres.length > 0 && { genres: { hasSome: gig.genres } }),
        },
        select: {
          id: true,
          stageName: true,
          profileImage: true,
          bio: true,
          genres: true,
          averageRating: true,
          baseCity: true,
          venueAssignments: {
            where: { status: 'COMPLETED' },
            select: { id: true },
          },
        },
        orderBy: [
          { averageRating: { sort: 'desc', nulls: 'last' } },
        ],
        take: 12, // fetch more than 3 so we can score and slice
      })
    : [];

  // Score: (rating * 2) + log(gigCount + 1) + genreOverlapCount
  const scored = suggestionCandidates
    .map((a) => {
      const rating = a.averageRating || 0;
      const gigCount = a.venueAssignments.length;
      const genreOverlap = a.genres.filter((g) => gig.genres.includes(g)).length;
      const score = rating * 2 + Math.log(gigCount + 1) + genreOverlap;
      return { ...a, _score: score };
    })
    .sort((a, b) => b._score - a._score)
    .slice(0, 3);

  const fmtDate = gig.date.toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  const fmtBudget = () => {
    const min = gig.budgetMin ? Number(gig.budgetMin) : null;
    const max = gig.budgetMax ? Number(gig.budgetMax) : null;
    if (!min && !max) return 'Budget: TBD';
    if (min && max) return `${gig.currency} ${min.toLocaleString()}–${max.toLocaleString()}`;
    if (min) return `${gig.currency} ${min.toLocaleString()}+`;
    return `up to ${gig.currency} ${max!.toLocaleString()}`;
  };

  const statusColors: Record<string, string> = {
    OPEN: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    FILLED: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    CANCELLED: 'bg-red-500/20 text-red-300 border-red-500/40',
    EXPIRED: 'bg-stone-500/20 text-stone-300 border-stone-500/40',
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <Link
        href={`/${locale}/venue-portal/gigs`}
        className="inline-flex items-center gap-2 text-stone-400 hover:text-white text-sm transition"
      >
        <ArrowLeftIcon className="w-4 h-4" /> Back to gigs
      </Link>

      {/* Gig header */}
      <div className="bg-stone-900/60 backdrop-blur border border-stone-700 rounded-xl p-8">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-3xl font-playfair font-bold text-white tracking-tight">{gig.title}</h1>
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColors[gig.status]}`}>
            {gig.status}
          </span>
        </div>
        <p className="text-stone-300 mb-6 whitespace-pre-wrap">{gig.description}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-stone-500 uppercase tracking-wider text-xs mb-1">Venue</p>
            <p className="text-white flex items-center gap-1"><MapPinIcon className="w-4 h-4" /> {gig.venue.name}</p>
          </div>
          <div>
            <p className="text-stone-500 uppercase tracking-wider text-xs mb-1">Date</p>
            <p className="text-white flex items-center gap-1"><CalendarIcon className="w-4 h-4" /> {fmtDate}</p>
          </div>
          <div>
            <p className="text-stone-500 uppercase tracking-wider text-xs mb-1">Time</p>
            <p className="text-white flex items-center gap-1"><ClockIcon className="w-4 h-4" /> {gig.startTime}–{gig.endTime}</p>
          </div>
          <div>
            <p className="text-stone-500 uppercase tracking-wider text-xs mb-1">Budget</p>
            <p className="text-white flex items-center gap-1"><CurrencyDollarIcon className="w-4 h-4" /> {fmtBudget()}</p>
          </div>
        </div>

        {gig.genres.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-6">
            {gig.genres.map((g) => (
              <span key={g} className="px-3 py-1 bg-stone-800 text-stone-300 text-xs rounded-full">
                {g}
              </span>
            ))}
          </div>
        )}

        {gig.status === 'OPEN' && (
          <div className="mt-6 pt-6 border-t border-stone-700">
            <ApplicantActions gigId={gig.id} action="cancel-gig" />
          </div>
        )}
      </div>

      {/* Suggested matches — auto-generated from category + genres */}
      {scored.length > 0 && gig.status === 'OPEN' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-playfair font-bold text-white">
              Suggested Matches
            </h2>
            <span className="text-xs text-stone-500 uppercase tracking-widest">
              Auto-matched from your requirements
            </span>
          </div>
          <p className="text-sm text-stone-400 mb-4">
            These artists match your gig&apos;s category and genres, ranked by rating and experience.
            Share your gig with them to speed up applications.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {scored.map((artist) => (
              <div
                key={artist.id}
                className="bg-stone-900/60 backdrop-blur border border-cyan-500/30 rounded-xl p-4 hover:border-cyan-500/60 transition"
              >
                <div className="flex items-start gap-3 mb-3">
                  {artist.profileImage ? (
                    <Image
                      src={artist.profileImage}
                      alt={artist.stageName}
                      width={56}
                      height={56}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-stone-800 flex items-center justify-center text-xl font-bold text-stone-500">
                      {artist.stageName.charAt(0)}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/${locale}/entertainment/${artist.id}`}
                      className="font-bold text-white hover:text-cyan-300 transition truncate block"
                    >
                      {artist.stageName}
                    </Link>
                    <p className="text-xs text-stone-400">
                      {artist.venueAssignments.length} gigs
                      {artist.averageRating && <> · ★ {artist.averageRating.toFixed(1)}</>}
                    </p>
                  </div>
                </div>
                {artist.bio && (
                  <p className="text-xs text-stone-400 line-clamp-2 mb-3">{artist.bio}</p>
                )}
                {artist.genres.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {artist.genres.slice(0, 3).map((g) => (
                      <span
                        key={g}
                        className={`px-2 py-0.5 text-[10px] rounded ${
                          gig.genres.includes(g)
                            ? 'bg-cyan-500/20 text-cyan-300'
                            : 'bg-stone-800 text-stone-400'
                        }`}
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                )}
                <Link
                  href={`/${locale}/entertainment/${artist.id}`}
                  className="block w-full text-center px-3 py-2 bg-stone-800 border border-stone-700 text-white font-bold text-xs rounded hover:bg-stone-700 transition"
                >
                  View Profile →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Applicants */}
      <div>
        <h2 className="text-2xl font-playfair font-bold text-white mb-4 flex items-center gap-2">
          <UserGroupIcon className="w-6 h-6" />
          Applicants <span className="text-stone-400">({gig.applications.length})</span>
        </h2>

        {gig.applications.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-stone-700 rounded-xl">
            <p className="text-stone-400">No applicants yet.</p>
            <p className="text-sm text-stone-500 mt-2">
              Share this gig or wait for artists to discover it on the public gigs board.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {gig.applications.map((app) => {
              const quoted = app.quotedRate ? Number(app.quotedRate) : null;
              return (
                <div
                  key={app.id}
                  className="bg-stone-900/60 backdrop-blur border border-stone-700 rounded-xl p-6"
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {app.artist.profileImage ? (
                        <Image
                          src={app.artist.profileImage}
                          alt={app.artist.stageName}
                          width={80}
                          height={80}
                          className="w-20 h-20 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-stone-800 flex items-center justify-center text-2xl font-bold text-stone-500">
                          {app.artist.stageName.charAt(0)}
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <Link
                            href={`/${locale}/entertainment/${app.artist.id}`}
                            className="text-lg font-bold text-white hover:text-cyan-300 transition"
                          >
                            {app.artist.stageName}
                          </Link>
                          <p className="text-sm text-stone-400">
                            {app.artist.category} · {app.artist.baseCity}
                            {app.artist.averageRating && (
                              <> · ★ {app.artist.averageRating.toFixed(1)}</>
                            )}
                          </p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${
                          app.status === 'ACCEPTED' ? statusColors.FILLED :
                          app.status === 'DECLINED' ? statusColors.CANCELLED :
                          app.status === 'SHORTLISTED' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                          statusColors.OPEN
                        }`}>
                          {app.status}
                        </span>
                      </div>

                      {app.artist.bio && (
                        <p className="text-sm text-stone-400 mb-3 line-clamp-2">{app.artist.bio}</p>
                      )}

                      {app.artist.genres.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {app.artist.genres.slice(0, 5).map((g) => (
                            <span key={g} className="px-2 py-0.5 bg-stone-800 text-stone-400 text-xs rounded">
                              {g}
                            </span>
                          ))}
                        </div>
                      )}

                      {app.message && (
                        <div className="mb-3 p-3 bg-stone-800/50 rounded border-l-2 border-cyan-500/40">
                          <p className="text-sm text-stone-300 italic">&ldquo;{app.message}&rdquo;</p>
                        </div>
                      )}

                      {quoted !== null && (
                        <p className="text-sm text-cyan-300 mb-3">
                          Quoted rate: {gig.currency} {quoted.toLocaleString()}
                        </p>
                      )}

                      {gig.status === 'OPEN' && app.status === 'PENDING' && (
                        <ApplicantActions gigId={gig.id} applicationId={app.id} artistId={app.artist.id} action="review-applicant" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

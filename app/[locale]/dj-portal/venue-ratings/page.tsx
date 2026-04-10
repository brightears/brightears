import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import VenueRatingsClient from './VenueRatingsClient';

export const dynamic = 'force-dynamic';

export default async function VenueRatingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/sign-in?redirect_url=/${locale}/dj-portal/venue-ratings`);
  }
  if (user.role !== 'ARTIST') {
    redirect(`/${locale}`);
  }

  const artist = await prisma.artist.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });

  if (!artist) {
    return (
      <div className="text-center py-20">
        <p className="text-stone-400">Artist profile not found.</p>
      </div>
    );
  }

  // Get all venues the artist has completed at least one gig at,
  // along with any existing rating they've given
  const venuesPlayed = await prisma.venueAssignment.findMany({
    where: {
      artistId: artist.id,
      status: 'COMPLETED',
    },
    select: {
      venueId: true,
      venue: { select: { id: true, name: true, city: true } },
    },
    distinct: ['venueId'],
  });

  const existingRatings = await prisma.artistVenueRating.findMany({
    where: { artistId: artist.id },
  });
  const ratingMap = new Map(existingRatings.map((r) => [r.venueId, r]));

  const venues = venuesPlayed.map((va) => ({
    id: va.venue.id,
    name: va.venue.name,
    city: va.venue.city,
    myRating: ratingMap.get(va.venueId)
      ? {
          paidOnTime: ratingMap.get(va.venueId)!.paidOnTime,
          soundQuality: ratingMap.get(va.venueId)!.soundQuality,
          crowdTreatment: ratingMap.get(va.venueId)!.crowdTreatment,
          wouldReturn: ratingMap.get(va.venueId)!.wouldReturn,
          notes: ratingMap.get(va.venueId)!.notes,
        }
      : null,
  }));

  return (
    <div className="max-w-4xl mx-auto">
      <VenueRatingsClient venues={venues} />
    </div>
  );
}

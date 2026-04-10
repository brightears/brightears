import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ArtistDiscoveryContent from './ArtistDiscoveryContent';

export const dynamic = 'force-dynamic';

export default async function ArtistDiscoveryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const user = await getCurrentUser();
  if (!user || (user.role !== 'CORPORATE' && user.role !== 'ADMIN')) {
    redirect(`/${locale}`);
  }

  // Get the venue ID for booking requests
  const corporate = await prisma.corporate.findFirst({
    where: { userId: user.id },
    include: { venues: { select: { id: true, name: true }, take: 1 } },
  });

  const venueId = corporate?.venues[0]?.id || null;
  const venueName = corporate?.venues[0]?.name || null;

  // Fetch all active, visible artists
  const artists = await prisma.artist.findMany({
    where: {
      user: { isActive: true },
      isVisible: true,
      stageName: { not: '' },
    },
    select: {
      id: true,
      stageName: true,
      category: true,
      profileImage: true,
      bio: true,
      genres: true,
      baseCity: true,
      averageRating: true,
      contactEmail: true,
      instagram: true,
      venueAssignments: {
        select: { venue: { select: { name: true } } },
        where: { status: 'COMPLETED' },
        distinct: ['venueId'],
      },
    },
    orderBy: { stageName: 'asc' },
  });

  const mappedArtists = artists.map((a) => ({
    id: a.id,
    stageName: a.stageName,
    category: a.category,
    profileImage: a.profileImage,
    bio: a.bio,
    genres: a.genres,
    baseCity: a.baseCity,
    averageRating: a.averageRating,
    venues: [...new Set(a.venueAssignments.map((va) => va.venue.name))],
  }));

  return (
    <div className="pt-12 lg:pt-0">
      <ArtistDiscoveryContent
        artists={mappedArtists}
        venueId={venueId}
        venueName={venueName}
        locale={locale}
      />
    </div>
  );
}

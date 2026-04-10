import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import GigsClient from './GigsClient';

export const dynamic = 'force-dynamic';

export default async function VenuePortalGigsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/sign-in?redirect_url=/${locale}/venue-portal/gigs`);
  }
  if (user.role !== 'CORPORATE' && user.role !== 'ADMIN') {
    redirect(`/${locale}`);
  }

  // Load the venues this user owns (admins see all)
  const venueWhere: any = user.role === 'ADMIN'
    ? { isActive: true }
    : { corporate: { userId: user.id }, isActive: true };

  const venues = await prisma.venue.findMany({
    where: venueWhere,
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  });

  const venueIds = venues.map((v) => v.id);

  // Load all gigs owned by these venues
  const gigs = venueIds.length > 0
    ? await prisma.openGig.findMany({
        where: { venueId: { in: venueIds } },
        include: {
          venue: { select: { id: true, name: true } },
          _count: { select: { applications: true } },
        },
        orderBy: [{ date: 'asc' }, { createdAt: 'desc' }],
      })
    : [];

  // Serialize dates/decimals for client component
  const serializedGigs = gigs.map((g) => ({
    ...g,
    date: g.date.toISOString(),
    createdAt: g.createdAt.toISOString(),
    updatedAt: g.updatedAt.toISOString(),
    budgetMin: g.budgetMin ? Number(g.budgetMin) : null,
    budgetMax: g.budgetMax ? Number(g.budgetMax) : null,
  }));

  return (
    <div className="max-w-5xl mx-auto">
      <GigsClient venues={venues} initialGigs={serializedGigs} />
    </div>
  );
}

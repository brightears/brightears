import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import DJGigsClient from './DJGigsClient';

export const dynamic = 'force-dynamic';

export default async function DJGigsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/sign-in?redirect_url=/${locale}/dj-portal/gigs`);
  }
  if (user.role !== 'ARTIST') {
    redirect(`/${locale}`);
  }

  // Find the artist record
  const artist = await prisma.artist.findUnique({
    where: { userId: user.id },
    select: { id: true, category: true },
  });

  if (!artist) {
    return (
      <div className="text-center py-20">
        <p className="text-stone-400">Artist profile not found. Complete onboarding first.</p>
      </div>
    );
  }

  // Fetch all OPEN gigs from today forward.
  // Filter by category to match the artist's own category (e.g. DJs see DJ gigs).
  const gigs = await prisma.openGig.findMany({
    where: {
      status: 'OPEN',
      date: { gte: new Date() },
      category: artist.category,
    },
    include: {
      venue: { select: { id: true, name: true, city: true, venueType: true } },
      applications: {
        where: { artistId: artist.id },
        select: { id: true, status: true, message: true, quotedRate: true },
      },
      _count: { select: { applications: true } },
    },
    orderBy: { date: 'asc' },
    take: 100,
  });

  const serialized = gigs.map((g) => ({
    ...g,
    date: g.date.toISOString(),
    createdAt: g.createdAt.toISOString(),
    updatedAt: g.updatedAt.toISOString(),
    budgetMin: g.budgetMin ? Number(g.budgetMin) : null,
    budgetMax: g.budgetMax ? Number(g.budgetMax) : null,
    myApplication: g.applications[0]
      ? {
          ...g.applications[0],
          quotedRate: g.applications[0].quotedRate ? Number(g.applications[0].quotedRate) : null,
        }
      : null,
    applications: undefined,
  }));

  return (
    <div className="max-w-5xl mx-auto">
      <DJGigsClient gigs={serialized as any} artistCategory={artist.category} />
    </div>
  );
}

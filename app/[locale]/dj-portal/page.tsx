import { getCurrentUser } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import DJDashboardContent from './DJDashboardContent';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

async function getDashboardData(artistId: string) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const [
    upcomingThisMonth,
    totalShifts,
    avgRating,
    next3,
    recentFeedback,
    stageName,
  ] = await Promise.all([
    // Upcoming shifts this month
    prisma.venueAssignment.count({
      where: {
        artistId,
        date: { gte: now, lte: monthEnd },
        status: 'SCHEDULED',
      },
    }),
    // Total shifts all time
    prisma.venueAssignment.count({
      where: { artistId },
    }),
    // Average rating
    prisma.venueFeedback.aggregate({
      where: { artistId },
      _avg: { overallRating: true },
      _count: { overallRating: true },
    }),
    // Next 3 upcoming performances
    prisma.venueAssignment.findMany({
      where: {
        artistId,
        date: { gte: now },
        status: 'SCHEDULED',
      },
      include: {
        venue: { select: { name: true } },
      },
      orderBy: { date: 'asc' },
      take: 3,
    }),
    // Last 5 feedback entries
    prisma.venueFeedback.findMany({
      where: { artistId },
      include: {
        venue: { select: { name: true } },
        assignment: { select: { date: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    // Get stage name
    prisma.artist.findUnique({
      where: { id: artistId },
      select: { stageName: true, profileImage: true },
    }),
  ]);

  return {
    stageName: stageName?.stageName || 'DJ',
    profileImage: stageName?.profileImage || null,
    stats: {
      upcomingThisMonth,
      totalShifts,
      avgRating: avgRating._avg.overallRating
        ? Math.round(avgRating._avg.overallRating * 10) / 10
        : null,
      totalRatings: avgRating._count.overallRating,
    },
    upcoming: next3.map((a) => ({
      id: a.id,
      venue: a.venue.name,
      date: a.date.toISOString(),
      startTime: a.startTime,
      endTime: a.endTime,
      slot: a.slot,
    })),
    recentFeedback: recentFeedback.map((f) => ({
      id: f.id,
      venue: f.venue.name,
      date: f.assignment.date.toISOString(),
      overallRating: f.overallRating,
      notes: f.notes,
    })),
  };
}

export default async function DJPortalDashboard({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const user = await getCurrentUser();

  if (!user?.artist?.id) {
    return (
      <div className="text-white text-center py-12">
        <p>{locale === 'th' ? 'ไม่พบโปรไฟล์ศิลปิน' : 'Artist profile not found.'}</p>
      </div>
    );
  }

  const data = await getDashboardData(user.artist.id);

  return <DJDashboardContent data={data} locale={locale} />;
}

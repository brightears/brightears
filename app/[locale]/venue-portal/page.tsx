import { getCurrentUser } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import DashboardContent from './DashboardContent';

const prisma = new PrismaClient();

async function getDashboardData(corporateId: string) {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Get venues for this corporate
  const venues = await prisma.venue.findMany({
    where: {
      corporateId,
      isActive: true,
    },
    select: { id: true, name: true },
  });

  const venueIds = venues.map((v) => v.id);

  // Get stats
  const [
    upcomingAssignments,
    recentAssignments,
    pendingFeedback,
    totalFeedback,
    avgRating,
  ] = await Promise.all([
    // Upcoming assignments (next 7 days)
    prisma.venueAssignment.findMany({
      where: {
        venueId: { in: venueIds },
        status: 'SCHEDULED',
        date: {
          gte: now,
          lte: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        },
      },
      include: {
        venue: { select: { name: true } },
        artist: {
          select: { stageName: true, profileImage: true, category: true },
        },
      },
      orderBy: { date: 'asc' },
      take: 5,
    }),
    // Recent completed assignments
    prisma.venueAssignment.findMany({
      where: {
        venueId: { in: venueIds },
        status: 'COMPLETED',
        date: { gte: thirtyDaysAgo },
      },
      include: {
        venue: { select: { name: true } },
        artist: {
          select: { stageName: true, profileImage: true },
        },
        feedback: {
          select: { overallRating: true },
        },
      },
      orderBy: { date: 'desc' },
      take: 5,
    }),
    // Pending feedback count
    prisma.venueAssignment.count({
      where: {
        venueId: { in: venueIds },
        status: 'COMPLETED',
        feedback: null,
      },
    }),
    // Total feedback this month
    prisma.venueFeedback.count({
      where: {
        venueId: { in: venueIds },
        createdAt: { gte: thirtyDaysAgo },
      },
    }),
    // Average rating this month
    prisma.venueFeedback.aggregate({
      where: {
        venueId: { in: venueIds },
        createdAt: { gte: thirtyDaysAgo },
      },
      _avg: {
        overallRating: true,
      },
    }),
  ]);

  // Count unique DJs this month
  const uniqueDJs = await prisma.venueAssignment.findMany({
    where: {
      venueId: { in: venueIds },
      date: { gte: thirtyDaysAgo },
    },
    select: { artistId: true },
    distinct: ['artistId'],
  });

  return {
    venues,
    stats: {
      upcomingCount: upcomingAssignments.length,
      pendingFeedback,
      totalFeedback,
      avgRating: avgRating._avg.overallRating
        ? Math.round(avgRating._avg.overallRating * 10) / 10
        : null,
      uniqueDJs: uniqueDJs.length,
    },
    upcomingAssignments,
    recentAssignments,
  };
}

export default async function VenuePortalDashboard({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const user = await getCurrentUser();

  if (!user?.corporate?.id) {
    return (
      <div className="text-white text-center py-12">
        <p>Corporate profile not found.</p>
      </div>
    );
  }

  const data = await getDashboardData(user.corporate.id);

  return (
    <DashboardContent
      companyName={user.corporate.companyName}
      data={data}
      locale={locale}
    />
  );
}

import { getCurrentUser } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import DashboardContent from './DashboardContent';

const prisma = new PrismaClient();

async function getDashboardData(corporateId: string | null, isAdmin: boolean) {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Today's date boundaries (midnight to midnight local time)
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  // For ADMIN users without corporate, get all venues
  // For CORPORATE users, get their specific venues
  const venues = await prisma.venue.findMany({
    where: corporateId
      ? { corporateId, isActive: true }
      : { isActive: true }, // Admin sees all venues
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

  // Today's assignments (tonight's lineup)
  const todayAssignments = await prisma.venueAssignment.findMany({
    where: {
      venueId: { in: venueIds },
      date: { gte: todayStart, lte: todayEnd },
      status: { not: 'CANCELLED' },
    },
    include: {
      venue: { select: { id: true, name: true } },
      artist: {
        select: { id: true, stageName: true, profileImage: true },
      },
    },
    orderBy: [{ venue: { name: 'asc' } }, { startTime: 'asc' }],
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
    todayAssignments,
  };
}

export default async function VenuePortalDashboard({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="text-white text-center py-12">
        <p>Not authenticated.</p>
      </div>
    );
  }

  const isAdmin = user.role === 'ADMIN';
  const corporateId = user.corporate?.id || null;

  // Allow ADMIN users to view without corporate profile
  if (!corporateId && !isAdmin) {
    return (
      <div className="text-white text-center py-12">
        <p>Corporate profile not found.</p>
      </div>
    );
  }

  const data = await getDashboardData(corporateId, isAdmin);

  // Compute display name from venue names instead of company name
  const venueNames = data.venues.map((v) => v.name);
  let displayName: string;
  if (isAdmin) {
    displayName = 'All Venues (Admin)';
  } else if (venueNames.length === 0) {
    displayName = user.corporate?.companyName || 'Your Venues';
  } else if (venueNames.length === 1) {
    displayName = venueNames[0];
  } else if (venueNames.length === 2) {
    displayName = `${venueNames[0]} & ${venueNames[1]}`;
  } else {
    displayName = `${venueNames[0]}, ${venueNames[1]} & ${venueNames.length - 2} more`;
  }

  return (
    <DashboardContent
      displayName={displayName}
      data={data}
      locale={locale}
    />
  );
}

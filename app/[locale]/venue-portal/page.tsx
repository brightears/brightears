import { getCurrentUser } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import DashboardContent from './DashboardContent';
import { addAssignmentDays, assignmentHasEnded, bangkokAssignmentToday, upcomingAssignments as filterUpcomingAssignments } from '@/lib/venue-assignment-time';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

async function getDashboardData(corporateId: string | null, isAdmin: boolean) {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // VenueAssignment.date is a DATE key; do not compare it to a current instant.
  const today = bangkokAssignmentToday(now);
  const tomorrow = addAssignmentDays(today, 1);
  const recentStartDay = addAssignmentDays(today, -30);

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
    // Today and the next six days, including an overnight shift still in progress.
    prisma.venueAssignment.findMany({
      where: {
        venueId: { in: venueIds },
        status: 'SCHEDULED',
        date: {
          gte: addAssignmentDays(today, -1),
          lt: addAssignmentDays(today, 7),
        },
      },
      include: {
        venue: { select: { name: true } },
        artist: {
          select: { stageName: true, profileImage: true, category: true },
        },
      },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    }),
    // Recent assignments where shift has ended (last 30 days)
    prisma.venueAssignment.findMany({
      where: {
        venueId: { in: venueIds },
        artistId: { not: null }, // Only DJ assignments
        date: { gte: recentStartDay, lt: tomorrow },
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
    }),
    // Pending feedback - fetch all to filter by endTime
    prisma.venueAssignment.findMany({
      where: {
        venueId: { in: venueIds },
        artistId: { not: null },
        feedback: null,
        date: { lt: tomorrow },
      },
      select: { date: true, startTime: true, endTime: true },
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

  // Count unique DJs in the recent date window, excluding future assignments.
  const uniqueDJs = await prisma.venueAssignment.findMany({
    where: {
      venueId: { in: venueIds },
      date: { gte: recentStartDay, lt: tomorrow },
    },
    select: { artistId: true },
    distinct: ['artistId'],
  });

  // Today's assignments (tonight's lineup)
  const todayAssignments = await prisma.venueAssignment.findMany({
    where: {
      venueId: { in: venueIds },
      date: today,
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

  const filteredUpcomingAssignments = filterUpcomingAssignments(upcomingAssignments, now);

  // Filter recent assignments to only those where shift has ended, then take 5
  const filteredRecentAssignments = recentAssignments
    .filter(a => assignmentHasEnded(a, now))
    .slice(0, 5);

  // Filter pending feedback to only those where shift has ended
  const filteredPendingFeedback = pendingFeedback.filter(a =>
    assignmentHasEnded(a, now)
  ).length;

  return {
    venues,
    stats: {
      upcomingCount: filteredUpcomingAssignments.length,
      pendingFeedback: filteredPendingFeedback,
      totalFeedback,
      avgRating: avgRating._avg.overallRating
        ? Math.round(avgRating._avg.overallRating * 10) / 10
        : null,
      uniqueDJs: uniqueDJs.length,
    },
    upcomingAssignments: filteredUpcomingAssignments.slice(0, 5),
    recentAssignments: filteredRecentAssignments,
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

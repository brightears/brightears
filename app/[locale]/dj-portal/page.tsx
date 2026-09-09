import { getCurrentUser } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import DJDashboardContent from './DJDashboardContent';
import { addAssignmentDays, assignmentMonthBounds, bangkokAssignmentToday, upcomingAssignments } from '@/lib/venue-assignment-time';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

async function getDashboardData(artistId: string) {
  const now = new Date();
  const today = bangkokAssignmentToday(now);
  const month = assignmentMonthBounds(today);

  const [
    scheduledAssignments,
    totalShifts,
    avgRating,
    recentFeedback,
    stageName,
  ] = await Promise.all([
    // DATE keys need yesterday's overnight shifts as well as today's shifts.
    // Filter by actual Bangkok end time before taking the three dashboard rows.
    prisma.venueAssignment.findMany({
      where: {
        artistId,
        date: { gte: addAssignmentDays(today, -1) },
        status: 'SCHEDULED',
      },
      include: {
        venue: { select: { name: true } },
      },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
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

  const upcoming = upcomingAssignments(scheduledAssignments, now);
  const upcomingThisMonth = upcoming.filter(a =>
    a.date >= month.start && a.date < month.endExclusive
  ).length;

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
    upcoming: upcoming.slice(0, 3).map((a) => ({
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

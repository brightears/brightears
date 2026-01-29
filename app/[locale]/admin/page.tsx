import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import ScheduleCalendar from '@/components/admin/ScheduleCalendar';

export default async function AdminDashboard({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const user = await getCurrentUser();

  // Get basic stats for the dashboard header
  const [venueCount, djCount, upcomingCount, pendingFeedback] = await Promise.all([
    prisma.venue.count({ where: { isActive: true } }),
    prisma.artist.count({ where: { category: 'DJ' } }),
    prisma.venueAssignment.count({
      where: {
        status: 'SCHEDULED',
        date: { gte: new Date() },
      },
    }),
    prisma.venueAssignment.count({
      where: {
        status: 'COMPLETED',
        feedback: null,
        date: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    }),
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pt-8 lg:pt-0">
        <h1 className="text-3xl font-playfair font-bold text-white mb-2">
          Schedule Overview
        </h1>
        <p className="text-gray-400">
          Cross-venue calendar • {user?.email}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
          <div className="text-2xl font-bold text-white">{venueCount}</div>
          <div className="text-gray-400 text-sm">Active Venues</div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
          <div className="text-2xl font-bold text-white">{djCount}</div>
          <div className="text-gray-400 text-sm">DJs in Roster</div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
          <div className="text-2xl font-bold text-white">{upcomingCount}</div>
          <div className="text-gray-400 text-sm">Upcoming Shows</div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
          <div className={`text-2xl font-bold ${pendingFeedback > 0 ? 'text-amber-400' : 'text-white'}`}>
            {pendingFeedback}
          </div>
          <div className="text-gray-400 text-sm">Pending Feedback</div>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
        <ScheduleCalendar />
      </div>
    </div>
  );
}

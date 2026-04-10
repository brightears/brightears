import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import ScheduleCalendar from '@/components/admin/ScheduleCalendar';

export const dynamic = 'force-dynamic';
import LineActions from '@/components/admin/LineActions';
import LineGroupLinks from '@/components/admin/LineGroupLinks';
import LineLinkedAccounts from '@/components/admin/LineLinkedAccounts';

export default async function AdminDashboard({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const user = await getCurrentUser();

  // Get basic stats for the dashboard header
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [venueCount, djCount, upcomingCount, pendingFeedback, lineLinkedCount, gigsLast30d] = await Promise.all([
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
          gte: thirtyDaysAgo,
        },
      },
    }),
    prisma.user.count({ where: { lineUserId: { not: null } } }),
    // Marketplace liquidity North Star — gigs posted in last 30 days
    // that received ≥1 application within 48h. Per 2026 marketplace research
    // (Point Nine, Sharetribe, Reforge), this is THE metric that tells you
    // whether the marketplace is actually functioning. Target: 80%+.
    prisma.openGig.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: {
        id: true,
        createdAt: true,
        applications: {
          select: { createdAt: true },
          orderBy: { createdAt: 'asc' },
          take: 1,
        },
      },
    }),
  ]);

  // Compute liquidity North Star
  const FORTY_EIGHT_HOURS_MS = 48 * 60 * 60 * 1000;
  const liquidityNorthStar: {
    percent: number | null;
    totalGigs: number;
    qualifiedGigs: number;
    status: 'healthy' | 'warning' | 'critical' | 'no-data';
  } = (() => {
    if (gigsLast30d.length === 0) {
      return { percent: null, totalGigs: 0, qualifiedGigs: 0, status: 'no-data' };
    }
    const qualified = gigsLast30d.filter((g) => {
      if (g.applications.length === 0) return false;
      const firstAppAt = new Date(g.applications[0].createdAt).getTime();
      const gigCreatedAt = new Date(g.createdAt).getTime();
      return firstAppAt - gigCreatedAt <= FORTY_EIGHT_HOURS_MS;
    }).length;
    const pct = (qualified / gigsLast30d.length) * 100;
    let status: 'healthy' | 'warning' | 'critical' = 'healthy';
    if (pct < 50) status = 'critical';
    else if (pct < 80) status = 'warning';
    return {
      percent: Math.round(pct),
      totalGigs: gigsLast30d.length,
      qualifiedGigs: qualified,
      status,
    };
  })();

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
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
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
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
          <div className="text-2xl font-bold text-brand-cyan">{lineLinkedCount}</div>
          <div className="text-gray-400 text-sm">LINE Linked</div>
        </div>
      </div>

      {/* Liquidity North Star — the marketplace-health metric that matters */}
      <div className={`rounded-xl border p-6 ${
        liquidityNorthStar.status === 'healthy'
          ? 'bg-emerald-500/10 border-emerald-500/30'
          : liquidityNorthStar.status === 'warning'
          ? 'bg-amber-500/10 border-amber-500/30'
          : liquidityNorthStar.status === 'critical'
          ? 'bg-red-500/10 border-red-500/30'
          : 'bg-stone-500/10 border-stone-500/30'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-xs uppercase tracking-widest font-bold opacity-70">
              Liquidity North Star · Last 30 days
            </p>
            <h2 className="text-xl font-playfair font-bold text-white mt-1">
              Gigs with ≥1 applicant within 48h
            </h2>
          </div>
          <div className="text-right">
            {liquidityNorthStar.percent !== null ? (
              <>
                <div className={`text-5xl font-playfair font-bold ${
                  liquidityNorthStar.status === 'healthy' ? 'text-emerald-300' :
                  liquidityNorthStar.status === 'warning' ? 'text-amber-300' :
                  'text-red-300'
                }`}>
                  {liquidityNorthStar.percent}%
                </div>
                <div className="text-sm text-stone-400 mt-1">
                  {liquidityNorthStar.qualifiedGigs} / {liquidityNorthStar.totalGigs} gigs
                </div>
              </>
            ) : (
              <div className="text-sm text-stone-400">
                No gigs posted yet in the last 30 days
              </div>
            )}
          </div>
        </div>
        <p className="text-xs text-stone-400 mt-3 leading-relaxed">
          This is the single metric that tells you whether the marketplace is
          functioning. Target: <strong>80%+</strong>. Below 50% means supply is
          not reaching demand — escalate with outreach, better matching, or
          artist notifications.
        </p>
      </div>

      {/* LINE Notifications */}
      <LineActions />

      {/* LINE Group Links */}
      <LineGroupLinks />

      {/* LINE Linked Accounts */}
      <LineLinkedAccounts />

      {/* Calendar */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
        <ScheduleCalendar />
      </div>
    </div>
  );
}

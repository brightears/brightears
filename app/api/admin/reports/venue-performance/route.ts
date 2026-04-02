import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import {
  renderVenuePerformanceHTML,
  type VenuePerformanceData,
  type DJBreakdown,
  type RatingDistribution,
  type DayOfWeekData,
  type Recommendation,
} from '@/lib/report-templates/venue-performance';

/**
 * Authenticate via Clerk session (ADMIN role) or VINYL_API_KEY header.
 */
async function isAuthorized(req: NextRequest): Promise<boolean> {
  const vinylKey = process.env.VINYL_API_KEY;
  if (vinylKey) {
    const authHeader = req.headers.get('authorization');
    if (authHeader === `Bearer ${vinylKey}`) return true;

    const headerKey = req.headers.get('x-vinyl-api-key');
    if (headerKey === vinylKey) return true;
  }

  const user = await getCurrentUser();
  return !!(user && user.role === 'ADMIN');
}

/**
 * Parse "HH:MM" time string into hours as a float.
 * Handles after-midnight times (e.g., "02:00" after "22:00").
 */
function timeToHours(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h + (m || 0) / 60;
}

/**
 * Calculate shift duration in hours, handling midnight crossover.
 */
function shiftDuration(startTime: string, endTime: string): number {
  let start = timeToHours(startTime);
  let end = timeToHours(endTime);
  if (end <= start) end += 24; // crosses midnight
  return end - start;
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * GET /api/admin/reports/venue-performance
 *
 * Query params:
 *   venueId (required) — venue UUID
 *   month   (required) — YYYY-MM format
 *   format  — 'json' (default) or 'html'
 */
export async function GET(req: NextRequest) {
  try {
    if (!(await isAuthorized(req))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const venueId = searchParams.get('venueId');
    const monthParam = searchParams.get('month');
    const format = searchParams.get('format') || 'json';

    if (!venueId) {
      return NextResponse.json({ error: 'venueId is required' }, { status: 400 });
    }
    if (!monthParam || !/^\d{4}-\d{2}$/.test(monthParam)) {
      return NextResponse.json({ error: 'month is required in YYYY-MM format' }, { status: 400 });
    }

    const [yearStr, monthStr] = monthParam.split('-');
    const year = parseInt(yearStr);
    const month = parseInt(monthStr);

    if (month < 1 || month > 12) {
      return NextResponse.json({ error: 'Invalid month' }, { status: 400 });
    }

    // Date ranges (UTC dates — Prisma DATE fields store midnight UTC)
    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 0)); // last day of month

    // Previous month range for comparison
    const prevStartDate = new Date(Date.UTC(year, month - 2, 1));
    const prevEndDate = new Date(Date.UTC(year, month - 1, 0));

    // Verify venue exists
    const venue = await prisma.venue.findUnique({
      where: { id: venueId },
      select: { id: true, name: true },
    });

    if (!venue) {
      return NextResponse.json({ error: 'Venue not found' }, { status: 404 });
    }

    // Fetch all data in parallel
    const [assignments, feedback, nightFeedback, prevFeedback] = await Promise.all([
      // Current month assignments with artist info
      prisma.venueAssignment.findMany({
        where: {
          venueId,
          date: { gte: startDate, lte: endDate },
          artistId: { not: null }, // only actual DJ assignments
          specialEvent: null,
        },
        include: {
          artist: { select: { id: true, stageName: true } },
        },
        orderBy: { date: 'asc' },
      }),

      // Current month feedback
      prisma.venueFeedback.findMany({
        where: {
          venueId,
          assignment: {
            date: { gte: startDate, lte: endDate },
          },
        },
        include: {
          artist: { select: { id: true, stageName: true } },
          assignment: { select: { date: true } },
        },
      }),

      // Current month night feedback
      prisma.venueNightFeedback.findMany({
        where: {
          venueId,
          date: { gte: startDate, lte: endDate },
        },
      }),

      // Previous month feedback for comparison
      prisma.venueFeedback.findMany({
        where: {
          venueId,
          assignment: {
            date: { gte: prevStartDate, lte: prevEndDate },
          },
        },
        include: {
          artist: { select: { id: true, stageName: true } },
        },
      }),
    ]);

    // --- Monthly Summary ---
    const totalPerformances = assignments.length;
    const totalHours = assignments.reduce(
      (sum, a) => sum + shiftDuration(a.startTime, a.endTime),
      0
    );

    const allRatings = feedback.map((f) => f.overallRating);
    const avgRating = allRatings.length > 0
      ? allRatings.reduce((a, b) => a + b, 0) / allRatings.length
      : 0;

    const prevRatings = prevFeedback.map((f) => f.overallRating);
    const prevAvgRating = prevRatings.length > 0
      ? prevRatings.reduce((a, b) => a + b, 0) / prevRatings.length
      : null;

    // --- DJ Breakdown ---
    const djMap = new Map<string, {
      stageName: string;
      shifts: number;
      hours: number;
      ratings: number[];
    }>();

    for (const a of assignments) {
      if (!a.artist) continue;
      const key = a.artistId!;
      if (!djMap.has(key)) {
        djMap.set(key, {
          stageName: a.artist.stageName,
          shifts: 0,
          hours: 0,
          ratings: [],
        });
      }
      const dj = djMap.get(key)!;
      dj.shifts++;
      dj.hours += shiftDuration(a.startTime, a.endTime);
    }

    // Add ratings to DJ map
    for (const f of feedback) {
      const key = f.artistId;
      if (djMap.has(key)) {
        djMap.get(key)!.ratings.push(f.overallRating);
      }
    }

    // Previous month DJ ratings for trend
    const prevDjRatings = new Map<string, number[]>();
    for (const f of prevFeedback) {
      if (!prevDjRatings.has(f.artistId)) {
        prevDjRatings.set(f.artistId, []);
      }
      prevDjRatings.get(f.artistId)!.push(f.overallRating);
    }

    const djBreakdown: DJBreakdown[] = Array.from(djMap.entries())
      .map(([artistId, dj]) => {
        const djAvg = dj.ratings.length > 0
          ? dj.ratings.reduce((a, b) => a + b, 0) / dj.ratings.length
          : 0;
        const prevRats = prevDjRatings.get(artistId);
        const prevDjAvg = prevRats && prevRats.length > 0
          ? prevRats.reduce((a, b) => a + b, 0) / prevRats.length
          : null;

        return {
          stageName: dj.stageName,
          shifts: dj.shifts,
          hours: dj.hours,
          avgRating: djAvg,
          prevAvgRating: prevDjAvg,
        };
      })
      .sort((a, b) => b.shifts - a.shifts);

    // --- Rating Distribution ---
    const ratingDistribution: RatingDistribution = {
      star5: allRatings.filter((r) => r === 5).length,
      star4: allRatings.filter((r) => r === 4).length,
      star3: allRatings.filter((r) => r === 3).length,
      star2: allRatings.filter((r) => r === 2).length,
      star1: allRatings.filter((r) => r === 1).length,
      total: allRatings.length,
    };

    // --- Top Performer ---
    const ratedDJs = djBreakdown.filter((dj) => dj.avgRating > 0);
    const topPerformer = ratedDJs.length > 0
      ? ratedDJs.sort((a, b) => b.avgRating - a.avgRating || b.shifts - a.shifts)[0]
      : null;

    // Re-sort djBreakdown by shifts (topPerformer sort may have modified order)
    djBreakdown.sort((a, b) => b.shifts - a.shifts);

    // --- Day of Week ---
    const dayData: Record<number, { count: number; headcounts: number[]; nightRatings: number[] }> = {};
    for (let i = 0; i < 7; i++) {
      dayData[i] = { count: 0, headcounts: [], nightRatings: [] };
    }

    for (const a of assignments) {
      const dayOfWeek = a.date.getUTCDay();
      dayData[dayOfWeek].count++;
    }

    for (const nf of nightFeedback) {
      const dayOfWeek = nf.date.getUTCDay();
      if (dayData[dayOfWeek]) {
        if (nf.estimatedHeadcount !== null) {
          dayData[dayOfWeek].headcounts.push(nf.estimatedHeadcount);
        }
        dayData[dayOfWeek].nightRatings.push(nf.overallNightRating);
      }
    }

    const dayOfWeek: DayOfWeekData[] = DAY_NAMES.map((name, i) => {
      const d = dayData[i];
      const avgHeadcount = d.headcounts.length > 0
        ? Math.round(d.headcounts.reduce((a, b) => a + b, 0) / d.headcounts.length)
        : null;
      const avgCrowdMetric = d.nightRatings.length > 0
        ? d.nightRatings.reduce((a, b) => a + b, 0) / d.nightRatings.length
        : null;

      return {
        day: name,
        performanceCount: d.count,
        avgCrowdMetric,
        avgHeadcount,
      };
    });

    // --- Recommendations ---
    const recommendations: Recommendation[] = [];

    // DJs with consistently high ratings
    for (const dj of djBreakdown) {
      if (dj.avgRating >= 4.8 && dj.shifts >= 3) {
        recommendations.push({
          type: 'positive',
          message: `Consider adding ${dj.stageName} to additional nights (${dj.avgRating.toFixed(1)} avg across ${dj.shifts} shifts).`,
        });
      }
    }

    // DJs below threshold
    for (const dj of djBreakdown) {
      if (dj.avgRating > 0 && dj.avgRating < 3.5 && dj.shifts >= 2) {
        recommendations.push({
          type: 'warning',
          message: `Review ${dj.stageName}'s recent performances (${dj.avgRating.toFixed(1)} avg rating across ${dj.shifts} shifts).`,
        });
      }
    }

    // Feedback gaps — days with performances but no feedback
    const feedbackDates = new Set(
      feedback.map((f) => f.assignment?.date?.toISOString().slice(0, 10)).filter(Boolean)
    );
    const assignmentDates = assignments.map((a) => a.date.toISOString().slice(0, 10));
    const missingFeedbackDays = new Set<string>();
    for (const d of assignmentDates) {
      if (!feedbackDates.has(d)) {
        const dayName = DAY_NAMES[new Date(d + 'T00:00:00Z').getUTCDay()];
        missingFeedbackDays.add(dayName);
      }
    }
    if (missingFeedbackDays.size > 0) {
      const dayList = Array.from(missingFeedbackDays).join(', ');
      recommendations.push({
        type: 'info',
        message: `Feedback gaps on some ${dayList} nights — ensure venue managers are submitting ratings.`,
      });
    }

    // Format month name
    const monthName = new Date(year, month - 1).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });

    const generatedAt = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Bangkok',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const reportData: VenuePerformanceData = {
      venueName: venue.name,
      month: monthName,
      monthKey: monthParam,
      totalPerformances,
      totalHours,
      avgRating,
      prevAvgRating,
      djBreakdown,
      ratingDistribution,
      topPerformer: topPerformer
        ? { stageName: topPerformer.stageName, avgRating: topPerformer.avgRating, shifts: topPerformer.shifts }
        : null,
      dayOfWeek,
      recommendations,
      generatedAt,
    };

    if (format === 'html') {
      const html = renderVenuePerformanceHTML(reportData);
      return new NextResponse(html, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
      });
    }

    // Default: JSON
    return NextResponse.json(reportData);
  } catch (error) {
    console.error('Error generating venue performance report:', error);
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

interface Alert {
  type: 'warning' | 'critical';
  category: 'rating_drop' | 'unassigned_slot' | 'overworked' | 'venue_health';
  title: string;
  description: string;
  entityId?: string;
  entityName?: string;
}

interface Recommendation {
  type: 'positive' | 'action';
  category: 'top_performer' | 'trending_venue' | 'suggestion';
  title: string;
  description: string;
  entityId?: string;
  entityName?: string;
}

/**
 * GET /api/admin/recommendations
 * Generate rule-based alerts and recommendations for admin dashboard
 */
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);

    const alerts: Alert[] = [];
    const recommendations: Recommendation[] = [];

    // Get all DJs with their feedback
    const djs = await prisma.artist.findMany({
      where: { category: 'DJ' },
      include: {
        venueFeedback: {
          select: {
            overallRating: true,
            createdAt: true,
          },
        },
        venueAssignments: {
          where: {
            date: {
              gte: weekStart,
              lte: weekEnd,
            },
          },
        },
      },
    });

    // Rule 1: Rating Drop Alert
    for (const dj of djs) {
      const thisMonthFeedback = dj.venueFeedback.filter(
        (f) => new Date(f.createdAt) >= thisMonthStart
      );
      const lastMonthFeedback = dj.venueFeedback.filter(
        (f) =>
          new Date(f.createdAt) >= lastMonthStart &&
          new Date(f.createdAt) <= lastMonthEnd
      );

      if (thisMonthFeedback.length >= 2 && lastMonthFeedback.length >= 2) {
        const thisMonthAvg =
          thisMonthFeedback.reduce((sum, f) => sum + f.overallRating, 0) /
          thisMonthFeedback.length;
        const lastMonthAvg =
          lastMonthFeedback.reduce((sum, f) => sum + f.overallRating, 0) /
          lastMonthFeedback.length;

        if (lastMonthAvg - thisMonthAvg >= 0.5) {
          alerts.push({
            type: thisMonthAvg < 3 ? 'critical' : 'warning',
            category: 'rating_drop',
            title: `${dj.stageName}'s rating dropped`,
            description: `Rating went from ${lastMonthAvg.toFixed(1)} to ${thisMonthAvg.toFixed(1)} - consider having a conversation`,
            entityId: dj.id,
            entityName: dj.stageName,
          });
        }
      }

      // Rule 3: Overworked DJ
      if (dj.venueAssignments.length > 5) {
        alerts.push({
          type: 'warning',
          category: 'overworked',
          title: `${dj.stageName} is overbooked`,
          description: `Has ${dj.venueAssignments.length} shows this week - monitor for burnout`,
          entityId: dj.id,
          entityName: dj.stageName,
        });
      }

      // Rule 4: High Performer Recognition
      const totalFeedback = dj.venueFeedback.length;
      if (totalFeedback >= 10) {
        const avgRating =
          dj.venueFeedback.reduce((sum, f) => sum + f.overallRating, 0) /
          totalFeedback;
        if (avgRating >= 4.5) {
          recommendations.push({
            type: 'positive',
            category: 'top_performer',
            title: `${dj.stageName} is a top performer`,
            description: `${avgRating.toFixed(1)} average rating across ${totalFeedback} reviews - consider expanding to new venues`,
            entityId: dj.id,
            entityName: dj.stageName,
          });
        }
      }
    }

    // Rule 2: Unassigned Slots
    const venues = await prisma.venue.findMany({
      where: { isActive: true },
      select: { id: true, name: true, operatingHours: true },
    });

    // Get all assignments in the next 7 days
    const upcomingAssignments = await prisma.venueAssignment.findMany({
      where: {
        date: {
          gte: now,
          lte: oneWeekFromNow,
        },
      },
      select: {
        venueId: true,
        date: true,
        slot: true,
      },
    });

    // Check for unassigned slots (simplified - would need more complex logic for multi-slot venues)
    for (const venue of venues) {
      // Get dates in the next 7 days
      for (let i = 0; i < 7; i++) {
        const checkDate = new Date(now);
        checkDate.setDate(now.getDate() + i);
        checkDate.setHours(0, 0, 0, 0);

        const dateStr = checkDate.toISOString().split('T')[0];
        const hasAssignment = upcomingAssignments.some(
          (a) =>
            a.venueId === venue.id &&
            new Date(a.date).toISOString().split('T')[0] === dateStr
        );

        if (!hasAssignment && i <= 3) {
          // Only alert for next 3 days
          const dayName = checkDate.toLocaleDateString('en-US', { weekday: 'short' });
          alerts.push({
            type: i === 0 ? 'critical' : 'warning',
            category: 'unassigned_slot',
            title: `Unassigned slot at ${venue.name}`,
            description: `${dayName} ${checkDate.toLocaleDateString()} needs a DJ assigned`,
            entityId: venue.id,
            entityName: venue.name,
          });
        }
      }
    }

    // Rule 5: Venue Health Check
    const venuesWithFeedback = await prisma.venue.findMany({
      where: { isActive: true },
      include: {
        feedback: {
          where: {
            createdAt: {
              gte: lastMonthStart,
            },
          },
          select: {
            overallRating: true,
          },
        },
      },
    });

    for (const venue of venuesWithFeedback) {
      if (venue.feedback.length >= 5) {
        const avgRating =
          venue.feedback.reduce((sum, f) => sum + f.overallRating, 0) /
          venue.feedback.length;

        if (avgRating < 3.5) {
          alerts.push({
            type: 'warning',
            category: 'venue_health',
            title: `${venue.name} ratings are low`,
            description: `Overall rating is ${avgRating.toFixed(1)} - review DJ assignments`,
            entityId: venue.id,
            entityName: venue.name,
          });
        } else if (avgRating >= 4.5) {
          recommendations.push({
            type: 'positive',
            category: 'trending_venue',
            title: `${venue.name} is performing great`,
            description: `${avgRating.toFixed(1)} average rating - maintain current DJ lineup`,
            entityId: venue.id,
            entityName: venue.name,
          });
        }
      }
    }

    // Sort alerts by type (critical first)
    alerts.sort((a, b) => {
      if (a.type === 'critical' && b.type !== 'critical') return -1;
      if (a.type !== 'critical' && b.type === 'critical') return 1;
      return 0;
    });

    // Generate summary stats
    const stats = {
      totalDJs: djs.length,
      activeDJsThisWeek: djs.filter((dj) => dj.venueAssignments.length > 0).length,
      totalVenues: venues.length,
      alertsCount: alerts.length,
      criticalAlerts: alerts.filter((a) => a.type === 'critical').length,
      recommendationsCount: recommendations.length,
    };

    return NextResponse.json({
      alerts,
      recommendations,
      stats,
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}

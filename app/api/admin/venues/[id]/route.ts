import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

/**
 * GET /api/admin/venues/[id]
 * Get detailed venue information for admin view
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Get venue with corporate info
    const venue = await prisma.venue.findUnique({
      where: { id },
      include: {
        corporate: {
          include: {
            user: {
              select: {
                email: true,
              },
            },
          },
        },
      },
    });

    if (!venue) {
      return NextResponse.json({ error: 'Venue not found' }, { status: 404 });
    }

    // Get unique DJs assigned to this venue
    const djAssignments = await prisma.venueAssignment.findMany({
      where: { venueId: id },
      select: {
        artist: {
          select: {
            id: true,
            stageName: true,
            profileImage: true,
            genres: true,
          },
        },
      },
      distinct: ['artistId'],
    });

    const assignedDJs = djAssignments.map((a) => a.artist);

    // Get recent assignments (last 14 days + next 14 days)
    const now = new Date();
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const twoWeeksFromNow = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

    const recentAssignments = await prisma.venueAssignment.findMany({
      where: {
        venueId: id,
        date: {
          gte: twoWeeksAgo,
          lte: twoWeeksFromNow,
        },
      },
      orderBy: { date: 'asc' },
      include: {
        artist: {
          select: {
            id: true,
            stageName: true,
            profileImage: true,
          },
        },
        feedback: {
          select: {
            id: true,
            overallRating: true,
          },
        },
      },
    });

    // Get feedback stats
    const feedbackStats = await prisma.venueFeedback.aggregate({
      where: { venueId: id },
      _count: { id: true },
      _avg: { overallRating: true },
    });

    // Get recent feedback
    const recentFeedback = await prisma.venueFeedback.findMany({
      where: { venueId: id },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        artist: {
          select: {
            id: true,
            stageName: true,
          },
        },
      },
    });

    // Calculate assignment stats
    const assignmentStats = await prisma.venueAssignment.groupBy({
      by: ['status'],
      where: { venueId: id },
      _count: { id: true },
    });

    const totalAssignments = assignmentStats.reduce(
      (sum, s) => sum + s._count.id,
      0
    );
    const completedAssignments =
      assignmentStats.find((s) => s.status === 'COMPLETED')?._count.id || 0;
    const scheduledAssignments =
      assignmentStats.find((s) => s.status === 'SCHEDULED')?._count.id || 0;

    return NextResponse.json({
      venue,
      assignedDJs,
      recentAssignments,
      stats: {
        totalAssignments,
        completedAssignments,
        scheduledAssignments,
        totalFeedback: feedbackStats._count.id,
        avgRating: feedbackStats._avg.overallRating
          ? Math.round(feedbackStats._avg.overallRating * 10) / 10
          : null,
      },
      recentFeedback,
    });
  } catch (error) {
    console.error('Error fetching venue:', error);
    return NextResponse.json(
      { error: 'Failed to fetch venue' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(req.url);
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
  const limit = Math.min(50, parseInt(url.searchParams.get('limit') || '20'));
  const venueId = url.searchParams.get('venueId') || undefined;

  const where: any = {};
  if (venueId) where.venueId = venueId;

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [feedback, total, allRatings, thisWeekCount, venues] = await Promise.all([
    prisma.venueFeedback.findMany({
      where,
      include: {
        artist: { select: { id: true, stageName: true, profileImage: true } },
        venue: { select: { id: true, name: true } },
        assignment: { select: { date: true, startTime: true, endTime: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.venueFeedback.count({ where }),
    prisma.venueFeedback.findMany({
      where,
      select: { overallRating: true },
    }),
    prisma.venueFeedback.count({
      where: { ...where, createdAt: { gte: weekAgo } },
    }),
    prisma.venue.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
  ]);

  const avgRating = allRatings.length > 0
    ? allRatings.reduce((sum, f) => sum + f.overallRating, 0) / allRatings.length
    : 0;

  return NextResponse.json({
    feedback,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    venues,
    stats: {
      count: allRatings.length,
      avgRating: Math.round(avgRating * 10) / 10,
      thisWeek: thisWeekCount,
    },
  });
}

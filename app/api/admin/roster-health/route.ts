import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();
  const start30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const start60 = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  const toDate = (d: Date) => d.toISOString().slice(0, 10);

  // Last 30 days + prior 30 days aggregates, joined in a single raw query
  const rows = await prisma.$queryRawUnsafe<Array<{
    stageName: string;
    shifts_30d: bigint;
    avg_30d: string | null;
    low_ratings: bigint;
    fives: bigint;
    shifts_prior_30d: bigint | null;
    avg_prior_30d: string | null;
    drift: string | null;
  }>>(`
    WITH recent AS (
      SELECT
        a."stageName",
        COUNT(*) AS n,
        ROUND(AVG(f."overallRating")::numeric, 2) AS avg,
        SUM(CASE WHEN f."overallRating" <= 2 THEN 1 ELSE 0 END) AS low,
        SUM(CASE WHEN f."overallRating" = 5 THEN 1 ELSE 0 END) AS fives
      FROM "VenueFeedback" f
      JOIN "Artist" a ON f."artistId" = a.id
      JOIN "VenueAssignment" va ON f."assignmentId" = va.id
      WHERE va.date >= $1::date AND va.date <= $2::date
      GROUP BY a."stageName"
    ),
    prior AS (
      SELECT
        a."stageName",
        COUNT(*) AS n_prior,
        ROUND(AVG(f."overallRating")::numeric, 2) AS avg_prior
      FROM "VenueFeedback" f
      JOIN "Artist" a ON f."artistId" = a.id
      JOIN "VenueAssignment" va ON f."assignmentId" = va.id
      WHERE va.date >= $3::date AND va.date < $1::date
      GROUP BY a."stageName"
    )
    SELECT
      r."stageName",
      r.n::bigint AS shifts_30d,
      r.avg::text AS avg_30d,
      r.low::bigint AS low_ratings,
      r.fives::bigint AS fives,
      p.n_prior::bigint AS shifts_prior_30d,
      p.avg_prior::text AS avg_prior_30d,
      (r.avg - COALESCE(p.avg_prior, r.avg))::numeric(4,2)::text AS drift
    FROM recent r
    LEFT JOIN prior p ON r."stageName" = p."stageName"
    WHERE r.n >= 2
    ORDER BY (r.avg - COALESCE(p.avg_prior, r.avg)) NULLS LAST, r.avg DESC
  `, toDate(start30), toDate(now), toDate(start60));

  const djs = rows.map((r) => ({
    stageName: r.stageName,
    shifts30d: Number(r.shifts_30d),
    avg30d: r.avg_30d ? Number(r.avg_30d) : null,
    lowRatings: Number(r.low_ratings),
    fives: Number(r.fives),
    shiftsPrior30d: r.shifts_prior_30d === null ? null : Number(r.shifts_prior_30d),
    avgPrior30d: r.avg_prior_30d ? Number(r.avg_prior_30d) : null,
    drift: r.drift === null ? null : Number(r.drift),
  }));

  return NextResponse.json({
    generatedAt: now.toISOString(),
    windowStart: toDate(start30),
    windowEnd: toDate(now),
    djs,
  });
}

/**
 * Admin LINE Group Linking API
 *
 * POST /api/admin/line/link-group
 *   Links a LINE group chat ID to a venue.
 *   Body: { venueId, lineGroupId, groupType?: 'dj' | 'manager' }
 *   groupType defaults to 'dj' (lineGroupId). 'manager' updates lineManagerGroupId.
 *
 * GET /api/admin/line/link-group
 *   Lists all venues with their lineGroupId and lineManagerGroupId status.
 */

import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const venues = await prisma.venue.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      lineGroupId: true,
      lineManagerGroupId: true,
    },
    orderBy: { name: 'asc' },
  });

  return NextResponse.json({ venues });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { venueId, lineGroupId, groupType } = await req.json();

  if (!venueId) {
    return NextResponse.json(
      { error: 'venueId is required' },
      { status: 400 },
    );
  }

  const venue = await prisma.venue.findUnique({
    where: { id: venueId },
    select: { id: true, name: true },
  });

  if (!venue) {
    return NextResponse.json({ error: 'Venue not found' }, { status: 404 });
  }

  // Empty string clears the link
  const value = lineGroupId?.trim() || null;
  const field = groupType === 'manager' ? 'lineManagerGroupId' : 'lineGroupId';

  await prisma.venue.update({
    where: { id: venueId },
    data: { [field]: value },
  });

  return NextResponse.json({
    success: true,
    venue: venue.name,
    [field]: value,
  });
}

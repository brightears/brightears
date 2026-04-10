/**
 * Venue profile editor API
 *
 * GET   /api/venue-portal/venue                Get my venue(s) with full details
 * PATCH /api/venue-portal/venue?venueId=...    Update venue profile fields
 *
 * Venues can edit: name, venueType, address, city, contactPerson, contactEmail,
 * contactPhone, operatingHours. LINE group IDs are ADMIN-only.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const patchSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  venueType: z.string().max(60).optional().nullable(),
  address: z.string().max(200).optional().nullable(),
  city: z.string().max(80).optional(),
  contactPerson: z.string().max(100).optional().nullable(),
  contactEmail: z.string().email().max(200).optional().nullable(),
  contactPhone: z.string().max(50).optional().nullable(),
  operatingHours: z
    .object({
      startTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
      endTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
    })
    .optional()
    .nullable(),
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'CORPORATE' && user.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const where: any =
    user.role === 'ADMIN'
      ? { isActive: true }
      : { corporate: { userId: user.id }, isActive: true };

  const venues = await prisma.venue.findMany({
    where,
    select: {
      id: true,
      name: true,
      venueType: true,
      address: true,
      city: true,
      contactPerson: true,
      contactEmail: true,
      contactPhone: true,
      operatingHours: true,
      isActive: true,
    },
    orderBy: { name: 'asc' },
  });

  return NextResponse.json({ venues });
}

export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'CORPORATE' && user.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const venueId = searchParams.get('venueId');
  if (!venueId) {
    return NextResponse.json({ error: 'Missing venueId' }, { status: 400 });
  }

  // Ownership check (admins bypass)
  if (user.role !== 'ADMIN') {
    const owned = await prisma.venue.findFirst({
      where: { id: venueId, corporate: { userId: user.id } },
      select: { id: true },
    });
    if (!owned) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
  }

  const body = await req.json();
  const validation = patchSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: validation.error.issues },
      { status: 400 }
    );
  }

  const updated = await prisma.venue.update({
    where: { id: venueId },
    data: validation.data as any,
    select: {
      id: true,
      name: true,
      venueType: true,
      address: true,
      city: true,
      contactPerson: true,
      contactEmail: true,
      contactPhone: true,
      operatingHours: true,
    },
  });

  return NextResponse.json({ success: true, venue: updated });
}

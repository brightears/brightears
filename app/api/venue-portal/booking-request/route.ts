import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { z } from 'zod';

const requestSchema = z.object({
  artistId: z.string().min(1),
  artistName: z.string().min(1),
  venueId: z.string().min(1),
  venueName: z.string().optional(),
  eventDate: z.string().optional(),
  message: z.string().max(1000).optional(),
});

/**
 * POST /api/venue-portal/booking-request
 *
 * Venue submits a booking request for an artist.
 * Creates a BookingInquiry record and notifies admin.
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'CORPORATE' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validation = requestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.issues },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Verify the venue belongs to this user
    const venue = await prisma.venue.findFirst({
      where: {
        id: data.venueId,
        corporate: { userId: user.id },
      },
    });

    if (!venue && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Venue not found' }, { status: 404 });
    }

    // Create a booking inquiry
    const inquiry = await prisma.bookingInquiry.create({
      data: {
        userId: user.id,
        artistId: data.artistId,
        eventType: 'VENUE_BOOKING_REQUEST',
        location: data.venueName || venue?.name || null,
        inquiryMethod: 'PLATFORM',
        eventDate: data.eventDate ? new Date(data.eventDate) : null,
      },
    });

    // Notify via webhook channel (Tier 2 — Norbert reviews)
    try {
      await fetch('http://localhost:8200/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'brightears',
          event_type: 'booking_created',
          data: {
            inquiryId: inquiry.id,
            venueName: data.venueName || venue?.name,
            artistName: data.artistName,
            requestedBy: user.email,
            message: data.message,
          },
        }),
      });
    } catch {
      // Webhook notification failed — non-critical
    }

    return NextResponse.json({
      success: true,
      inquiryId: inquiry.id,
    });
  } catch (error: any) {
    console.error('Booking request error:', error);
    return NextResponse.json(
      { error: 'Failed to submit booking request' },
      { status: 500 }
    );
  }
}

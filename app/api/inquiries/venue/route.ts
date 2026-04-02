import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';

// Rate limiting map
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMIT = {
  maxRequests: 3,
  windowMs: 60 * 60 * 1000, // 1 hour
};

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetAt: now + RATE_LIMIT.windowMs,
    });
    return true;
  }

  if (record.count >= RATE_LIMIT.maxRequests) {
    return false;
  }

  record.count++;
  return true;
}

const venueInquirySchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  phone: z.string().max(20).optional().default(''),
  venueName: z.string().min(2).max(100),
  venueType: z.enum(['hotel', 'restaurant', 'bar_lounge', 'rooftop', 'event_space', 'other']),
  entertainmentType: z.enum(['regular_nightly', 'private_event', 'special_event', 'other']),
  musicStyles: z.array(z.string()).default([]),
  nightsPerWeek: z.number().int().min(1).max(7).nullable().optional(),
  eventDate: z.string().nullable().optional(),
  message: z.string().max(1000).optional().default(''),
});

const VENUE_TYPE_LABELS: Record<string, string> = {
  hotel: 'Hotel',
  restaurant: 'Restaurant',
  bar_lounge: 'Bar / Lounge',
  rooftop: 'Rooftop',
  event_space: 'Event Space',
  other: 'Other',
};

const ENTERTAINMENT_TYPE_LABELS: Record<string, string> = {
  regular_nightly: 'Regular Nightly DJ',
  private_event: 'Private Event DJ',
  special_event: 'Special Event',
  other: 'Other',
};

const MUSIC_STYLE_LABELS: Record<string, string> = {
  deep_house: 'Deep House',
  lounge: 'Lounge',
  rnb_hiphop: 'R&B / Hip-Hop',
  pop_commercial: 'Pop / Commercial',
  latin: 'Latin',
  open_format: 'Open Format',
  other: 'Other',
};

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIp =
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown';

    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again in an hour.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validated = venueInquirySchema.parse(body);

    // Save to database
    const inquiry = await prisma.venueInquiry.create({
      data: {
        name: validated.name,
        email: validated.email,
        phone: validated.phone || null,
        venueName: validated.venueName,
        venueType: validated.venueType,
        entertainmentType: validated.entertainmentType,
        musicStyles: validated.musicStyles,
        nightsPerWeek: validated.nightsPerWeek ?? null,
        eventDate: validated.eventDate ? new Date(validated.eventDate) : null,
        message: validated.message || null,
        ipAddress: clientIp,
        userAgent: request.headers.get('user-agent') || null,
      },
    });

    // Send email notification
    try {
      const recipientEmail = process.env.CONTACT_FORM_EMAIL || 'norbert@brightears.io';
      const musicStyleLabels = validated.musicStyles
        .map(s => MUSIC_STYLE_LABELS[s] || s)
        .join(', ');

      await sendEmail({
        to: recipientEmail,
        subject: `[Venue Inquiry] ${validated.venueName} — ${ENTERTAINMENT_TYPE_LABELS[validated.entertainmentType]}`,
        html: `
          <h2>New Venue Entertainment Inquiry</h2>
          <hr>
          <h3>Contact</h3>
          <p><strong>Name:</strong> ${validated.name}</p>
          <p><strong>Email:</strong> ${validated.email}</p>
          ${validated.phone ? `<p><strong>Phone:</strong> ${validated.phone}</p>` : ''}
          <h3>Venue</h3>
          <p><strong>Venue Name:</strong> ${validated.venueName}</p>
          <p><strong>Venue Type:</strong> ${VENUE_TYPE_LABELS[validated.venueType]}</p>
          <h3>Entertainment</h3>
          <p><strong>Type:</strong> ${ENTERTAINMENT_TYPE_LABELS[validated.entertainmentType]}</p>
          ${musicStyleLabels ? `<p><strong>Music Styles:</strong> ${musicStyleLabels}</p>` : ''}
          ${validated.nightsPerWeek ? `<p><strong>Nights per Week:</strong> ${validated.nightsPerWeek}</p>` : ''}
          ${validated.eventDate ? `<p><strong>Event Date:</strong> ${validated.eventDate}</p>` : ''}
          ${validated.message ? `<h3>Additional Details</h3><p>${validated.message.replace(/\n/g, '<br>')}</p>` : ''}
          <hr>
          <p><small>Inquiry ID: ${inquiry.id}</small></p>
          <p><small>Submitted at: ${new Date().toISOString()}</small></p>
        `,
      });
    } catch (emailErr) {
      console.error('Failed to send venue inquiry email:', emailErr);
      // Don't fail the request if email fails
    }

    // POST to webhook channel for Vinyl notification
    try {
      await fetch('http://localhost:8200/webhook/brightears', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: 'booking_created',
          source: 'brightears',
          data: {
            inquiry_id: inquiry.id,
            name: validated.name,
            email: validated.email,
            venue_name: validated.venueName,
            venue_type: validated.venueType,
            entertainment_type: validated.entertainmentType,
            music_styles: validated.musicStyles,
            nights_per_week: validated.nightsPerWeek,
            event_date: validated.eventDate,
          },
        }),
      });
    } catch (webhookErr) {
      // Webhook failure is non-critical
      console.error('Failed to notify webhook:', webhookErr);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Your inquiry has been received. We\'ll get back to you within 24 hours.',
        inquiryId: inquiry.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Venue inquiry submission error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid form data', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to submit inquiry. Please try again.' },
      { status: 500 }
    );
  }
}

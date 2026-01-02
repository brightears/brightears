import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sendEmail } from '@/lib/email';

// Rate limiting map (in-memory, resets on server restart)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMIT = {
  maxRequests: 3, // 3 submissions per window
  windowMs: 60 * 60 * 1000, // 1 hour
};

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetAt) {
    // Create new rate limit window
    rateLimitMap.set(identifier, {
      count: 1,
      resetAt: now + RATE_LIMIT.windowMs,
    });
    return true;
  }

  if (record.count >= RATE_LIMIT.maxRequests) {
    return false; // Rate limit exceeded
  }

  // Increment count
  record.count++;
  return true;
}

// Validation schemas for each form type
const generalSchema = z.object({
  type: z.literal('general'),
  name: z.string().min(2).max(50),
  email: z.string().email(),
  subject: z.string().optional().default('General Inquiry'),
  message: z.string().min(10).max(500),
});

const corporateSchema = z.object({
  type: z.literal('corporate'),
  companyName: z.string().min(2).max(100),
  contactPerson: z.string().min(2).max(50),
  email: z.string().email(),
  phone: z.string().min(9).max(15),
  eventType: z.string().min(1),
  eventDate: z.string().min(1), // ISO date string
  message: z.string().min(10).max(500),
});

const artistSupportSchema = z.object({
  type: z.literal('artistSupport'),
  artistName: z.string().min(3).max(30),
  email: z.string().email(),
  artistId: z.string().optional(),
  supportTopic: z.string().min(1),
  message: z.string().min(10).max(500),
});

const contactSchema = z.discriminatedUnion('type', [
  generalSchema,
  corporateSchema,
  artistSupportSchema,
]);

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIp =
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown';

    // Check rate limit
    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many requests. Please try again in an hour.',
        },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = contactSchema.parse(body);

    // Send email notification based on type
    let emailSent = false;
    let emailError: string | null = null;

    try {
      if (validatedData.type === 'general') {
        await sendEmail({
          to: 'support@brightears.io',
          subject: `[General Inquiry] ${validatedData.subject}`,
          html: `
            <h2>New General Inquiry</h2>
            <p><strong>From:</strong> ${validatedData.name}</p>
            <p><strong>Email:</strong> ${validatedData.email}</p>
            <p><strong>Subject:</strong> ${validatedData.subject}</p>
            <p><strong>Message:</strong></p>
            <p>${validatedData.message.replace(/\n/g, '<br>')}</p>
            <hr>
            <p><small>Submitted at: ${new Date().toISOString()}</small></p>
            <p><small>Client IP: ${clientIp}</small></p>
          `,
        });
        emailSent = true;
      } else if (validatedData.type === 'corporate') {
        await sendEmail({
          to: 'support@brightears.io',
          subject: `[Corporate Partnership] ${validatedData.companyName}`,
          html: `
            <h2>New Corporate Partnership Inquiry</h2>
            <p><strong>Company:</strong> ${validatedData.companyName}</p>
            <p><strong>Contact Person:</strong> ${validatedData.contactPerson}</p>
            <p><strong>Email:</strong> ${validatedData.email}</p>
            <p><strong>Phone:</strong> ${validatedData.phone}</p>
            <p><strong>Event Type:</strong> ${validatedData.eventType}</p>
            <p><strong>Expected Event Date:</strong> ${validatedData.eventDate}</p>
            <p><strong>Message:</strong></p>
            <p>${validatedData.message.replace(/\n/g, '<br>')}</p>
            <hr>
            <p><small>Submitted at: ${new Date().toISOString()}</small></p>
            <p><small>Client IP: ${clientIp}</small></p>
          `,
        });
        emailSent = true;
      } else if (validatedData.type === 'artistSupport') {
        await sendEmail({
          to: 'support@brightears.io',
          subject: `[Artist Support] ${validatedData.supportTopic} - ${validatedData.artistName}`,
          html: `
            <h2>New Artist Support Request</h2>
            <p><strong>Artist Name:</strong> ${validatedData.artistName}</p>
            <p><strong>Email:</strong> ${validatedData.email}</p>
            ${validatedData.artistId ? `<p><strong>Artist ID:</strong> ${validatedData.artistId}</p>` : ''}
            <p><strong>Support Topic:</strong> ${validatedData.supportTopic}</p>
            <p><strong>Message:</strong></p>
            <p>${validatedData.message.replace(/\n/g, '<br>')}</p>
            <hr>
            <p><small>Submitted at: ${new Date().toISOString()}</small></p>
            <p><small>Client IP: ${clientIp}</small></p>
          `,
        });
        emailSent = true;
      }
    } catch (emailErr) {
      console.error('Failed to send email notification:', emailErr);
      emailError = emailErr instanceof Error ? emailErr.message : 'Unknown error';
      // Don't fail the request if email fails - continue gracefully
    }

    // Send success response
    return NextResponse.json(
      {
        success: true,
        message: "Your message has been received. We'll get back to you within 24 hours.",
        emailSent,
        ...(emailError && { emailError }),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form submission error:', error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid form data',
          details: error.issues,
        },
        { status: 400 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to submit contact form. Please try again.',
      },
      { status: 500 }
    );
  }
}

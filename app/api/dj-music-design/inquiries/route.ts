import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// Rate limiting map (in-memory for simplicity - use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Validation schema
const inquirySchema = z.object({
  contactName: z.string().min(2, 'Contact name must be at least 2 characters').max(100),
  djName: z.string().max(100).optional(),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  serviceType: z.enum(['custom_mix', 'original_track', 'remix', 'curation', 'branding', 'education']),
  projectDescription: z.string().max(2000, 'Project description must be less than 2000 characters').optional(),
  budgetRange: z.enum(['basic', 'professional', 'premium', 'custom']).optional(),
  timeline: z.enum(['rush', 'normal', 'flexible']).optional(),
  message: z.string().max(1000, 'Message must be less than 1000 characters').optional()
});

// Rate limiting function (3 submissions per IP per 24 hours)
function checkRateLimit(ip: string): { allowed: boolean; remainingTime?: number } {
  const now = Date.now();
  const limit = rateLimitMap.get(ip);

  if (!limit || now > limit.resetTime) {
    // Reset or create new limit
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + 24 * 60 * 60 * 1000 // 24 hours
    });
    return { allowed: true };
  }

  if (limit.count >= 3) {
    const remainingTime = Math.ceil((limit.resetTime - now) / 1000 / 60); // minutes
    return { allowed: false, remainingTime };
  }

  limit.count += 1;
  return { allowed: true };
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               'unknown';

    // Check rate limit
    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `Too many submissions. Please try again in ${rateCheck.remainingTime} minutes.`
        },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate with Zod
    const validatedData = inquirySchema.parse(body);

    // Get user agent
    const userAgent = request.headers.get('user-agent') || undefined;

    // Create inquiry in database
    const inquiry = await prisma.dJMusicDesignInquiry.create({
      data: {
        contactName: validatedData.contactName,
        djName: validatedData.djName || null,
        email: validatedData.email,
        phone: validatedData.phone || null,
        serviceType: validatedData.serviceType,
        projectDescription: validatedData.projectDescription || null,
        budgetRange: validatedData.budgetRange || null,
        timeline: validatedData.timeline || null,
        message: validatedData.message || null,
        ipAddress: ip,
        userAgent
      }
    });

    // TODO: Send email notification to owner
    // This can be implemented using the existing email infrastructure
    // await sendEmail({
    //   to: 'hello@brightears.co',
    //   subject: 'New DJ Music Design Inquiry',
    //   template: 'dj-music-design-inquiry',
    //   data: inquiry
    // });

    return NextResponse.json(
      {
        success: true,
        message: 'Inquiry submitted successfully',
        inquiryId: inquiry.id
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('DJ Music Design inquiry error:', error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.issues.map(e => ({ field: e.path.join('.'), message: e.message }))
        },
        { status: 400 }
      );
    }

    // Handle Prisma errors
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'An inquiry with this email already exists' },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to submit inquiry. Please try again later.' },
      { status: 500 }
    );
  }
}

// GET endpoint for admin to retrieve inquiries (future implementation)
export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication check for admin users
    // For now, return unauthorized
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );

    // Future implementation:
    // const inquiries = await prisma.dJMusicDesignInquiry.findMany({
    //   orderBy: { createdAt: 'desc' },
    //   take: 50
    // });
    // return NextResponse.json({ inquiries });
  } catch (error) {
    console.error('DJ Music Design inquiries fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inquiries' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { djApplicationSchema } from '@/lib/validation/application-schemas';
import { z } from 'zod';

const prisma = new PrismaClient();

// Rate limiting: Track submissions by email/phone
const submissionTracker = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT = {
  maxApplications: 3,
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
};

function checkRateLimit(identifier: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = submissionTracker.get(identifier);

  if (!record || now > record.resetTime) {
    // Reset or create new tracking
    submissionTracker.set(identifier, {
      count: 1,
      resetTime: now + RATE_LIMIT.windowMs,
    });
    return { allowed: true, remaining: RATE_LIMIT.maxApplications - 1 };
  }

  if (record.count >= RATE_LIMIT.maxApplications) {
    return { allowed: false, remaining: 0 };
  }

  record.count += 1;
  return { allowed: true, remaining: RATE_LIMIT.maxApplications - record.count };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate with Zod schema
    const validationResult = djApplicationSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Rate limiting check
    const emailLimit = checkRateLimit(`email:${data.email}`);
    const phoneLimit = checkRateLimit(`phone:${data.phone}`);

    if (!emailLimit.allowed || !phoneLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: 'You have submitted too many applications. Please try again in 24 hours.',
        },
        { status: 429 }
      );
    }

    // Check for duplicate applications within 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const existingApplication = await prisma.application.findFirst({
      where: {
        OR: [
          { email: data.email },
          { phone: data.phone },
        ],
        submittedAt: {
          gte: sevenDaysAgo,
        },
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        {
          error: 'Duplicate application',
          message: 'You have already submitted an application recently. We will review it soon.',
          applicationId: existingApplication.id,
        },
        { status: 409 }
      );
    }

    // Create application in database
    const application = await prisma.application.create({
      data: {
        // Basic Info
        applicantName: data.fullName,
        email: data.email.toLowerCase(),
        phone: data.phone,
        lineId: data.lineId,
        stageName: data.stageName,
        bio: data.bio,
        category: data.category,
        genres: data.genres,
        profilePhotoUrl: data.profilePhotoUrl || '',

        // Optional Fields
        website: data.website || null,
        socialMediaLinks: data.socialMediaLinks || null,
        yearsExperience: data.yearsExperience || null,
        equipmentOwned: data.equipmentOwned || null,
        portfolioLinks: data.portfolioLinks || null,
        baseLocation: data.baseLocation || null,
        hourlyRateExpectation: data.hourlyRateExpectation ? String(data.hourlyRateExpectation) : null,

        // Music Design Service
        interestedInMusicDesign: data.interestedInMusicDesign || false,
        designFee: data.designFee ? String(data.designFee) : null,
        monthlyFee: data.monthlyFee ? String(data.monthlyFee) : null,

        // Status
        status: 'PENDING',
        submittedAt: new Date(),
      },
    });

    // Send email to owner (admin notification)
    try {
      await sendOwnerNotificationEmail(application, body.locale || 'en');
    } catch (emailError) {
      console.error('Failed to send owner notification email:', emailError);
      // Don't fail the request if email fails
    }

    // Send confirmation email to applicant
    try {
      await sendApplicantConfirmationEmail(application, body.locale || 'en');
    } catch (emailError) {
      console.error('Failed to send applicant confirmation email:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Application submitted successfully',
        applicationId: application.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Application submission error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Failed to submit application. Please try again later.',
      },
      { status: 500 }
    );
  }
}

// Email helper functions (placeholder implementations)
async function sendOwnerNotificationEmail(application: any, locale: string) {
  // This would integrate with your email service (Resend, etc.)
  // For now, just log
  console.log('Sending owner notification email for application:', application.id);

  // TODO: Implement actual email sending with Resend
  // See components/email/DJApplicationOwnerEmail.tsx for template

  const ownerEmail = process.env.OWNER_EMAIL || 'admin@brightears.com';

  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured. Skipping email.');
    return;
  }

  // Resend integration would go here
}

async function sendApplicantConfirmationEmail(application: any, locale: string) {
  // This would integrate with your email service (Resend, etc.)
  // For now, just log
  console.log('Sending applicant confirmation email for application:', application.id);

  // TODO: Implement actual email sending with Resend
  // See components/email/ApplicationReceivedEmail.tsx for template

  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured. Skipping email.');
    return;
  }

  // Resend integration would go here
}

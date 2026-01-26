import { NextRequest, NextResponse } from 'next/server';
import { djApplicationSchema } from '@/lib/validation/application-schemas';

// Lazy initialization to avoid build-time errors (env vars not available during build)
let resendInstance: any = null;
async function getResend() {
  if (!resendInstance) {
    const { Resend } = await import('resend');
    resendInstance = new Resend(process.env.RESEND_API_KEY);
  }
  return resendInstance;
}

// Rate limiting: Track submissions by email (in-memory)
const submissionTracker = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT = {
  maxApplications: 3,
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
};

function checkRateLimit(email: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = submissionTracker.get(email);

  if (!record || now > record.resetTime) {
    submissionTracker.set(email, {
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
    // Parse FormData
    const formData = await request.formData();
    const dataJson = formData.get('data') as string;
    const profilePhoto = formData.get('profilePhoto') as File | null;

    if (!dataJson) {
      return NextResponse.json(
        { error: 'Missing form data' },
        { status: 400 }
      );
    }

    const body = JSON.parse(dataJson);

    // Validate with Zod schema
    const validationResult = djApplicationSchema.safeParse(body);

    if (!validationResult.success) {
      console.error('Validation errors:', validationResult.error.issues);
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Validate photo
    if (!profilePhoto) {
      return NextResponse.json(
        { error: 'Profile photo is required' },
        { status: 400 }
      );
    }

    // Rate limiting check
    const emailLimit = checkRateLimit(data.email);

    if (!emailLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: 'You have submitted too many applications. Please try again in 24 hours.',
        },
        { status: 429 }
      );
    }

    // Use stageName if provided, otherwise use fullName
    const displayName = data.stageName || data.fullName;

    // Convert photo to base64 for email attachment
    const photoBuffer = Buffer.from(await profilePhoto.arrayBuffer());
    const photoBase64 = photoBuffer.toString('base64');
    const photoFilename = `${displayName.replace(/[^a-zA-Z0-9]/g, '_')}_photo.${profilePhoto.type.split('/')[1]}`;

    // Build email content
    const emailHtml = buildEmailHtml(data);
    const emailText = buildEmailText(data);

    // Send email to owner with photo attachment - THIS IS CRITICAL
    try {
      const resend = await getResend();
      const toEmail = process.env.OWNER_EMAIL || 'support@brightears.io';
      console.log('[Application API] Attempting to send email to:', toEmail);
      console.log('[Application API] From:', 'noreply@brightears.io');
      console.log('[Application API] Subject:', `New Artist Application: ${displayName}`);

      const emailResult = await resend.emails.send({
        from: 'Bright Ears <noreply@brightears.io>',
        to: toEmail,
        subject: `New Artist Application: ${displayName}`,
        html: emailHtml,
        text: emailText,
        attachments: [
          {
            filename: photoFilename,
            content: photoBase64,
          },
        ],
      });

      // Check for Resend API errors (returned in response, not thrown)
      if (emailResult.error) {
        console.error('[Application API] Resend API error:', emailResult.error);
        return NextResponse.json(
          {
            error: 'Failed to send application email. Please try again or contact us directly via LINE.',
            details: emailResult.error.message,
          },
          { status: 500 }
        );
      }

      console.log('[Application API] Email sent successfully, ID:', emailResult.data?.id);
    } catch (emailError) {
      console.error('[Application API] Failed to send owner notification email:', emailError);
      // This is critical - if we can't notify the owner, the application is lost
      return NextResponse.json(
        {
          error: 'Failed to submit application. Please try again or contact us directly via LINE.',
          details: emailError instanceof Error ? emailError.message : 'Email service error',
        },
        { status: 500 }
      );
    }

    // Send confirmation email to applicant (optional - can fail without losing application)
    try {
      const resendClient = await getResend();
      await resendClient.emails.send({
        from: 'Bright Ears <noreply@brightears.io>',
        to: data.email,
        subject: 'Application Received - Bright Ears',
        html: buildConfirmationHtml(data, body.locale || 'en'),
        text: buildConfirmationText(data, body.locale || 'en'),
      });
    } catch (emailError) {
      // Confirmation email is optional - log but continue
      console.error('Failed to send applicant confirmation email:', emailError);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Application submitted successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Application submission error:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Failed to submit application. Please try again later.',
      },
      { status: 500 }
    );
  }
}

function buildEmailHtml(data: any): string {
  const displayName = data.stageName || data.fullName;

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #00bbe4; border-bottom: 2px solid #00bbe4; padding-bottom: 10px;">
        New Artist Application
      </h1>

      <h2 style="color: #333; margin-top: 20px;">Basic Information</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px 0; color: #666;">Name:</td><td style="padding: 8px 0;"><strong>${data.fullName}</strong></td></tr>
        ${data.stageName ? `<tr><td style="padding: 8px 0; color: #666;">Stage Name:</td><td style="padding: 8px 0;"><strong>${data.stageName}</strong></td></tr>` : ''}
        <tr><td style="padding: 8px 0; color: #666;">Email:</td><td style="padding: 8px 0;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
        ${data.lineId ? `<tr><td style="padding: 8px 0; color: #666;">LINE ID:</td><td style="padding: 8px 0;">${data.lineId}</td></tr>` : ''}
        <tr><td style="padding: 8px 0; color: #666;">Instagram:</td><td style="padding: 8px 0;">${data.instagram ? `@${data.instagram}` : '-'}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Category:</td><td style="padding: 8px 0;">${data.category}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Genres:</td><td style="padding: 8px 0;">${data.genres}</td></tr>
      </table>

      <h2 style="color: #333; margin-top: 20px;">Bio</h2>
      <p style="background: #f5f5f5; padding: 15px; border-radius: 8px; line-height: 1.6;">${data.bio}</p>

      ${data.website ? `
        <h3 style="color: #333; margin-top: 15px;">Website</h3>
        <p><a href="${data.website}">${data.website}</a></p>
      ` : ''}

      <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
        Profile photo attached to this email.
      </p>
    </div>
  `;
}

function buildEmailText(data: any): string {
  return `
NEW ARTIST APPLICATION

BASIC INFORMATION
Name: ${data.fullName}
${data.stageName ? `Stage Name: ${data.stageName}` : ''}
Email: ${data.email}
${data.lineId ? `LINE ID: ${data.lineId}` : ''}
Instagram: ${data.instagram ? `@${data.instagram}` : '-'}
Category: ${data.category}
Genres: ${data.genres}

BIO
${data.bio}

${data.website ? `Website: ${data.website}` : ''}

Profile photo attached to this email.
  `.trim();
}

function buildConfirmationHtml(data: any, locale: string): string {
  const isThaiLocale = locale === 'th';
  const displayName = data.stageName || data.fullName;

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #00bbe4;">
        ${isThaiLocale ? 'ได้รับใบสมัครแล้ว!' : 'Application Received!'}
      </h1>

      <p style="font-size: 16px; line-height: 1.6;">
        ${isThaiLocale
          ? `สวัสดี ${displayName},`
          : `Hi ${displayName},`}
      </p>

      <p style="font-size: 16px; line-height: 1.6;">
        ${isThaiLocale
          ? 'ขอบคุณที่สมัครเข้าร่วม Bright Ears! เราได้รับใบสมัครของคุณแล้ว และจะติดต่อกลับหากมีโอกาสที่เหมาะสม'
          : 'Thank you for applying to join Bright Ears! We have received your application and will reach out if there\'s a good fit.'}
      </p>

      <p style="font-size: 16px; line-height: 1.6; margin-top: 30px;">
        ${isThaiLocale ? 'ขอบคุณ,' : 'Best regards,'}<br>
        <strong>Bright Ears Team</strong>
      </p>

      <p style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
        ${isThaiLocale
          ? 'อีเมลนี้ถูกส่งอัตโนมัติ กรุณาอย่าตอบกลับอีเมลนี้'
          : 'This is an automated email. Please do not reply to this message.'}
      </p>
    </div>
  `;
}

function buildConfirmationText(data: any, locale: string): string {
  const isThaiLocale = locale === 'th';
  const displayName = data.stageName || data.fullName;

  if (isThaiLocale) {
    return `
สวัสดี ${displayName},

ขอบคุณที่สมัครเข้าร่วม Bright Ears! เราได้รับใบสมัครของคุณแล้ว และจะติดต่อกลับหากมีโอกาสที่เหมาะสม

ขอบคุณ,
Bright Ears Team
    `.trim();
  }

  return `
Hi ${displayName},

Thank you for applying to join Bright Ears! We have received your application and will reach out if there's a good fit.

Best regards,
Bright Ears Team
  `.trim();
}

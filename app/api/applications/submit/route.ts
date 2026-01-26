import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { djApplicationSchema } from '@/lib/validation/application-schemas';

// Lazy initialization to avoid build-time errors (env vars not available during build)
let resend: Resend | null = null;
function getResend(): Resend {
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
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

    // Convert photo to base64 for email attachment
    const photoBuffer = Buffer.from(await profilePhoto.arrayBuffer());
    const photoBase64 = photoBuffer.toString('base64');
    const photoFilename = `${data.stageName.replace(/[^a-zA-Z0-9]/g, '_')}_photo.${profilePhoto.type.split('/')[1]}`;

    // Build email content
    const emailHtml = buildEmailHtml(data);
    const emailText = buildEmailText(data);

    // Send email to owner with photo attachment
    try {
      await getResend().emails.send({
        from: 'Bright Ears <noreply@brightears.io>',
        to: process.env.OWNER_EMAIL || 'support@brightears.io',
        subject: `New Artist Application: ${data.stageName}`,
        html: emailHtml,
        text: emailText,
        attachments: [
          {
            filename: photoFilename,
            content: photoBase64,
          },
        ],
      });
    } catch (emailError) {
      console.error('Failed to send owner notification email:', emailError);
      // Continue - don't fail the whole request
    }

    // Send confirmation email to applicant
    try {
      await getResend().emails.send({
        from: 'Bright Ears <noreply@brightears.io>',
        to: data.email,
        subject: 'Application Received - Bright Ears',
        html: buildConfirmationHtml(data, body.locale || 'en'),
        text: buildConfirmationText(data, body.locale || 'en'),
      });
    } catch (emailError) {
      console.error('Failed to send applicant confirmation email:', emailError);
      // Continue - don't fail the whole request
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
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #00bbe4; border-bottom: 2px solid #00bbe4; padding-bottom: 10px;">
        New Artist Application
      </h1>

      <h2 style="color: #333; margin-top: 20px;">Basic Information</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px 0; color: #666;">Name:</td><td style="padding: 8px 0;"><strong>${data.fullName}</strong></td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Stage Name:</td><td style="padding: 8px 0;"><strong>${data.stageName}</strong></td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Email:</td><td style="padding: 8px 0;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
        <tr><td style="padding: 8px 0; color: #666;">LINE ID:</td><td style="padding: 8px 0;">${data.lineId}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Instagram:</td><td style="padding: 8px 0;">${data.instagram ? `@${data.instagram}` : '-'}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Category:</td><td style="padding: 8px 0;">${data.category}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Genres:</td><td style="padding: 8px 0;">${data.genres}</td></tr>
      </table>

      <h2 style="color: #333; margin-top: 20px;">Bio</h2>
      <p style="background: #f5f5f5; padding: 15px; border-radius: 8px; line-height: 1.6;">${data.bio}</p>

      <h2 style="color: #333; margin-top: 20px;">Optional Information</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px 0; color: #666;">Experience:</td><td style="padding: 8px 0;">${data.yearsExperience ? `${data.yearsExperience} years` : '-'}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Location:</td><td style="padding: 8px 0;">${data.baseLocation || '-'}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Hourly Rate:</td><td style="padding: 8px 0;">${data.hourlyRateExpectation ? `฿${data.hourlyRateExpectation}/hr` : '-'}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Website:</td><td style="padding: 8px 0;">${data.website ? `<a href="${data.website}">${data.website}</a>` : '-'}</td></tr>
      </table>

      ${data.socialMediaLinks ? `
        <h3 style="color: #333; margin-top: 15px;">Social Media</h3>
        <p style="background: #f5f5f5; padding: 10px; border-radius: 8px; white-space: pre-wrap;">${data.socialMediaLinks}</p>
      ` : ''}

      ${data.portfolioLinks ? `
        <h3 style="color: #333; margin-top: 15px;">Portfolio</h3>
        <p style="background: #f5f5f5; padding: 10px; border-radius: 8px; white-space: pre-wrap;">${data.portfolioLinks}</p>
      ` : ''}

      ${data.equipmentOwned ? `
        <h3 style="color: #333; margin-top: 15px;">Equipment</h3>
        <p style="background: #f5f5f5; padding: 10px; border-radius: 8px; white-space: pre-wrap;">${data.equipmentOwned}</p>
      ` : ''}

      ${data.interestedInMusicDesign ? `
        <h2 style="color: #d59ec9; margin-top: 20px;">Music Design Interest</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #666;">Design Fee:</td><td style="padding: 8px 0;">${data.designFee ? `฿${data.designFee}` : '-'}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Monthly Fee:</td><td style="padding: 8px 0;">${data.monthlyFee ? `฿${data.monthlyFee}/month` : '-'}</td></tr>
        </table>
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
Stage Name: ${data.stageName}
Email: ${data.email}
LINE ID: ${data.lineId}
Instagram: ${data.instagram ? `@${data.instagram}` : '-'}
Category: ${data.category}
Genres: ${data.genres}

BIO
${data.bio}

OPTIONAL INFORMATION
Experience: ${data.yearsExperience ? `${data.yearsExperience} years` : '-'}
Location: ${data.baseLocation || '-'}
Hourly Rate: ${data.hourlyRateExpectation ? `฿${data.hourlyRateExpectation}/hr` : '-'}
Website: ${data.website || '-'}
${data.socialMediaLinks ? `Social Media:\n${data.socialMediaLinks}` : ''}
${data.portfolioLinks ? `Portfolio:\n${data.portfolioLinks}` : ''}
${data.equipmentOwned ? `Equipment:\n${data.equipmentOwned}` : ''}

${data.interestedInMusicDesign ? `MUSIC DESIGN INTEREST
Design Fee: ${data.designFee ? `฿${data.designFee}` : '-'}
Monthly Fee: ${data.monthlyFee ? `฿${data.monthlyFee}/month` : '-'}` : ''}

Profile photo attached to this email.
  `.trim();
}

function buildConfirmationHtml(data: any, locale: string): string {
  const isThaiLocale = locale === 'th';

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #00bbe4;">
        ${isThaiLocale ? 'ได้รับใบสมัครแล้ว!' : 'Application Received!'}
      </h1>

      <p style="font-size: 16px; line-height: 1.6;">
        ${isThaiLocale
          ? `สวัสดี ${data.stageName},`
          : `Hi ${data.stageName},`}
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

  if (isThaiLocale) {
    return `
สวัสดี ${data.stageName},

ขอบคุณที่สมัครเข้าร่วม Bright Ears! เราได้รับใบสมัครของคุณแล้ว และจะติดต่อกลับหากมีโอกาสที่เหมาะสม

ขอบคุณ,
Bright Ears Team
    `.trim();
  }

  return `
Hi ${data.stageName},

Thank you for applying to join Bright Ears! We have received your application and will reach out if there's a good fit.

Best regards,
Bright Ears Team
  `.trim();
}

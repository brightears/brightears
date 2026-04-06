import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Clerk Webhook Handler
 *
 * Handles user.created events to create corresponding User + Artist
 * records in the database when someone signs up through Clerk.
 *
 * Note: For production, you should verify the webhook signature using
 * svix. For MVP, we use a simple secret check.
 */

const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const { type, data } = payload;

    // Basic security check (replace with svix verification for production)
    const headerSecret = req.headers.get('x-webhook-secret');
    if (WEBHOOK_SECRET && headerSecret !== WEBHOOK_SECRET) {
      // For now, allow without verification if secret not set (MVP)
      if (WEBHOOK_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    if (type === 'user.created') {
      const { id: clerkId, email_addresses, first_name, last_name } = data;
      const email = email_addresses?.[0]?.email_address;

      if (!email) {
        console.warn('[Clerk Webhook] User created without email:', clerkId);
        return NextResponse.json({ received: true });
      }

      // Check if user already exists (e.g., pre-seeded)
      const existingUser = await prisma.user.findFirst({
        where: { OR: [{ id: clerkId }, { email }] },
      });

      if (existingUser) {
        console.log('[Clerk Webhook] User already exists:', email);
        return NextResponse.json({ received: true, existing: true });
      }

      // Create new user + artist profile
      const stageName = first_name
        ? `${first_name}${last_name ? ' ' + last_name : ''}`
        : email.split('@')[0];

      const user = await prisma.user.create({
        data: {
          id: clerkId,
          email,
          name: stageName,
          role: 'ARTIST',
          isActive: true,
          artist: {
            create: {
              stageName,
              category: 'DJ',
              baseCity: 'Bangkok',
              languages: ['en'],
              genres: [],
              images: [],
              videos: [],
              audioSamples: [],
              serviceAreas: [],
              contactEmail: email,
            },
          },
        },
      });

      console.log('[Clerk Webhook] Created user + artist:', email, user.id);

      // Create credit account with 3 free credits
      await prisma.creditAccount.create({
        data: {
          userId: user.id,
          balance: 3,
        },
      });

      return NextResponse.json({ received: true, created: true, userId: user.id });
    }

    if (type === 'user.deleted') {
      const { id: clerkId } = data;
      // Soft delete — mark as inactive
      await prisma.user.updateMany({
        where: { id: clerkId },
        data: { isActive: false },
      });
      console.log('[Clerk Webhook] Deactivated user:', clerkId);
      return NextResponse.json({ received: true, deactivated: true });
    }

    // Other events — acknowledge
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[Clerk Webhook] Error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

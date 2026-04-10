import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import LiffClient from './LiffClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Bright Ears — Tonight',
  description: 'Tonight\'s DJ lineup across Bangkok venues. Open in LINE.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  robots: { index: false, follow: false }, // LIFF is private, not SEO'd
};

/**
 * LIFF Mini App v1 — "Tonight's Lineup"
 *
 * Server-rendered Thai-native mobile page designed to run inside
 * the LINE app via LIFF. Shows tonight's DJ lineup across all
 * Bright Ears venues with one-tap LINE contact.
 *
 * LIFF setup (in LINE Developers Console):
 * 1. Create/select a LINE Login channel under the Bright Ears provider
 * 2. Add a LIFF app:
 *    - Endpoint URL: https://brightears.io/liff
 *    - Size: Full
 *    - Scope: profile openid
 * 3. Copy the LIFF ID (format: 1234567890-AbCdEf01)
 * 4. Set env var NEXT_PUBLIC_LIFF_ID via single-key PUT on Render
 *
 * The page gracefully degrades if NEXT_PUBLIC_LIFF_ID is missing —
 * it renders as a normal mobile web page with full functionality
 * (just without LIFF auto-auth and LINE SDK features).
 */
export default async function LiffPage() {
  // Bangkok "tonight" = today in Asia/Bangkok timezone
  const now = new Date();
  const bangkokOffset = 7 * 60 * 60 * 1000;
  const bangkokNow = new Date(now.getTime() + bangkokOffset);
  const todayStart = new Date(bangkokNow);
  todayStart.setUTCHours(0, 0, 0, 0);
  const todayEnd = new Date(bangkokNow);
  todayEnd.setUTCHours(23, 59, 59, 999);

  const assignments = await prisma.venueAssignment.findMany({
    where: {
      date: { gte: todayStart, lte: todayEnd },
      status: { not: 'CANCELLED' },
    },
    include: {
      venue: { select: { id: true, name: true, city: true } },
      artist: {
        select: {
          id: true,
          stageName: true,
          profileImage: true,
          genres: true,
          category: true,
        },
      },
    },
    orderBy: [{ venue: { name: 'asc' } }, { startTime: 'asc' }],
  });

  // Serialize dates for client component
  const lineup = assignments.map((a) => ({
    id: a.id,
    date: a.date.toISOString(),
    startTime: a.startTime,
    endTime: a.endTime,
    specialEvent: a.specialEvent,
    venue: a.venue,
    artist: a.artist
      ? {
          id: a.artist.id,
          stageName: a.artist.stageName,
          profileImage: a.artist.profileImage,
          genres: a.artist.genres,
          category: a.artist.category,
        }
      : null,
  }));

  const liffId = process.env.NEXT_PUBLIC_LIFF_ID || null;

  return <LiffClient lineup={lineup} liffId={liffId} />;
}

/**
 * Seed Script: April 2026 DJ Schedules
 *
 * Creates assignments for 7 venue-slots:
 * - NOBU Bangkok (30 nights)
 * - Le Du Kaan Early (30 nights)
 * - Le Du Kaan Late (30 nights)
 * - CRU Champagne Bar (30 nights)
 * - Cocoa XO (30 nights)
 * - ABar (30 nights)
 * - Horizon (30 nights)
 *
 * Also creates 2 new DJs: Hvngyvk, Fias
 * Looks up DJ April by stage name (dynamically created ID)
 *
 * Run with: npx tsx scripts/seed-april-2026.ts
 */

import { PrismaClient, ArtistCategory } from '@prisma/client';

const prisma = new PrismaClient();

// =============================================================================
// NEW DJS TO CREATE
// =============================================================================

const NEW_DJS = [
  {
    djId: 'dj-hvngyvk',
    userId: 'user-dj-hvngyvk',
    stageName: 'Hvngyvk',
    genres: ['House', 'Afro House', 'Tech House'],
    bio: 'Replaces Lupø at LDK Early Monday. House/Afro House/Tech House.',
    profileImage: '/images/djs/hvngyvk-photo1.png',
  },
  {
    djId: 'dj-fias',
    userId: 'user-dj-fias',
    stageName: 'Fias',
    genres: ['House', 'Afro House', 'Commercial'],
    bio: 'LDK Early Wednesday. House/Afro House/Commercial.',
    profileImage: '/images/djs/fias-photo1.png',
  },
];

// =============================================================================
// VENUE CONFIG
// =============================================================================

const VENUES = {
  NOBU: { id: 'nobu-bangkok-venue', slug: 'nobu' },
  LDK: { id: 'le-du-kaan-venue', slug: 'ldk' },
  CRU: { id: 'cru-champagne-bar-venue', slug: 'cru' },
  COCOA: { id: 'cocoa-xo-venue', slug: 'cocoa' },
  ABAR: { id: 'abar-venue', slug: 'abar' },
  HORIZON: { id: 'horizon-venue', slug: 'horizon' },
};

// =============================================================================
// DJ ID LOOKUP (stage name → artist ID)
// =============================================================================

const DJ: Record<string, string> = {
  // NOBU DJs
  RabbitDisco: 'dj-rabbitdisco',
  Benji: 'dj-benji',
  Izaar: 'dj-izaar',
  Linze: 'dj-linze',
  'DJ Mint': 'dj-dj-mint',
  Vita: 'dj-vita',
  UFO: 'dj-ufo',
  'T-Gecko': 'dj-t-gecko',
  // LDK DJs
  'Eskay Da Real': 'dj-eskay-da-real',
  'DJ Furry': 'dj-dj-furry',
  Joyyly: 'dj-joyyly',
  'Scotty B': 'dj-scotty-b',
  Manymaur: 'dj-manymaur',
  'Yui Truluv': 'dj-yui-truluv',
  // NEW LDK DJs
  Hvngyvk: 'dj-hvngyvk',
  Fias: 'dj-fias',
  // CRU / Cocoa XO DJs
  'DJ Pound': 'dj-dj-pound',
  Camilo: 'dj-camilo',
  Tohmo: 'dj-tohmo',
  Krit: 'dj-krit',
  JJ: 'dj-jj',
  // April: looked up at runtime — see main()
  // Horizon DJs
  'DJ Ize': 'dj-ize',
  'DJ Nun': 'dj-nun',
};

// =============================================================================
// SCHEDULE DATA — [day, artistId, notes?]
// =============================================================================

// NOBU Bangkok — 20:00-24:00 (Apr 5 Brunch: 11:30-15:30)
const NOBU_SCHEDULE: [number, string, string?][] = [
  [1, DJ.Izaar],
  [2, DJ.Linze],
  [3, DJ['DJ Mint']],
  [4, DJ.Vita],
  [5, DJ.UFO, 'NOBU Brunch + Sir i Sax (Bongo, 3 hrs)'],
  [6, DJ.RabbitDisco],
  [7, DJ.Benji],
  [8, DJ.Izaar],
  [9, DJ.Linze],
  [10, DJ['DJ Mint']],
  [11, DJ.Benji],          // Sub for Vita
  [12, DJ.UFO],
  [13, DJ.RabbitDisco],
  [14, DJ.Benji],
  [15, DJ.Izaar],
  [16, DJ['T-Gecko']],     // Sub for Linze
  [17, DJ['DJ Mint']],
  [18, DJ.Vita],
  [19, DJ.UFO],
  [20, DJ.RabbitDisco],
  [21, DJ.Benji],
  [22, DJ.Izaar],
  [23, DJ.Linze],
  [24, DJ['DJ Mint']],
  [25, DJ.Vita],
  [26, DJ.UFO],
  [27, DJ.RabbitDisco],
  [28, DJ.Benji],
  [29, DJ.Izaar],
  [30, DJ.Linze],
];

// LDK Early — 18:00-21:00
const LDK_EARLY_SCHEDULE: [number, string][] = [
  [1, DJ.Fias],
  [2, DJ['Eskay Da Real']],
  [3, DJ['DJ Furry']],
  [4, DJ['Yui Truluv']],
  [5, DJ.Joyyly],
  [6, DJ.Hvngyvk],
  [7, DJ['Eskay Da Real']],
  [8, DJ.Fias],
  [9, DJ['Eskay Da Real']],
  [10, DJ['DJ Furry']],
  [11, DJ['Yui Truluv']],
  [12, DJ.Joyyly],
  [13, DJ.Hvngyvk],
  [14, DJ['Eskay Da Real']],
  [15, DJ.Fias],
  [16, DJ['Eskay Da Real']],
  [17, DJ['DJ Furry']],
  [18, DJ['Yui Truluv']],
  [19, DJ.Joyyly],
  [20, DJ.Hvngyvk],
  [21, DJ['Eskay Da Real']],
  [22, DJ.Fias],
  [23, DJ['Eskay Da Real']],
  [24, DJ['DJ Furry']],
  [25, DJ['Yui Truluv']],
  [26, DJ.Joyyly],
  [27, DJ.Hvngyvk],
  [28, DJ['Eskay Da Real']],
  [29, DJ.Fias],
  [30, DJ['Eskay Da Real']],
];

// LDK Late — 21:00-24:00
const LDK_LATE_SCHEDULE: [number, string][] = [
  [1, DJ.Manymaur],
  [2, DJ.Joyyly],
  [3, DJ['Scotty B']],
  [4, DJ['Scotty B']],
  [5, DJ['Yui Truluv']],
  [6, DJ.Joyyly],
  [7, DJ['Scotty B']],
  [8, DJ.Manymaur],
  [9, DJ.Joyyly],
  [10, DJ['Scotty B']],
  [11, DJ['Scotty B']],
  [12, DJ['Yui Truluv']],
  [13, DJ.Joyyly],
  [14, DJ['Scotty B']],
  [15, DJ.Manymaur],
  [16, DJ.Joyyly],
  [17, DJ['Scotty B']],
  [18, DJ['Scotty B']],
  [19, DJ['Yui Truluv']],
  [20, DJ.Joyyly],
  [21, DJ['Scotty B']],
  [22, DJ.Manymaur],
  [23, DJ.Joyyly],
  [24, DJ['Scotty B']],
  [25, DJ['Scotty B']],
  [26, DJ['Yui Truluv']],
  [27, DJ.Joyyly],
  [28, DJ['Scotty B']],
  [29, DJ.Manymaur],
  [30, DJ.Joyyly],
];

// CRU Champagne Bar — 21:00-01:00
// Apr 12: Guest DJ (specialEvent, no artistId) — handled in seeding loop
const CRU_SCHEDULE: [number, string | null, string?][] = [
  [1, DJ.Linze],
  [2, DJ['DJ Pound']],
  [3, DJ.Camilo],
  [4, 'APRIL'],            // Looked up at runtime
  [5, DJ.Izaar],
  [6, DJ.UFO],
  [7, DJ.Manymaur],
  [8, DJ.Linze],
  [9, DJ['DJ Pound']],
  [10, DJ.Camilo],
  [11, 'APRIL'],
  [12, null],               // Guest DJ — specialEvent
  [13, DJ.UFO],
  [14, DJ.Manymaur],
  [15, DJ.Krit],            // Sub for Linze
  [16, DJ.Linze],
  [17, DJ.Camilo],
  [18, 'APRIL'],
  [19, DJ.Izaar],
  [20, DJ.UFO],
  [21, DJ.Manymaur],
  [22, DJ.Linze],
  [23, DJ['DJ Pound']],
  [24, DJ.Camilo],
  [25, 'APRIL'],
  [26, DJ.Izaar],
  [27, DJ.UFO],
  [28, DJ.Izaar],           // Sub for Manymaur
  [29, DJ.Linze],
  [30, DJ['DJ Pound']],
];

// Cocoa XO — 21:00-01:00
const COCOA_SCHEDULE: [number, string][] = [
  [1, DJ.Benji],
  [2, DJ.Tohmo],
  [3, DJ.Linze],
  [4, DJ['DJ Pound']],
  [5, DJ.JJ],
  [6, DJ.Tohmo],
  [7, DJ.Krit],
  [8, DJ.Benji],
  [9, DJ.Tohmo],
  [10, DJ.Linze],
  [11, DJ['DJ Pound']],
  [12, DJ.Krit],
  [13, DJ.Tohmo],
  [14, DJ.Krit],
  [15, DJ.Benji],
  [16, DJ.Tohmo],
  [17, DJ.Linze],
  [18, DJ['DJ Pound']],
  [19, DJ.JJ],
  [20, DJ.Tohmo],
  [21, DJ.Krit],
  [22, DJ.Benji],
  [23, DJ['Yui Truluv']],   // Sub for Tohmo
  [24, DJ.Linze],
  [25, DJ['DJ Pound']],
  [26, DJ.JJ],
  [27, DJ.Tohmo],
  [28, DJ.Krit],
  [29, DJ.Benji],
  [30, DJ.Tohmo],
];

// ABar — 21:00-24:00
const ABAR_SCHEDULE: [number, string][] = [
  [1, DJ['Scotty B']],
  [2, DJ.Benji],
  [3, DJ['DJ Pound']],
  [4, DJ.Benji],
  [5, DJ['DJ Pound']],
  [6, DJ.Linze],
  [7, DJ.UFO],
  [8, DJ['Scotty B']],
  [9, DJ.Benji],
  [10, DJ['DJ Pound']],
  [11, DJ.Vita],            // Sub for Benji
  [12, DJ['DJ Pound']],
  [13, DJ.Linze],
  [14, DJ.UFO],
  [15, DJ['Scotty B']],
  [16, DJ.Benji],
  [17, DJ['DJ Pound']],
  [18, DJ.Benji],
  [19, DJ['DJ Pound']],
  [20, DJ.Linze],
  [21, DJ.UFO],
  [22, DJ['Scotty B']],
  [23, DJ.Benji],
  [24, DJ['DJ Pound']],
  [25, DJ.Benji],
  [26, DJ['DJ Pound']],
  [27, DJ.Linze],
  [28, DJ.UFO],
  [29, DJ['Scotty B']],
  [30, DJ.Benji],
];

// Horizon — 18:30-22:30
// Pattern: Mon/Tue=Pound, Wed/Fri=Eskay, Thu=Nun, Sat/Sun=Ize
const HORIZON_SCHEDULE: [number, string][] = [
  [1, DJ['Eskay Da Real']],   // Wed
  [2, DJ['DJ Nun']],          // Thu
  [3, DJ['Eskay Da Real']],   // Fri
  [4, DJ['DJ Ize']],          // Sat
  [5, DJ['DJ Ize']],          // Sun
  [6, DJ['DJ Pound']],        // Mon
  [7, DJ['DJ Pound']],        // Tue
  [8, DJ['Eskay Da Real']],   // Wed
  [9, DJ['DJ Nun']],          // Thu
  [10, DJ['Eskay Da Real']], // Fri
  [11, DJ['DJ Ize']],        // Sat
  [12, DJ['DJ Ize']],        // Sun
  [13, DJ['DJ Pound']],      // Mon
  [14, DJ['DJ Pound']],      // Tue
  [15, DJ['Eskay Da Real']], // Wed
  [16, DJ['DJ Nun']],        // Thu
  [17, DJ['Eskay Da Real']], // Fri
  [18, DJ['DJ Ize']],        // Sat
  [19, DJ['DJ Ize']],        // Sun
  [20, DJ['DJ Pound']],      // Mon
  [21, DJ['DJ Pound']],      // Tue
  [22, DJ['Eskay Da Real']], // Wed
  [23, DJ['DJ Nun']],        // Thu
  [24, DJ['Eskay Da Real']], // Fri
  [25, DJ['DJ Ize']],        // Sat
  [26, DJ['DJ Ize']],        // Sun
  [27, DJ['DJ Pound']],      // Mon
  [28, DJ['DJ Pound']],      // Tue
  [29, DJ['Eskay Da Real']], // Wed
  [30, DJ['DJ Nun']],        // Thu
];

// =============================================================================
// MAIN
// =============================================================================

async function main() {
  console.log('='.repeat(60));
  console.log('  APRIL 2026 SCHEDULE SEED');
  console.log('  7 venue-slots, ~210 assignments');
  console.log('='.repeat(60));

  // =========================================================================
  // Step 1: Create new DJs
  // =========================================================================
  console.log('\n1. Creating new DJs...\n');

  for (const dj of NEW_DJS) {
    const djUser = await prisma.user.upsert({
      where: { id: dj.userId },
      update: { name: dj.stageName },
      create: {
        id: dj.userId,
        email: `${dj.djId}@brightears.io`,
        name: dj.stageName,
        firstName: dj.stageName,
        role: 'ARTIST',
        isActive: true,
      },
    });

    await prisma.artist.upsert({
      where: { userId: djUser.id },
      update: {
        stageName: dj.stageName,
        genres: dj.genres,
      },
      create: {
        id: dj.djId,
        userId: djUser.id,
        stageName: dj.stageName,
        category: ArtistCategory.DJ,
        genres: dj.genres,
        bio: dj.bio || null,
        profileImage: (dj as any).profileImage || null,
        baseCity: 'Bangkok',
        serviceAreas: ['Bangkok'],
        minimumHours: 3,
        currency: 'THB',
        languages: ['en', 'th'],
      },
    });
    console.log(`   + ${dj.stageName} (${dj.djId})`);
  }

  // =========================================================================
  // Step 2: Look up DJ April by stage name
  // =========================================================================
  console.log('\n2. Looking up DJ April...\n');

  const djApril = await prisma.artist.findFirst({
    where: { stageName: 'April' },
    select: { id: true, stageName: true },
  });

  if (!djApril) {
    console.error('   DJ April not found in database. Cannot proceed.');
    process.exit(1);
  }
  DJ['April'] = djApril.id;
  console.log(`   Found: ${djApril.stageName} (${djApril.id})`);

  // =========================================================================
  // Step 3: Verify all referenced DJs exist
  // =========================================================================
  console.log('\n3. Verifying existing DJs...\n');

  const allDjIds = new Set<string>();
  for (const id of Object.values(DJ)) {
    allDjIds.add(id);
  }

  const existingArtists = await prisma.artist.findMany({
    where: { id: { in: Array.from(allDjIds) } },
    select: { id: true, stageName: true },
  });

  const existingIds = new Set(existingArtists.map((a) => a.id));
  let missing = false;
  for (const id of allDjIds) {
    if (!existingIds.has(id)) {
      console.error(`   MISSING: ${id}`);
      missing = true;
    }
  }
  if (missing) {
    console.error('\n   Some DJs are missing. Cannot proceed.');
    process.exit(1);
  }
  console.log(`   All ${allDjIds.size} DJs verified.`);

  // =========================================================================
  // Step 4: Seed assignments
  // =========================================================================

  const stats = { created: 0, skipped: 0 };

  // --- NOBU ---
  console.log('\n4. Seeding NOBU...');
  for (const [day, artistId, notes] of NOBU_SCHEDULE) {
    const isBrunch = day === 5;
    await upsertAssignment({
      id: `april-nobu-2026-04-${pad(day)}`,
      venueId: VENUES.NOBU.id,
      artistId,
      day,
      startTime: isBrunch ? '11:30' : '20:00',
      endTime: isBrunch ? '15:30' : '24:00',
      slot: null,
      notes: notes || null,
      stats,
    });
  }
  console.log(`   NOBU: done`);

  // --- LDK Early ---
  console.log('\n5. Seeding LDK Early...');
  for (const [day, artistId] of LDK_EARLY_SCHEDULE) {
    await upsertAssignment({
      id: `april-ldk-2026-04-${pad(day)}-early`,
      venueId: VENUES.LDK.id,
      artistId,
      day,
      startTime: '18:00',
      endTime: '21:00',
      slot: 'Early',
      notes: null,
      stats,
    });
  }
  console.log(`   LDK Early: done`);

  // --- LDK Late ---
  console.log('\n6. Seeding LDK Late...');
  for (const [day, artistId] of LDK_LATE_SCHEDULE) {
    await upsertAssignment({
      id: `april-ldk-2026-04-${pad(day)}-late`,
      venueId: VENUES.LDK.id,
      artistId,
      day,
      startTime: '21:00',
      endTime: '24:00',
      slot: 'Late',
      notes: null,
      stats,
    });
  }
  console.log(`   LDK Late: done`);

  // --- CRU ---
  console.log('\n7. Seeding CRU...');
  for (const [day, artistIdOrMarker, notes] of CRU_SCHEDULE) {
    if (artistIdOrMarker === null) {
      // Guest DJ — specialEvent
      await upsertAssignment({
        id: `april-cru-2026-04-${pad(day)}`,
        venueId: VENUES.CRU.id,
        artistId: null,
        specialEvent: 'Guest DJ',
        day,
        startTime: '21:00',
        endTime: '01:00',
        slot: null,
        notes: null,
        stats,
      });
    } else {
      const artistId = artistIdOrMarker === 'APRIL' ? DJ['April'] : artistIdOrMarker;
      await upsertAssignment({
        id: `april-cru-2026-04-${pad(day)}`,
        venueId: VENUES.CRU.id,
        artistId,
        day,
        startTime: '21:00',
        endTime: '01:00',
        slot: null,
        notes: notes || null,
        stats,
      });
    }
  }
  console.log(`   CRU: done`);

  // --- Cocoa XO ---
  console.log('\n8. Seeding Cocoa XO...');
  for (const [day, artistId] of COCOA_SCHEDULE) {
    await upsertAssignment({
      id: `april-cocoa-2026-04-${pad(day)}`,
      venueId: VENUES.COCOA.id,
      artistId,
      day,
      startTime: '21:00',
      endTime: '01:00',
      slot: null,
      notes: null,
      stats,
    });
  }
  console.log(`   Cocoa XO: done`);

  // --- ABar ---
  console.log('\n9. Seeding ABar...');
  for (const [day, artistId] of ABAR_SCHEDULE) {
    await upsertAssignment({
      id: `april-abar-2026-04-${pad(day)}`,
      venueId: VENUES.ABAR.id,
      artistId,
      day,
      startTime: '21:00',
      endTime: '24:00',
      slot: null,
      notes: null,
      stats,
    });
  }
  console.log(`   ABar: done`);

  // --- Horizon ---
  console.log('\n10. Seeding Horizon...');
  for (const [day, artistId] of HORIZON_SCHEDULE) {
    await upsertAssignment({
      id: `april-horizon-2026-04-${pad(day)}`,
      venueId: VENUES.HORIZON.id,
      artistId,
      day,
      startTime: '18:30',
      endTime: '22:30',
      slot: 'main',
      notes: null,
      stats,
    });
  }
  console.log(`   Horizon: done`);

  // =========================================================================
  // Summary
  // =========================================================================
  console.log('\n' + '='.repeat(60));
  console.log(`  DONE: ${stats.created} assignments created, ${stats.skipped} already existed`);
  console.log('='.repeat(60));
  console.log('');
}

// =============================================================================
// HELPERS
// =============================================================================

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

async function upsertAssignment(params: {
  id: string;
  venueId: string;
  artistId: string | null;
  specialEvent?: string | null;
  day: number;
  startTime: string;
  endTime: string;
  slot: string | null;
  notes: string | null;
  stats: { created: number; skipped: number };
}) {
  const { id, venueId, artistId, specialEvent, day, startTime, endTime, slot, notes, stats } = params;

  // Use noon UTC to avoid timezone date-shifting (Bangkok is UTC+7)
  const date = new Date(Date.UTC(2026, 3, day, 12, 0, 0)); // Month 3 = April

  try {
    await prisma.venueAssignment.create({
      data: {
        id,
        venueId,
        artistId: artistId || null,
        specialEvent: specialEvent || null,
        date,
        startTime,
        endTime,
        slot,
        status: 'SCHEDULED',
        notes,
      },
    });
    stats.created++;
  } catch (err: any) {
    if (err.code === 'P2002') {
      // Unique constraint — already exists
      stats.skipped++;
    } else {
      throw err;
    }
  }
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

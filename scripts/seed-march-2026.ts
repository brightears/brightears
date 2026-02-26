/**
 * Seed Script: March 2026 DJ Schedules
 *
 * Creates assignments for 5 venues:
 * - NOBU Bangkok (31 nights)
 * - Le Du Kaan Early (31 nights)
 * - Le Du Kaan Late (31 nights)
 * - CRU Champagne Bar (31 nights)
 * - Cocoa XO (31 nights)
 * - Horizon (31 nights)
 *
 * Also creates 3 new DJs: Joyyly, T-Gecko, Sir i Sax
 *
 * Run with: npx tsx scripts/seed-march-2026.ts
 */

import { PrismaClient, ArtistCategory } from '@prisma/client';

const prisma = new PrismaClient();

// =============================================================================
// NEW DJS TO CREATE
// =============================================================================

const NEW_DJS = [
  {
    djId: 'dj-joyyly',
    userId: 'user-dj-joyyly',
    stageName: 'Joyyly',
    genres: ['Deep House', 'Nu Disco', 'Organic House', 'Chillout'],
  },
  {
    djId: 'dj-t-gecko',
    userId: 'user-dj-t-gecko',
    stageName: 'T-Gecko',
    genres: ['Organic House', 'Deep House', 'Afro House'],
    bio: 'Half Moon Festival organizer. Specializes in organic, deep, and Afro house.',
  },
  {
    djId: 'dj-sir-i-sax',
    userId: 'user-dj-sir-i-sax',
    stageName: 'Sir i Sax',
    genres: ['Live Music', 'Saxophone', 'Bongo', 'Flute'],
    bio: 'Multi-instrumentalist (Saxophone, Bongo, Flute). Performs live alongside DJs at special events.',
    category: 'MUSICIAN' as const,
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
  'DJ Enjoy': 'dj-dj-enjoy',
  'Scotty B': 'dj-scotty-b',
  Manymaur: 'dj-manymaur',
  'Yui Truluv': 'dj-yui-truluv',
  // CRU / Cocoa XO DJs
  'DJ Pound': 'dj-dj-pound',
  Camilo: 'dj-camilo',
  Tohmo: 'dj-tohmo',
  Krit: 'dj-krit',
  JJ: 'dj-jj',
  // Horizon DJs
  'DJ Ize': 'dj-ize',
  'DJ Nun': 'dj-nun',
};

// =============================================================================
// SCHEDULE DATA — [day, artistId, notes?]
// =============================================================================

// NOBU Bangkok — 20:00-24:00 (Mar 1 Brunch: 11:30-15:30)
const NOBU_SCHEDULE: [number, string, string?][] = [
  [1, DJ.UFO, 'NOBU Brunch + Sir i Sax (Bongo, 3 hrs)'],
  [2, DJ.RabbitDisco],
  [3, DJ.Benji],
  [4, DJ.Izaar],
  [5, DJ.Linze],
  [6, DJ['DJ Mint']],
  [7, DJ.Vita],
  [8, DJ['T-Gecko']],
  [9, DJ.RabbitDisco],
  [10, DJ.Benji],
  [11, DJ.Izaar],
  [12, DJ.Linze],
  [13, DJ['DJ Mint']],
  [14, DJ.Vita],
  [15, DJ.UFO],
  [16, DJ.RabbitDisco],
  [17, DJ.Benji],
  [18, DJ.Izaar],
  [19, DJ.Linze],
  [20, DJ['DJ Mint']],
  [21, DJ.Vita],
  [22, DJ['T-Gecko']],
  [23, DJ.RabbitDisco],
  [24, DJ.Benji],
  [25, DJ.Izaar],
  [26, DJ.Linze],
  [27, DJ['DJ Mint']],
  [28, DJ.Vita],
  [29, DJ.UFO],
  [30, DJ.RabbitDisco],
  [31, DJ.Benji],
];

// LDK Early — 18:00-21:00
const LDK_EARLY_SCHEDULE: [number, string][] = [
  [1, DJ.Joyyly],
  [2, DJ.Benji],
  [3, DJ['Eskay Da Real']],
  [4, DJ['DJ Enjoy']], // Sub for Eskay
  [5, DJ['DJ Furry']],
  [6, DJ['DJ Furry']],
  [7, DJ['Eskay Da Real']],
  [8, DJ.Joyyly],
  [9, DJ.Benji],
  [10, DJ['Eskay Da Real']],
  [11, DJ['Eskay Da Real']],
  [12, DJ['DJ Furry']],
  [13, DJ['DJ Furry']],
  [14, DJ['Eskay Da Real']],
  [15, DJ.Joyyly],
  [16, DJ.Benji],
  [17, DJ['Eskay Da Real']],
  [18, DJ['Eskay Da Real']],
  [19, DJ['DJ Furry']],
  [20, DJ['DJ Furry']],
  [21, DJ['Eskay Da Real']],
  [22, DJ.Joyyly],
  [23, DJ.Benji],
  [24, DJ['Eskay Da Real']],
  [25, DJ['Eskay Da Real']],
  [26, DJ['DJ Furry']],
  [27, DJ['DJ Furry']],
  [28, DJ['Eskay Da Real']],
  [29, DJ.Joyyly],
  [30, DJ.Benji],
  [31, DJ['Eskay Da Real']],
];

// LDK Late — 21:00-24:00
const LDK_LATE_SCHEDULE: [number, string][] = [
  [1, DJ['Yui Truluv']],
  [2, DJ.Joyyly],
  [3, DJ['Scotty B']],
  [4, DJ.Manymaur],
  [5, DJ.Joyyly],
  [6, DJ['Scotty B']],
  [7, DJ['Scotty B']],
  [8, DJ['Yui Truluv']],
  [9, DJ.Joyyly],
  [10, DJ['Scotty B']],
  [11, DJ.Manymaur],
  [12, DJ.Joyyly],
  [13, DJ['Scotty B']],
  [14, DJ['Scotty B']],
  [15, DJ['Yui Truluv']],
  [16, DJ.Joyyly],
  [17, DJ['Scotty B']],
  [18, DJ.Manymaur],
  [19, DJ.Joyyly],
  [20, DJ['Scotty B']],
  [21, DJ['Scotty B']],
  [22, DJ['Yui Truluv']],
  [23, DJ.Joyyly],
  [24, DJ['Scotty B']],
  [25, DJ.Manymaur],
  [26, DJ.Joyyly],
  [27, DJ['Scotty B']],
  [28, DJ['Scotty B']],
  [29, DJ['Yui Truluv']],
  [30, DJ.Joyyly],
  [31, DJ['Scotty B']],
];

// CRU Champagne Bar — 21:00-01:00
const CRU_SCHEDULE: [number, string][] = [
  [1, DJ.Izaar],
  [2, DJ.UFO],
  [3, DJ.Manymaur],
  [4, DJ.Linze],
  [5, DJ['DJ Pound']],
  [6, DJ['Eskay Da Real']],
  [7, DJ.Camilo],
  [8, DJ.Izaar],
  [9, DJ.UFO],
  [10, DJ.Manymaur],
  [11, DJ.Linze],
  [12, DJ['DJ Pound']],
  [13, DJ['Eskay Da Real']],
  [14, DJ.Camilo],
  [15, DJ.Izaar],
  [16, DJ.UFO],
  [17, DJ.Manymaur],
  [18, DJ.Linze],
  [19, DJ['DJ Pound']],
  [20, DJ['Eskay Da Real']],
  [21, DJ.Camilo],
  [22, DJ.Izaar],
  [23, DJ.UFO],
  [24, DJ.Manymaur],
  [25, DJ.Linze],
  [26, DJ['DJ Pound']],
  [27, DJ['Eskay Da Real']],
  [28, DJ.Camilo],
  [29, DJ.Izaar],
  [30, DJ.UFO],
  [31, DJ.Manymaur],
];

// Cocoa XO — 21:00-01:00
const COCOA_SCHEDULE: [number, string][] = [
  [1, DJ.JJ],
  [2, DJ.Tohmo],
  [3, DJ.Krit],
  [4, DJ.Benji],
  [5, DJ.Tohmo],
  [6, DJ.Linze],
  [7, DJ['DJ Pound']],
  [8, DJ.JJ],
  [9, DJ.Tohmo],
  [10, DJ.Krit],
  [11, DJ.Benji],
  [12, DJ.Tohmo],
  [13, DJ.Linze],
  [14, DJ['Yui Truluv']], // Sub for Pound
  [15, DJ.JJ],
  [16, DJ.Tohmo],
  [17, DJ.Krit],
  [18, DJ.Benji],
  [19, DJ.Tohmo],
  [20, DJ.Linze],
  [21, DJ['Yui Truluv']], // Sub for Pound
  [22, DJ.Camilo], // Sub for JJ
  [23, DJ.Tohmo],
  [24, DJ.Krit],
  [25, DJ.Benji],
  [26, DJ.Tohmo],
  [27, DJ.Linze],
  [28, DJ['DJ Pound']],
  [29, DJ.JJ],
  [30, DJ.Tohmo],
  [31, DJ.Krit],
];

// Horizon — 18:30-22:30 (same weekly rotation as Feb)
// Sun/Sat: Ize, Mon/Thu/Fri: Nun, Tue/Wed: Pound
function buildHorizonSchedule(): [number, string][] {
  const schedule: [number, string][] = [];
  for (let day = 1; day <= 31; day++) {
    const date = new Date(2026, 2, day); // March 2026
    const dow = date.getDay(); // 0=Sun, 1=Mon, ...
    let djId: string;
    switch (dow) {
      case 0: // Sun
      case 6: // Sat
        djId = DJ['DJ Ize'];
        break;
      case 1: // Mon
      case 4: // Thu
      case 5: // Fri
        djId = DJ['DJ Nun'];
        break;
      case 2: // Tue
      case 3: // Wed
        djId = DJ['DJ Pound'];
        break;
      default:
        djId = DJ['DJ Nun'];
    }
    schedule.push([day, djId]);
  }
  return schedule;
}

const HORIZON_SCHEDULE = buildHorizonSchedule();

// =============================================================================
// MAIN
// =============================================================================

async function main() {
  console.log('='.repeat(60));
  console.log('  MARCH 2026 SCHEDULE SEED');
  console.log('  5 venues, ~186 assignments');
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
        firstName: dj.stageName.replace('DJ ', ''),
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
        category: (dj as any).category === 'MUSICIAN' ? ArtistCategory.MUSICIAN : ArtistCategory.DJ,
        genres: dj.genres,
        bio: (dj as any).bio || null,
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
  // Step 2: Verify all referenced DJs exist
  // =========================================================================
  console.log('\n2. Verifying existing DJs...\n');

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
  // Step 3: Seed assignments
  // =========================================================================

  const stats = { created: 0, skipped: 0 };

  // --- NOBU ---
  console.log('\n3. Seeding NOBU...');
  for (const [day, artistId, notes] of NOBU_SCHEDULE) {
    const isBrunch = day === 1; // Mar 1 = Brunch
    await upsertAssignment({
      id: `march-nobu-2026-03-${pad(day)}`,
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
  console.log(`   NOBU: ${stats.created} created, ${stats.skipped} skipped`);

  // --- LDK Early ---
  const beforeLdkE = { ...stats };
  console.log('\n4. Seeding LDK Early...');
  for (const [day, artistId] of LDK_EARLY_SCHEDULE) {
    await upsertAssignment({
      id: `march-ldk-2026-03-${pad(day)}-early`,
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
  console.log(`   LDK Early: ${stats.created - beforeLdkE.created} created, ${stats.skipped - beforeLdkE.skipped} skipped`);

  // --- LDK Late ---
  const beforeLdkL = { ...stats };
  console.log('\n5. Seeding LDK Late...');
  for (const [day, artistId] of LDK_LATE_SCHEDULE) {
    await upsertAssignment({
      id: `march-ldk-2026-03-${pad(day)}-late`,
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
  console.log(`   LDK Late: ${stats.created - beforeLdkL.created} created, ${stats.skipped - beforeLdkL.skipped} skipped`);

  // --- CRU ---
  const beforeCru = { ...stats };
  console.log('\n6. Seeding CRU...');
  for (const [day, artistId] of CRU_SCHEDULE) {
    await upsertAssignment({
      id: `march-cru-2026-03-${pad(day)}`,
      venueId: VENUES.CRU.id,
      artistId,
      day,
      startTime: '21:00',
      endTime: '01:00',
      slot: null,
      notes: null,
      stats,
    });
  }
  console.log(`   CRU: ${stats.created - beforeCru.created} created, ${stats.skipped - beforeCru.skipped} skipped`);

  // --- Cocoa XO ---
  const beforeCocoa = { ...stats };
  console.log('\n7. Seeding Cocoa XO...');
  for (const [day, artistId] of COCOA_SCHEDULE) {
    await upsertAssignment({
      id: `march-cocoa-2026-03-${pad(day)}`,
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
  console.log(`   Cocoa XO: ${stats.created - beforeCocoa.created} created, ${stats.skipped - beforeCocoa.skipped} skipped`);

  // --- Horizon ---
  const beforeHorizon = { ...stats };
  console.log('\n8. Seeding Horizon...');
  for (const [day, artistId] of HORIZON_SCHEDULE) {
    await upsertAssignment({
      id: `march-horizon-2026-03-${pad(day)}`,
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
  console.log(`   Horizon: ${stats.created - beforeHorizon.created} created, ${stats.skipped - beforeHorizon.skipped} skipped`);

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
  artistId: string;
  day: number;
  startTime: string;
  endTime: string;
  slot: string | null;
  notes: string | null;
  stats: { created: number; skipped: number };
}) {
  const { id, venueId, artistId, day, startTime, endTime, slot, notes, stats } = params;

  // Use noon UTC to avoid timezone date-shifting
  const date = new Date(Date.UTC(2026, 2, day, 12, 0, 0));

  try {
    await prisma.venueAssignment.create({
      data: {
        id,
        venueId,
        artistId,
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

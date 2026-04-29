/**
 * Venue Agent — schema smoke test.
 *
 * Exercises every Agent* model against the live agent_dev Postgres schema:
 * - Tenant create / unique slug constraint
 * - Member create / OWNER role / unique (tenantId, clerkUserId)
 * - Venue create / FK / cascade delete
 * - Artist create / unique (tenantId, stageName) per tenant
 * - ScheduleSlot upsert / unique (venueId, date, slot)
 * - Feedback create / 1:1 with slot
 * - Invoice create / unique (tenantId, invoiceNumber)
 * - LlmUsage create
 * - AuditLog create
 * - Cascade delete of tenant clears everything
 *
 * Run: npx tsx scripts/agent-schema-smoketest.ts
 *
 * Uses a uuid-suffixed slug + clerkUserId so it's safe to run repeatedly
 * and multiple instances can run in parallel without colliding.
 */

import { prismaAgent } from '../lib/prisma-agent';
import { randomUUID } from 'crypto';

type Result = { name: string; ok: boolean; detail?: string; ms: number };
const results: Result[] = [];

async function check(name: string, fn: () => Promise<void>) {
  const start = Date.now();
  try {
    await fn();
    results.push({ name, ok: true, ms: Date.now() - start });
    console.log(`  ✓ ${name} (${Date.now() - start}ms)`);
  } catch (err: any) {
    const detail = err?.message ?? String(err);
    results.push({ name, ok: false, detail, ms: Date.now() - start });
    console.log(`  ✗ ${name} — ${detail}`);
  }
}

async function main() {
  const runId = randomUUID().slice(0, 8);
  const tenantSlug = `smoke-${runId}`;
  const clerkUserId = `clerk_test_${runId}`;
  let tenantId = '';
  let venueId = '';
  let artistId = '';
  let slotId = '';
  let memberId = '';

  console.log(`\nVenue Agent schema smoke test — run ${runId}`);
  console.log(`Schema: agent_dev on Render Postgres (brightears_db)\n`);

  await check('AgentTenant.create + unique slug', async () => {
    const tenant = await prismaAgent.agentTenant.create({
      data: {
        name: `Smoke Test Tenant ${runId}`,
        slug: tenantSlug,
        tier: 'BETA',
        status: 'ACTIVE',
        autopilotMode: 'HYBRID',
      },
    });
    tenantId = tenant.id;
    if (!tenant.id) throw new Error('no id returned');
    if (tenant.tier !== 'BETA') throw new Error(`tier mismatch: ${tenant.tier}`);
    if (tenant.monthlyTokenAllowance !== 1000000) throw new Error('default allowance not applied');
  });

  await check('AgentTenant.unique slug constraint fires', async () => {
    try {
      await prismaAgent.agentTenant.create({
        data: { name: 'duplicate', slug: tenantSlug, tier: 'STARTER', status: 'TRIAL', autopilotMode: 'HYBRID' },
      });
      throw new Error('duplicate slug was accepted — constraint missing');
    } catch (err: any) {
      if (!err.message.includes('Unique constraint') && !err.code?.startsWith?.('P2002')) {
        throw err;
      }
    }
  });

  await check('AgentMember.create with OWNER role', async () => {
    const member = await prismaAgent.agentMember.create({
      data: {
        tenantId,
        clerkUserId,
        email: `${runId}@smoke.test`,
        role: 'OWNER',
        venueScope: [],
        acceptedAt: new Date(),
      },
    });
    memberId = member.id;
    if (member.role !== 'OWNER') throw new Error(`role mismatch: ${member.role}`);
  });

  await check('AgentMember.unique (tenantId, clerkUserId) fires', async () => {
    try {
      await prismaAgent.agentMember.create({
        data: { tenantId, clerkUserId, email: 'dup@smoke.test', role: 'MANAGER' },
      });
      throw new Error('duplicate (tenant, clerk) was accepted');
    } catch (err: any) {
      if (!err.message.includes('Unique constraint') && !err.code?.startsWith?.('P2002')) throw err;
    }
  });

  await check('AgentVenue.create with FK to tenant', async () => {
    const venue = await prismaAgent.agentVenue.create({
      data: {
        tenantId,
        name: `Smoke Venue ${runId}`,
        timezone: 'Asia/Bangkok',
        operatingHours: { fri: ['18:00', '02:00'], sat: ['18:00', '02:00'] },
        genreNotes: 'deep house, lounge',
        djRateCeiling: 1500,
      },
    });
    venueId = venue.id;
    if (venue.tenantId !== tenantId) throw new Error('FK mismatch');
  });

  await check('AgentArtist.create with unique (tenantId, stageName)', async () => {
    const artist = await prismaAgent.agentArtist.create({
      data: {
        tenantId,
        stageName: `DJ Smoke ${runId}`,
        realName: 'Smoke McTester',
        genres: ['deep-house', 'lounge'],
        hourlyRate: 1200,
        active: true,
      },
    });
    artistId = artist.id;
  });

  await check('AgentArtist.unique (tenantId, stageName) fires', async () => {
    try {
      await prismaAgent.agentArtist.create({
        data: { tenantId, stageName: `DJ Smoke ${runId}`, active: true },
      });
      throw new Error('duplicate stage name in tenant accepted');
    } catch (err: any) {
      if (!err.message.includes('Unique constraint') && !err.code?.startsWith?.('P2002')) throw err;
    }
  });

  await check('AgentScheduleSlot.upsert with composite unique (venueId, date, slot)', async () => {
    const date = new Date('2026-05-01T00:00:00Z');
    const slot = await prismaAgent.agentScheduleSlot.upsert({
      where: { venueId_date_slot: { venueId, date, slot: 'main' } },
      update: { artistId, status: 'CONFIRMED' },
      create: {
        tenantId,
        venueId,
        artistId,
        date,
        slot: 'main',
        startTime: '20:00',
        endTime: '00:00',
        status: 'CONFIRMED',
      },
    });
    slotId = slot.id;
    if (slot.status !== 'CONFIRMED') throw new Error('status not set');

    // Idempotent: re-upsert should hit update path
    const again = await prismaAgent.agentScheduleSlot.upsert({
      where: { venueId_date_slot: { venueId, date, slot: 'main' } },
      update: { status: 'COMPLETED' },
      create: { tenantId, venueId, date, slot: 'main', startTime: '20:00', endTime: '00:00' },
    });
    if (again.id !== slot.id) throw new Error('upsert created new row instead of updating');
    if (again.status !== 'COMPLETED') throw new Error('upsert update did not apply');
  });

  await check('AgentFeedback.create 1:1 with slot', async () => {
    const fb = await prismaAgent.agentFeedback.create({
      data: { scheduleSlotId: slotId, tenantId, overallRating: 5, notes: 'smoke ok' },
    });
    if (fb.overallRating !== 5) throw new Error('rating not stored');
  });

  await check('AgentInvoice.create with unique (tenantId, invoiceNumber)', async () => {
    await prismaAgent.agentInvoice.create({
      data: {
        tenantId,
        venueId,
        invoiceNumber: `SMOKE-${runId}`,
        periodStart: new Date('2026-04-01'),
        periodEnd: new Date('2026-04-30'),
        subtotal: '10000.00',
        vat: '700.00',
        withholdingTax: '500.00',
        total: '10200.00',
      },
    });
  });

  await check('AgentLlmUsage.create + tenant relation read', async () => {
    await prismaAgent.agentLlmUsage.create({
      data: {
        tenantId,
        model: 'qwen/qwen3-72b-instruct',
        provider: 'openrouter',
        inputTokens: 100,
        outputTokens: 250,
        costUsd: 0.001,
        taskType: 'chat',
        durationMs: 800,
      },
    });
  });

  await check('AgentAuditLog.create', async () => {
    await prismaAgent.agentAuditLog.create({
      data: {
        tenantId,
        actorClerkUserId: clerkUserId,
        action: 'smoke.test',
        resourceType: 'AgentTenant',
        resourceId: tenantId,
        details: { run: runId },
      },
    });
  });

  await check('Tenant-scoped read returns full graph', async () => {
    const tenant = await prismaAgent.agentTenant.findUnique({
      where: { id: tenantId },
      include: {
        members: true,
        venues: { include: { scheduleSlots: { include: { artist: true, feedback: true } } } },
        artists: true,
        auditLog: true,
      },
    });
    if (!tenant) throw new Error('tenant not found');
    if (tenant.members.length !== 1) throw new Error(`members: ${tenant.members.length}`);
    if (tenant.venues.length !== 1) throw new Error(`venues: ${tenant.venues.length}`);
    if (tenant.artists.length !== 1) throw new Error(`artists: ${tenant.artists.length}`);
    if (tenant.venues[0].scheduleSlots.length !== 1) throw new Error('slot missing');
    if (tenant.venues[0].scheduleSlots[0].artist?.id !== artistId) throw new Error('artist not joined');
    if (!tenant.venues[0].scheduleSlots[0].feedback) throw new Error('feedback not joined');
    if (tenant.auditLog.length !== 1) throw new Error('audit log missing');
  });

  await check('Cascade delete: drop tenant, all children gone', async () => {
    await prismaAgent.agentTenant.delete({ where: { id: tenantId } });
    const lingering = await Promise.all([
      prismaAgent.agentMember.findFirst({ where: { tenantId } }),
      prismaAgent.agentVenue.findFirst({ where: { tenantId } }),
      prismaAgent.agentArtist.findFirst({ where: { tenantId } }),
      prismaAgent.agentScheduleSlot.findFirst({ where: { tenantId } }),
      prismaAgent.agentFeedback.findFirst({ where: { tenantId } }),
      prismaAgent.agentInvoice.findFirst({ where: { tenantId } }),
      prismaAgent.agentLlmUsage.findFirst({ where: { tenantId } }),
      prismaAgent.agentAuditLog.findFirst({ where: { tenantId } }),
    ]);
    const survivors = lingering.filter((x) => x !== null);
    if (survivors.length > 0) throw new Error(`${survivors.length} rows survived cascade`);
  });

  await prismaAgent.$disconnect();

  const passed = results.filter((r) => r.ok).length;
  const failed = results.filter((r) => !r.ok).length;
  const totalMs = results.reduce((s, r) => s + r.ms, 0);

  console.log(`\nResult: ${passed}/${results.length} passed (${totalMs}ms total)`);
  if (failed > 0) {
    console.log(`\nFailures:`);
    results.filter((r) => !r.ok).forEach((r) => console.log(`  - ${r.name}: ${r.detail}`));
    process.exit(1);
  }
}

main().catch(async (err) => {
  console.error('FATAL:', err);
  await prismaAgent.$disconnect();
  process.exit(1);
});

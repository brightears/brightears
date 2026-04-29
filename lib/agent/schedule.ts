/**
 * Venue Agent — schedule grid actions.
 *
 * Server actions for reading and writing AgentScheduleSlot rows.
 * All writes log an audit event. Reads enforce venueScope.
 *
 * Started 2026-04-29.
 */

'use server';

import { prismaAgent } from '@/lib/prisma-agent';
import {
  getAgentSession,
  getAccessibleVenueIds,
  requireRole,
  AgentForbiddenError,
} from './tenant';
import { logAuditEvent } from './audit';
import { AgentSlotStatus } from '@prisma/agent-client';

export type ScheduleSlotInput = {
  venueId: string;
  date: string;             // ISO yyyy-mm-dd
  slot?: string | null;     // "Early", "Late", "main"
  startTime: string;        // "18:00"
  endTime: string;          // "21:00"
  artistId?: string | null;
  specialEvent?: string | null;
  notes?: string | null;
};

export type ScheduleSlotResult =
  | { ok: true; slotId: string }
  | { ok: false; error: string };

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

function parseDateOnly(dateStr: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return null;
  const d = new Date(`${dateStr}T00:00:00.000Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Read all slots for a venue between two ISO dates (inclusive). */
export async function listSlots(opts: {
  venueId: string;
  fromDate: string;     // yyyy-mm-dd
  toDate: string;       // yyyy-mm-dd
}) {
  const session = await getAgentSession();
  if (!session) throw new AgentForbiddenError('Not signed in');

  const accessible = await getAccessibleVenueIds(session);
  if (!accessible.includes(opts.venueId)) {
    throw new AgentForbiddenError('Venue out of scope');
  }

  const from = parseDateOnly(opts.fromDate);
  const to = parseDateOnly(opts.toDate);
  if (!from || !to) throw new Error('Invalid date');

  return prismaAgent.agentScheduleSlot.findMany({
    where: {
      venueId: opts.venueId,
      date: { gte: from, lte: to },
    },
    include: { artist: true },
    orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
  });
}

/** Upsert a slot (date + venue + slot is the natural key per schema). */
export async function upsertSlot(input: ScheduleSlotInput): Promise<ScheduleSlotResult> {
  const session = await getAgentSession();
  if (!session) return { ok: false, error: 'Not signed in' };

  try {
    requireRole(session, 'MANAGER');
  } catch (e) {
    return { ok: false, error: 'Manager role required' };
  }

  const accessible = await getAccessibleVenueIds(session);
  if (!accessible.includes(input.venueId)) {
    return { ok: false, error: 'Venue out of scope' };
  }

  if (!TIME_PATTERN.test(input.startTime) || !TIME_PATTERN.test(input.endTime)) {
    return { ok: false, error: 'startTime and endTime must be HH:mm' };
  }

  const date = parseDateOnly(input.date);
  if (!date) return { ok: false, error: 'date must be yyyy-mm-dd' };

  if (input.artistId) {
    const artist = await prismaAgent.agentArtist.findFirst({
      where: { id: input.artistId, tenantId: session.tenant.id },
    });
    if (!artist) return { ok: false, error: 'Artist not found in tenant roster' };
  }

  const slot = await prismaAgent.agentScheduleSlot.upsert({
    where: {
      venueId_date_slot: {
        venueId: input.venueId,
        date,
        slot: input.slot ?? '',
      },
    },
    create: {
      tenantId: session.tenant.id,
      venueId: input.venueId,
      artistId: input.artistId ?? null,
      date,
      slot: input.slot ?? null,
      startTime: input.startTime,
      endTime: input.endTime,
      specialEvent: input.specialEvent ?? null,
      notes: input.notes ?? null,
      status: input.specialEvent
        ? AgentSlotStatus.NO_DJ
        : input.artistId
          ? AgentSlotStatus.CONFIRMED
          : AgentSlotStatus.PLANNED,
    },
    update: {
      artistId: input.artistId ?? null,
      startTime: input.startTime,
      endTime: input.endTime,
      specialEvent: input.specialEvent ?? null,
      notes: input.notes ?? null,
      status: input.specialEvent
        ? AgentSlotStatus.NO_DJ
        : input.artistId
          ? AgentSlotStatus.CONFIRMED
          : AgentSlotStatus.PLANNED,
    },
  });

  await logAuditEvent({
    tenantId: session.tenant.id,
    actorClerkUserId: session.member.clerkUserId,
    action: 'schedule.upsert',
    resourceType: 'AgentScheduleSlot',
    resourceId: slot.id,
    details: {
      venueId: input.venueId,
      date: input.date,
      slot: input.slot,
      artistId: input.artistId,
      specialEvent: input.specialEvent,
    },
  });

  return { ok: true, slotId: slot.id };
}

/** Delete a slot. */
export async function deleteSlot(slotId: string): Promise<ScheduleSlotResult> {
  const session = await getAgentSession();
  if (!session) return { ok: false, error: 'Not signed in' };

  try {
    requireRole(session, 'MANAGER');
  } catch {
    return { ok: false, error: 'Manager role required' };
  }

  const slot = await prismaAgent.agentScheduleSlot.findUnique({ where: { id: slotId } });
  if (!slot || slot.tenantId !== session.tenant.id) {
    return { ok: false, error: 'Slot not found in tenant' };
  }

  const accessible = await getAccessibleVenueIds(session);
  if (!accessible.includes(slot.venueId)) {
    return { ok: false, error: 'Venue out of scope' };
  }

  await prismaAgent.agentScheduleSlot.delete({ where: { id: slotId } });

  await logAuditEvent({
    tenantId: session.tenant.id,
    actorClerkUserId: session.member.clerkUserId,
    action: 'schedule.delete',
    resourceType: 'AgentScheduleSlot',
    resourceId: slotId,
    details: { venueId: slot.venueId, date: slot.date.toISOString().slice(0, 10) },
  });

  return { ok: true, slotId };
}

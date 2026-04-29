/**
 * Venue Agent — venue management actions.
 *
 * AgentVenue rows belong to a tenant. A Group-tier tenant can have many
 * venues; Starter tier is capped at 1.
 *
 * Started 2026-04-29.
 */

'use server';

import { prisma } from '@/lib/prisma';
import { getAgentSession, requireRole, AgentForbiddenError } from './tenant';
import { logAuditEvent } from './audit';
import { AgentTenantTier } from '@prisma/client';

export type VenueInput = {
  name: string;
  timezone?: string;
  operatingHours?: Record<string, [string, string]>;  // {mon: ["18:00","00:00"], ...}
  genreNotes?: string | null;
  djRateCeiling?: number | null;
  notes?: string | null;
};

export type VenueResult =
  | { ok: true; venueId: string }
  | { ok: false; error: string };

const VENUE_LIMIT_BY_TIER: Record<AgentTenantTier, number> = {
  STARTER: 1,
  PRO: 1,
  GROUP: 5,
  ENTERPRISE: Number.MAX_SAFE_INTEGER,
  BETA: 6,        // matches our internal agency footprint
};

/** List the tenant's venues. Filters to venueScope when set. */
export async function listVenues() {
  const session = await getAgentSession();
  if (!session) throw new AgentForbiddenError('Not signed in');

  return prisma.agentVenue.findMany({
    where: {
      tenantId: session.tenant.id,
      ...(session.member.venueScope.length > 0
        ? { id: { in: session.member.venueScope } }
        : {}),
    },
    orderBy: { name: 'asc' },
  });
}

/** Create a venue. Hits the tier-based cap. */
export async function addVenue(input: VenueInput): Promise<VenueResult> {
  const session = await getAgentSession();
  if (!session) return { ok: false, error: 'Not signed in' };

  try {
    requireRole(session, 'CORPORATE_HEAD');
  } catch {
    return { ok: false, error: 'Corporate head or owner role required' };
  }

  const name = input.name.trim();
  if (!name) return { ok: false, error: 'Venue name is required' };

  const venueCount = await prisma.agentVenue.count({
    where: { tenantId: session.tenant.id },
  });
  const limit = VENUE_LIMIT_BY_TIER[session.tenant.tier];
  if (venueCount >= limit) {
    return {
      ok: false,
      error: `Venue limit reached for ${session.tenant.tier} tier (${limit}). Upgrade to add more.`,
    };
  }

  const venue = await prisma.agentVenue.create({
    data: {
      tenantId: session.tenant.id,
      name,
      timezone: input.timezone ?? 'Asia/Bangkok',
      operatingHours: input.operatingHours
        ? (input.operatingHours as object)
        : undefined,
      genreNotes: input.genreNotes ?? null,
      djRateCeiling: input.djRateCeiling ?? null,
      notes: input.notes ?? null,
    },
  });

  await logAuditEvent({
    tenantId: session.tenant.id,
    actorClerkUserId: session.member.clerkUserId,
    action: 'venue.create',
    resourceType: 'AgentVenue',
    resourceId: venue.id,
    details: { name },
  });

  return { ok: true, venueId: venue.id };
}

/** Update a venue. Owner / corporate head only. */
export async function updateVenue(
  venueId: string,
  patch: Partial<VenueInput>,
): Promise<VenueResult> {
  const session = await getAgentSession();
  if (!session) return { ok: false, error: 'Not signed in' };

  try {
    requireRole(session, 'CORPORATE_HEAD');
  } catch {
    return { ok: false, error: 'Corporate head or owner role required' };
  }

  const venue = await prisma.agentVenue.findUnique({ where: { id: venueId } });
  if (!venue || venue.tenantId !== session.tenant.id) {
    return { ok: false, error: 'Venue not in tenant' };
  }

  const data: Record<string, unknown> = {};
  if (patch.name !== undefined) data.name = patch.name.trim();
  if (patch.timezone !== undefined) data.timezone = patch.timezone;
  if (patch.operatingHours !== undefined) data.operatingHours = patch.operatingHours;
  if (patch.genreNotes !== undefined) data.genreNotes = patch.genreNotes;
  if (patch.djRateCeiling !== undefined) data.djRateCeiling = patch.djRateCeiling;
  if (patch.notes !== undefined) data.notes = patch.notes;

  await prisma.agentVenue.update({ where: { id: venueId }, data });

  await logAuditEvent({
    tenantId: session.tenant.id,
    actorClerkUserId: session.member.clerkUserId,
    action: 'venue.update',
    resourceType: 'AgentVenue',
    resourceId: venueId,
    details: { fields: Object.keys(data) },
  });

  return { ok: true, venueId };
}

/**
 * Venue Agent — artist roster actions.
 *
 * Server actions for managing a tenant's DJ roster (AgentArtist).
 * The roster is per-tenant — no cross-tenant artist sharing in MVP.
 *
 * Started 2026-04-29.
 */

'use server';

import { prisma } from '@/lib/prisma';
import { getAgentSession, requireRole, AgentForbiddenError } from './tenant';
import { logAuditEvent } from './audit';

export type ArtistInput = {
  stageName: string;
  realName?: string | null;
  genres?: string[];
  hourlyRate?: number | null;
  lineGroupId?: string | null;
  email?: string | null;
  phone?: string | null;
  notes?: string | null;
  active?: boolean;
};

export type ArtistResult =
  | { ok: true; artistId: string }
  | { ok: false; error: string };

/** List the roster for the current tenant. */
export async function listArtists(opts?: { activeOnly?: boolean }) {
  const session = await getAgentSession();
  if (!session) throw new AgentForbiddenError('Not signed in');

  return prisma.agentArtist.findMany({
    where: {
      tenantId: session.tenant.id,
      ...(opts?.activeOnly ? { active: true } : {}),
    },
    orderBy: { stageName: 'asc' },
  });
}

/** Add an artist to the tenant's roster. Stage name unique per tenant. */
export async function addArtist(input: ArtistInput): Promise<ArtistResult> {
  const session = await getAgentSession();
  if (!session) return { ok: false, error: 'Not signed in' };

  try {
    requireRole(session, 'MANAGER');
  } catch {
    return { ok: false, error: 'Manager role required' };
  }

  const stageName = input.stageName.trim();
  if (!stageName) return { ok: false, error: 'Stage name is required' };

  const existing = await prisma.agentArtist.findUnique({
    where: {
      tenantId_stageName: { tenantId: session.tenant.id, stageName },
    },
  });
  if (existing) return { ok: false, error: 'Artist already exists in roster' };

  const artist = await prisma.agentArtist.create({
    data: {
      tenantId: session.tenant.id,
      stageName,
      realName: input.realName ?? null,
      genres: input.genres ?? [],
      hourlyRate: input.hourlyRate ?? null,
      lineGroupId: input.lineGroupId ?? null,
      email: input.email ?? null,
      phone: input.phone ?? null,
      notes: input.notes ?? null,
      active: input.active ?? true,
    },
  });

  await logAuditEvent({
    tenantId: session.tenant.id,
    actorClerkUserId: session.member.clerkUserId,
    action: 'artist.create',
    resourceType: 'AgentArtist',
    resourceId: artist.id,
    details: { stageName },
  });

  return { ok: true, artistId: artist.id };
}

/** Update an artist record. Pass only fields that should change. */
export async function updateArtist(
  artistId: string,
  patch: Partial<ArtistInput>,
): Promise<ArtistResult> {
  const session = await getAgentSession();
  if (!session) return { ok: false, error: 'Not signed in' };

  try {
    requireRole(session, 'MANAGER');
  } catch {
    return { ok: false, error: 'Manager role required' };
  }

  const artist = await prisma.agentArtist.findUnique({ where: { id: artistId } });
  if (!artist || artist.tenantId !== session.tenant.id) {
    return { ok: false, error: 'Artist not in tenant roster' };
  }

  const data: Record<string, unknown> = {};
  if (patch.stageName !== undefined) data.stageName = patch.stageName.trim();
  if (patch.realName !== undefined) data.realName = patch.realName;
  if (patch.genres !== undefined) data.genres = patch.genres;
  if (patch.hourlyRate !== undefined) data.hourlyRate = patch.hourlyRate;
  if (patch.lineGroupId !== undefined) data.lineGroupId = patch.lineGroupId;
  if (patch.email !== undefined) data.email = patch.email;
  if (patch.phone !== undefined) data.phone = patch.phone;
  if (patch.notes !== undefined) data.notes = patch.notes;
  if (patch.active !== undefined) data.active = patch.active;

  await prisma.agentArtist.update({ where: { id: artistId }, data });

  await logAuditEvent({
    tenantId: session.tenant.id,
    actorClerkUserId: session.member.clerkUserId,
    action: 'artist.update',
    resourceType: 'AgentArtist',
    resourceId: artistId,
    details: { fields: Object.keys(data) },
  });

  return { ok: true, artistId };
}

/** Soft-deactivate an artist (preserves history; can be reactivated). */
export async function deactivateArtist(artistId: string): Promise<ArtistResult> {
  return updateArtist(artistId, { active: false });
}

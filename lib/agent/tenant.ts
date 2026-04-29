/**
 * Venue Agent — tenant resolution + RBAC.
 *
 * Every agent-side server action / route handler resolves the current
 * tenant + member here before doing anything else. Returns null when
 * the request isn't authenticated or the user isn't a member of the
 * resolved tenant.
 *
 * The "current tenant" is determined by:
 *   1. an explicit ?tenant=<slug> URL param (used in tenant-switching),
 *   2. or the most-recently-active tenant for this Clerk user.
 *
 * Started 2026-04-29. UI-side tenant switcher comes later — for now the
 * server resolves the user's first tenant.
 */

import { auth } from '@clerk/nextjs/server';
import { prismaAgent } from '@/lib/prisma-agent';
import { AgentTenant, AgentMember, AgentMemberRole } from '@prisma/agent-client';

export type AgentSession = {
  tenant: AgentTenant;
  member: AgentMember;
};

/**
 * Resolves the active agent session for the current Clerk user.
 * Returns null when not signed in or not a member of any tenant.
 */
export async function getAgentSession(opts?: {
  tenantSlug?: string;
}): Promise<AgentSession | null> {
  const { userId } = await auth();
  if (!userId) return null;

  if (opts?.tenantSlug) {
    const tenant = await prismaAgent.agentTenant.findUnique({
      where: { slug: opts.tenantSlug },
      include: {
        members: { where: { clerkUserId: userId } },
      },
    });
    if (!tenant || tenant.members.length === 0) return null;
    return { tenant, member: tenant.members[0] };
  }

  // Default: most-recently-accepted membership.
  const member = await prismaAgent.agentMember.findFirst({
    where: { clerkUserId: userId, acceptedAt: { not: null } },
    orderBy: { acceptedAt: 'desc' },
    include: { tenant: true },
  });
  if (!member) return null;
  return { tenant: member.tenant, member };
}

/**
 * Asserts the current member has at least the given role.
 * Throws to surface to the caller; UI/handler code wraps this with try/catch.
 */
export function requireRole(
  session: AgentSession,
  minRole: AgentMemberRole,
): void {
  const order: AgentMemberRole[] = ['ASSISTANT', 'MANAGER', 'CORPORATE_HEAD', 'OWNER'];
  const have = order.indexOf(session.member.role);
  const need = order.indexOf(minRole);
  if (have < 0 || have < need) {
    throw new AgentForbiddenError(`Role ${session.member.role} insufficient (need ${minRole})`);
  }
}

/**
 * Returns the venue ids this member can access:
 *  - empty venueScope means "all tenant venues"
 *  - non-empty venueScope means just those ids
 */
export async function getAccessibleVenueIds(session: AgentSession): Promise<string[]> {
  if (session.member.venueScope.length > 0) return session.member.venueScope;
  const venues = await prismaAgent.agentVenue.findMany({
    where: { tenantId: session.tenant.id },
    select: { id: true },
  });
  return venues.map((v) => v.id);
}

export class AgentForbiddenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AgentForbiddenError';
  }
}

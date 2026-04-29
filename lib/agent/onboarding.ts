/**
 * Venue Agent — tenant onboarding.
 *
 * Server-only helper to create a new AgentTenant + assign the current
 * Clerk user as OWNER. Called from the onboarding wizard route.
 *
 * Idempotent on slug — if a tenant with the slug already exists, throws.
 *
 * Started 2026-04-29.
 */

'use server';

import { auth, currentUser } from '@clerk/nextjs/server';
import { prismaAgent } from '@/lib/prisma-agent';
import { logAuditEvent } from './audit';

export type OnboardInput = {
  tenantName: string;          // "Sato San Hotel"
  tenantSlug: string;          // "sato-san"
  brandName?: string;
  firstVenue?: {
    name: string;
    timezone?: string;
  };
};

export type OnboardResult =
  | { ok: true; tenantId: string; venueId?: string }
  | { ok: false; error: string };

const SLUG_PATTERN = /^[a-z0-9](?:[a-z0-9-]{1,38}[a-z0-9])?$/;

function isReservedSlug(slug: string): boolean {
  return ['admin', 'app', 'api', 'www', 'mail', 'support', 'help', 'docs'].includes(slug);
}

export async function onboardTenant(input: OnboardInput): Promise<OnboardResult> {
  const { userId } = await auth();
  if (!userId) return { ok: false, error: 'Not signed in' };

  const tenantName = input.tenantName.trim();
  const slug = input.tenantSlug.trim().toLowerCase();

  if (!tenantName) return { ok: false, error: 'Tenant name is required' };
  if (!SLUG_PATTERN.test(slug)) {
    return { ok: false, error: 'Slug must be 2-40 chars, lowercase letters/digits/hyphens, no leading or trailing hyphen' };
  }
  if (isReservedSlug(slug)) {
    return { ok: false, error: 'That slug is reserved. Pick another.' };
  }

  const existing = await prismaAgent.agentTenant.findUnique({ where: { slug } });
  if (existing) return { ok: false, error: 'A tenant with that slug already exists' };

  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  if (!email) return { ok: false, error: 'No email on Clerk account' };

  const result = await prismaAgent.$transaction(async (tx) => {
    const tenant = await tx.agentTenant.create({
      data: {
        name: tenantName,
        slug,
        tier: 'STARTER',
        status: 'TRIAL',
        autopilotMode: 'HYBRID',
        brandName: input.brandName ?? tenantName,
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
    });

    await tx.agentMember.create({
      data: {
        tenantId: tenant.id,
        clerkUserId: userId,
        email,
        displayName: user?.firstName ? `${user.firstName} ${user.lastName ?? ''}`.trim() : null,
        role: 'OWNER',
        venueScope: [],
        acceptedAt: new Date(),
      },
    });

    let venueId: string | undefined;
    if (input.firstVenue?.name) {
      const venue = await tx.agentVenue.create({
        data: {
          tenantId: tenant.id,
          name: input.firstVenue.name,
          timezone: input.firstVenue.timezone ?? 'Asia/Bangkok',
        },
      });
      venueId = venue.id;
    }

    return { tenantId: tenant.id, venueId };
  });

  await logAuditEvent({
    tenantId: result.tenantId,
    actorClerkUserId: userId,
    action: 'tenant.create',
    resourceType: 'AgentTenant',
    resourceId: result.tenantId,
    details: { slug, name: tenantName },
  });

  return { ok: true, tenantId: result.tenantId, venueId: result.venueId };
}

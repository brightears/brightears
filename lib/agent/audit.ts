/**
 * Venue Agent — audit log helper.
 *
 * Every consequential action (schedule write, DJ message, invoice send)
 * goes through here so a tenant can audit what its agent did and when.
 * Crucial for the "co-pilot trust" UX — manager can replay every step.
 */

import { prisma } from '@/lib/prisma';

export type AuditEvent = {
  tenantId: string;
  actorClerkUserId?: string;       // omit when the agent acted autonomously
  actorIsAgent?: boolean;
  action: string;                  // e.g. "schedule.update", "dj.message", "invoice.send"
  resourceType?: string;
  resourceId?: string;
  details?: Record<string, unknown>;
};

export async function logAuditEvent(event: AuditEvent): Promise<void> {
  try {
    await prisma.agentAuditLog.create({
      data: {
        tenantId: event.tenantId,
        actorClerkUserId: event.actorClerkUserId,
        actorIsAgent: event.actorIsAgent ?? false,
        action: event.action,
        resourceType: event.resourceType,
        resourceId: event.resourceId,
        details: event.details ? (event.details as object) : undefined,
      },
    });
  } catch (err) {
    // Audit logging is best-effort. Never let an audit failure break the action itself.
    console.error('[agent.audit] failed to write audit event', err, event);
  }
}

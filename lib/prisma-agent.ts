/**
 * Venue Agent — separate Prisma client.
 *
 * Connects to the `agent_dev` Postgres schema on the same Render instance
 * as the agency database, but completely isolated. Prisma generates this
 * client to .prisma/agent-client; we re-export it here so callers can
 * `import { prismaAgent } from '@/lib/prisma-agent'`.
 *
 * Started 2026-04-29.
 */

import { PrismaClient } from '@prisma/agent-client';

const globalForPrismaAgent = globalThis as unknown as {
  prismaAgent: PrismaClient | undefined;
};

export const prismaAgent =
  globalForPrismaAgent.prismaAgent ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrismaAgent.prismaAgent = prismaAgent;
}

export type { PrismaClient as PrismaAgentClient } from '@prisma/agent-client';

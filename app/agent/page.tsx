/**
 * Venue Agent — landing.
 *
 * Lists the tenants the current Clerk user is a member of. Click one to
 * enter that tenant's dashboard. Unauth → sign-in prompt.
 *
 * Started 2026-04-29 — UI is intentionally minimal until layout is locked.
 */

import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { prismaAgent } from '@/lib/prisma-agent';

export const dynamic = 'force-dynamic';

export default async function AgentLandingPage() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="mb-2 text-lg font-semibold">Sign in to continue</h2>
        <p className="mb-6 text-sm text-slate-600">
          The BrightEars Agent dashboard is for venue managers. Sign in or create
          an account to start.
        </p>
        <div className="flex gap-3">
          <Link
            href="/sign-in"
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-900"
          >
            Create account
          </Link>
        </div>
      </section>
    );
  }

  const memberships = await prismaAgent.agentMember.findMany({
    where: { clerkUserId: userId },
    include: { tenant: true },
    orderBy: { invitedAt: 'desc' },
  });

  if (memberships.length === 0) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="mb-2 text-lg font-semibold">No agent workspaces yet</h2>
        <p className="mb-6 text-sm text-slate-600">
          You're signed in, but you're not a member of any Venue Agent workspace.
          Create one to set up your venue's entertainment programming.
        </p>
        <Link
          href="/agent/onboard"
          className="inline-block rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white"
        >
          Create a workspace
        </Link>
      </section>
    );
  }

  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold">Your workspaces</h2>
      <ul className="space-y-3">
        {memberships.map((m) => (
          <li
            key={m.id}
            className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
          >
            <Link
              href={`/agent/${m.tenant.slug}/dashboard`}
              className="flex items-center justify-between"
            >
              <div>
                <div className="font-medium">{m.tenant.name}</div>
                <div className="text-sm text-slate-500">
                  {m.role.toLowerCase().replace('_', ' ')} · {m.tenant.tier.toLowerCase()} tier
                </div>
              </div>
              <span className="text-sm text-slate-400">→</span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <Link
          href="/agent/onboard"
          className="inline-block text-sm text-slate-600 underline"
        >
          + Create another workspace
        </Link>
      </div>
    </section>
  );
}

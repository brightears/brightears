/**
 * Venue Agent — settings.
 *
 * Three sections:
 *   1. Workspace — name, autopilot mode, tier (read-only display)
 *   2. Venues — list + add
 *   3. Members — list (invites in Phase 2)
 *
 * Started 2026-04-29 day 2.
 */

import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { prismaAgent } from '@/lib/prisma-agent';
import { addVenue } from '@/lib/agent/venues';
import { logAuditEvent } from '@/lib/agent/audit';
import { AgentAutopilotMode } from '@prisma/agent-client';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string; ok?: string }>;
};

async function handleAutopilotChange(formData: FormData) {
  'use server';
  const slug = String(formData.get('slug') ?? '');
  const mode = String(formData.get('mode') ?? '') as AgentAutopilotMode;

  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const tenant = await prismaAgent.agentTenant.findUnique({
    where: { slug },
    include: { members: { where: { clerkUserId: userId } } },
  });
  if (!tenant || tenant.members.length === 0) {
    redirect(`/agent`);
  }
  const member = tenant.members[0];
  if (member.role !== 'OWNER' && member.role !== 'CORPORATE_HEAD') {
    redirect(`/agent/${slug}/settings?error=Only+owner+or+corporate+head+can+change+autopilot+mode`);
  }
  if (!['COPILOT', 'HYBRID', 'AUTOPILOT'].includes(mode)) {
    redirect(`/agent/${slug}/settings?error=Invalid+mode`);
  }

  await prismaAgent.agentTenant.update({
    where: { id: tenant.id },
    data: { autopilotMode: mode },
  });
  await logAuditEvent({
    tenantId: tenant.id,
    actorClerkUserId: userId,
    action: 'tenant.autopilot.update',
    resourceType: 'AgentTenant',
    resourceId: tenant.id,
    details: { mode },
  });
  redirect(`/agent/${slug}/settings?ok=1`);
}

async function handleAddVenue(formData: FormData) {
  'use server';
  const slug = String(formData.get('slug') ?? '');
  const name = String(formData.get('name') ?? '').trim();
  const timezone = String(formData.get('timezone') ?? '').trim() || undefined;
  const genreNotes = String(formData.get('genreNotes') ?? '').trim() || undefined;
  const djRateCeilingStr = String(formData.get('djRateCeiling') ?? '').trim();
  const djRateCeiling = djRateCeilingStr ? parseInt(djRateCeilingStr, 10) : undefined;

  const result = await addVenue({ name, timezone, genreNotes, djRateCeiling });
  if (!result.ok) {
    redirect(`/agent/${slug}/settings?error=${encodeURIComponent(result.error)}`);
  }
  redirect(`/agent/${slug}/settings?ok=1`);
}

export default async function SettingsPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { error, ok } = await searchParams;

  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const tenant = await prismaAgent.agentTenant.findUnique({
    where: { slug },
    include: {
      members: { include: {} },
    },
  });
  if (!tenant) notFound();
  const me = tenant.members.find((m) => m.clerkUserId === userId);
  if (!me) notFound();

  const venues = await prismaAgent.agentVenue.findMany({
    where: { tenantId: tenant.id },
    orderBy: { name: 'asc' },
  });

  const isOwner = me.role === 'OWNER' || me.role === 'CORPORATE_HEAD';

  return (
    <div className="space-y-10">
      <div>
        <Link
          href={`/agent/${slug}/dashboard`}
          className="text-sm text-slate-500 underline"
        >
          ← Back to dashboard
        </Link>
      </div>

      {error && (
        <div className="rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          {error}
        </div>
      )}
      {ok && (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
          Saved.
        </div>
      )}

      {/* Workspace section */}
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-semibold">Workspace</h2>
        <dl className="grid gap-3 text-sm md:grid-cols-2">
          <div>
            <dt className="text-xs uppercase text-slate-500">Name</dt>
            <dd className="font-medium">{tenant.name}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-slate-500">Slug</dt>
            <dd className="font-mono text-slate-700">{tenant.slug}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-slate-500">Tier</dt>
            <dd>{tenant.tier}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-slate-500">Status</dt>
            <dd>{tenant.status}</dd>
          </div>
        </dl>

        <div className="mt-6 border-t border-slate-100 pt-6">
          <form action={handleAutopilotChange} className="flex flex-col gap-3 md:flex-row md:items-end">
            <input type="hidden" name="slug" value={slug} />
            <div className="flex-1">
              <label
                htmlFor="mode"
                className="block text-xs uppercase text-slate-500"
              >
                Autopilot mode
              </label>
              <p className="mt-1 text-xs text-slate-500">
                <strong>Co-pilot</strong>: agent drafts every external send for
                approval. <strong>Hybrid</strong> (default): internal/reversible
                actions auto, external sends drafted. <strong>Autopilot</strong>:
                agent acts on Tier 2 too — reserved for power users.
              </p>
              <select
                id="mode"
                name="mode"
                defaultValue={tenant.autopilotMode}
                disabled={!isOwner}
                className="mt-2 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm disabled:bg-slate-50 focus:border-slate-900 focus:outline-none"
              >
                <option value="COPILOT">Co-pilot</option>
                <option value="HYBRID">Hybrid (default)</option>
                <option value="AUTOPILOT">Autopilot</option>
              </select>
            </div>
            {isOwner && (
              <button
                type="submit"
                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white"
              >
                Save
              </button>
            )}
          </form>
        </div>
      </section>

      {/* Venues section */}
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-semibold">Venues</h2>
        {venues.length === 0 ? (
          <p className="text-sm text-slate-500">No venues yet.</p>
        ) : (
          <ul className="space-y-2">
            {venues.map((v) => (
              <li
                key={v.id}
                className="flex items-center justify-between rounded-md border border-slate-100 px-4 py-2"
              >
                <div>
                  <span className="font-medium">{v.name}</span>{' '}
                  <span className="ml-2 text-xs text-slate-500">{v.timezone}</span>
                </div>
                <span className="text-xs text-slate-400">
                  {v.djRateCeiling ? `฿${v.djRateCeiling}/h ceil.` : ''}
                </span>
              </li>
            ))}
          </ul>
        )}

        {isOwner && (
          <form
            action={handleAddVenue}
            className="mt-6 grid gap-3 border-t border-slate-100 pt-6 md:grid-cols-2"
          >
            <input type="hidden" name="slug" value={slug} />
            <div>
              <label htmlFor="name" className="block text-xs uppercase text-slate-500">
                Add venue
              </label>
              <input
                id="name"
                name="name"
                required
                placeholder="Sato San Rooftop"
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-900 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="timezone" className="block text-xs uppercase text-slate-500">
                Timezone
              </label>
              <input
                id="timezone"
                name="timezone"
                defaultValue="Asia/Bangkok"
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-900 focus:outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="genreNotes" className="block text-xs uppercase text-slate-500">
                Music notes
              </label>
              <input
                id="genreNotes"
                name="genreNotes"
                placeholder="deep house, lounge, no high-energy"
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-900 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="djRateCeiling" className="block text-xs uppercase text-slate-500">
                DJ rate ceiling (THB/h)
              </label>
              <input
                id="djRateCeiling"
                name="djRateCeiling"
                type="number"
                min={0}
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-900 focus:outline-none"
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white"
              >
                Add venue
              </button>
            </div>
          </form>
        )}
      </section>

      {/* Members section */}
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-semibold">Members</h2>
        <ul className="space-y-2">
          {tenant.members.map((m) => (
            <li
              key={m.id}
              className="flex items-center justify-between rounded-md border border-slate-100 px-4 py-2"
            >
              <div>
                <span className="font-medium">{m.displayName ?? m.email}</span>
                <span className="ml-2 text-xs text-slate-400">{m.email}</span>
              </div>
              <span className="text-xs uppercase tracking-wider text-slate-500">
                {m.role.toLowerCase().replace('_', ' ')}
              </span>
            </li>
          ))}
        </ul>
        {isOwner && (
          <p className="mt-4 text-xs text-slate-400">
            Invite flow coming next phase. For now, owners can add members via
            direct DB seed.
          </p>
        )}
      </section>
    </div>
  );
}

/**
 * Venue Agent — DJ roster view.
 *
 * Lists the tenant's AgentArtist roster. Add / activate / deactivate via
 * a small inline form. Edits go through the existing server actions.
 *
 * Started 2026-04-29 day 2.
 */

import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { prismaAgent } from '@/lib/prisma-agent';
import { addArtist, updateArtist } from '@/lib/agent/artists';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string }>;
};

async function handleAddArtist(formData: FormData) {
  'use server';
  const stageName = String(formData.get('stageName') ?? '').trim();
  const realName = String(formData.get('realName') ?? '').trim() || undefined;
  const genres = String(formData.get('genres') ?? '')
    .split(',')
    .map((g) => g.trim())
    .filter(Boolean);
  const hourlyRateStr = String(formData.get('hourlyRate') ?? '').trim();
  const hourlyRate = hourlyRateStr ? parseInt(hourlyRateStr, 10) : undefined;
  const lineGroupId = String(formData.get('lineGroupId') ?? '').trim() || undefined;
  const slug = String(formData.get('slug') ?? '');

  const result = await addArtist({
    stageName,
    realName,
    genres,
    hourlyRate,
    lineGroupId,
  });

  if (!result.ok) {
    redirect(`/agent/${slug}/roster?error=${encodeURIComponent(result.error)}`);
  }
  redirect(`/agent/${slug}/roster`);
}

async function handleToggleActive(formData: FormData) {
  'use server';
  const artistId = String(formData.get('artistId') ?? '');
  const setActive = String(formData.get('setActive') ?? '') === 'true';
  const slug = String(formData.get('slug') ?? '');
  await updateArtist(artistId, { active: setActive });
  redirect(`/agent/${slug}/roster`);
}

export default async function RosterPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { error } = await searchParams;
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const tenant = await prismaAgent.agentTenant.findUnique({
    where: { slug },
    include: { members: { where: { clerkUserId: userId } } },
  });
  if (!tenant || tenant.members.length === 0) notFound();

  const artists = await prismaAgent.agentArtist.findMany({
    where: { tenantId: tenant.id },
    orderBy: [{ active: 'desc' }, { stageName: 'asc' }],
  });

  return (
    <div className="space-y-8">
      <div>
        <Link
          href={`/agent/${slug}/dashboard`}
          className="text-sm text-slate-500 underline"
        >
          ← Back to dashboard
        </Link>
      </div>

      <div>
        <h2 className="text-lg font-semibold">DJ roster</h2>
        <p className="text-sm text-slate-500">
          {artists.length} artist{artists.length === 1 ? '' : 's'} ·{' '}
          {artists.filter((a) => a.active).length} active
        </p>
      </div>

      {error && (
        <div className="rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-medium uppercase tracking-wide text-slate-500">
          Add an artist
        </h3>
        <form action={handleAddArtist} className="grid gap-4 md:grid-cols-2">
          <input type="hidden" name="slug" value={slug} />
          <div>
            <label htmlFor="stageName" className="block text-xs font-medium text-slate-600">
              Stage name *
            </label>
            <input
              id="stageName"
              name="stageName"
              required
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-900 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="realName" className="block text-xs font-medium text-slate-600">
              Real name
            </label>
            <input
              id="realName"
              name="realName"
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-900 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="genres" className="block text-xs font-medium text-slate-600">
              Genres (comma-separated)
            </label>
            <input
              id="genres"
              name="genres"
              placeholder="deep house, lounge"
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-900 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="hourlyRate" className="block text-xs font-medium text-slate-600">
              Hourly rate (THB)
            </label>
            <input
              id="hourlyRate"
              name="hourlyRate"
              type="number"
              min={0}
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-900 focus:outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="lineGroupId" className="block text-xs font-medium text-slate-600">
              LINE 1:1 group ID (optional)
            </label>
            <input
              id="lineGroupId"
              name="lineGroupId"
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-900 focus:outline-none"
            />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white"
            >
              Add to roster
            </button>
          </div>
        </form>
      </section>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 text-left">Stage name</th>
              <th className="px-4 py-3 text-left">Genres</th>
              <th className="px-4 py-3 text-left">Rate</th>
              <th className="px-4 py-3 text-left">LINE</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {artists.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                  No artists yet. Add one above to get started.
                </td>
              </tr>
            ) : (
              artists.map((a) => (
                <tr key={a.id} className={a.active ? '' : 'opacity-50'}>
                  <td className="px-4 py-3 font-medium text-slate-700">
                    {a.stageName}
                    {a.realName && (
                      <span className="ml-2 text-xs text-slate-400">{a.realName}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">
                    {a.genres.join(', ') || '—'}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {a.hourlyRate ? `฿${a.hourlyRate}/h` : '—'}
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs font-mono">
                    {a.lineGroupId ? a.lineGroupId.slice(0, 12) + '…' : '—'}
                  </td>
                  <td className="px-4 py-3 text-xs uppercase tracking-wider text-slate-500">
                    {a.active ? 'Active' : 'Inactive'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <form action={handleToggleActive}>
                      <input type="hidden" name="slug" value={slug} />
                      <input type="hidden" name="artistId" value={a.id} />
                      <input
                        type="hidden"
                        name="setActive"
                        value={a.active ? 'false' : 'true'}
                      />
                      <button
                        type="submit"
                        className="text-xs underline text-slate-500 hover:text-slate-900"
                      >
                        {a.active ? 'Deactivate' : 'Reactivate'}
                      </button>
                    </form>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

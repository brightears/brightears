/**
 * Venue Agent — schedule grid view.
 *
 * Lists upcoming slots for one venue (or the first if many). 30-day window.
 * Phase 1: read-only table. Edit + interactive grid in Phase 2.
 *
 * Started 2026-04-29 day 2.
 */

import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { AgentSlotStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ venue?: string }>;
};

function fmt(date: Date): string {
  return date.toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' });
}

function statusColor(status: AgentSlotStatus, hasArtist: boolean, hasEvent: boolean) {
  if (hasEvent) return 'text-slate-500 italic';
  if (!hasArtist) return 'text-rose-600 font-medium';
  if (status === AgentSlotStatus.CONFIRMED) return 'text-emerald-700';
  return 'text-slate-700';
}

export default async function SchedulePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { venue: venueParam } = await searchParams;

  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const tenant = await prisma.agentTenant.findUnique({
    where: { slug },
    include: { members: { where: { clerkUserId: userId } } },
  });
  if (!tenant || tenant.members.length === 0) notFound();
  const member = tenant.members[0];

  const venues = await prisma.agentVenue.findMany({
    where: {
      tenantId: tenant.id,
      ...(member.venueScope.length > 0 ? { id: { in: member.venueScope } } : {}),
    },
    orderBy: { name: 'asc' },
  });
  if (venues.length === 0) {
    return (
      <div className="space-y-4">
        <Link
          href={`/agent/${slug}/dashboard`}
          className="text-sm text-slate-500 underline"
        >
          ← Back to dashboard
        </Link>
        <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">
          <h2 className="mb-2 font-semibold">No venues yet</h2>
          <p className="mb-4 text-sm text-slate-500">
            Add your first venue to start managing the schedule.
          </p>
          <Link
            href={`/agent/${slug}/settings`}
            className="inline-block rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white"
          >
            Go to settings
          </Link>
        </div>
      </div>
    );
  }

  const activeVenue =
    venues.find((v) => v.id === venueParam) ?? venues[0];

  const today = new Date();
  const bkkOffsetMs = 7 * 60 * 60 * 1000;
  const bkkToday = new Date(today.getTime() + bkkOffsetMs);
  const startUtc = new Date(
    Date.UTC(bkkToday.getUTCFullYear(), bkkToday.getUTCMonth(), bkkToday.getUTCDate()),
  );
  const endUtc = new Date(startUtc);
  endUtc.setUTCDate(endUtc.getUTCDate() + 30);

  const slots = await prisma.agentScheduleSlot.findMany({
    where: {
      venueId: activeVenue.id,
      date: { gte: startUtc, lte: endUtc },
    },
    include: { artist: true },
    orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href={`/agent/${slug}/dashboard`}
          className="text-sm text-slate-500 underline"
        >
          ← Back to dashboard
        </Link>
        {venues.length > 1 && (
          <div className="flex gap-2 text-sm">
            {venues.map((v) => (
              <Link
                key={v.id}
                href={`/agent/${slug}/schedule?venue=${v.id}`}
                className={`rounded-md px-3 py-1 ${
                  v.id === activeVenue.id
                    ? 'bg-slate-900 text-white'
                    : 'border border-slate-300 text-slate-700'
                }`}
              >
                {v.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold">{activeVenue.name} — schedule</h2>
        <p className="text-sm text-slate-500">
          Next 30 days · {slots.length} slot{slots.length === 1 ? '' : 's'} ·{' '}
          {activeVenue.timezone}
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Slot</th>
              <th className="px-4 py-3 text-left">Time</th>
              <th className="px-4 py-3 text-left">DJ / Event</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {slots.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-12 text-center text-slate-400"
                >
                  No slots scheduled in the next 30 days.
                </td>
              </tr>
            ) : (
              slots.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-700">{fmt(s.date)}</td>
                  <td className="px-4 py-3 text-slate-500">{s.slot ?? '—'}</td>
                  <td className="px-4 py-3 text-slate-500">
                    {s.startTime}–{s.endTime}
                  </td>
                  <td
                    className={`px-4 py-3 ${statusColor(
                      s.status,
                      Boolean(s.artistId),
                      Boolean(s.specialEvent),
                    )}`}
                  >
                    {s.specialEvent
                      ? s.specialEvent
                      : s.artist?.stageName ?? 'Uncovered'}
                  </td>
                  <td className="px-4 py-3 text-xs uppercase tracking-wider text-slate-500">
                    {s.status.toLowerCase().replace('_', ' ')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-slate-400">
        Phase 1 view — read-only. Inline edit + bulk-from-defaults coming next.
      </p>
    </div>
  );
}

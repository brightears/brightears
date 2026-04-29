/**
 * Venue Agent — per-tenant dashboard.
 *
 * Tonight's slots, this week's slots, outstanding items per venue.
 * Server-rendered. Future: client-side schedule grid editor.
 *
 * Started 2026-04-29.
 */

import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { AgentSlotStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ slug: string }> };

function formatBangkokDate(date: Date): string {
  return date.toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' });
}

function tonightInBangkok(): Date {
  const now = new Date();
  const bkkOffsetMs = 7 * 60 * 60 * 1000;
  const bkkNow = new Date(now.getTime() + bkkOffsetMs);
  return new Date(
    Date.UTC(bkkNow.getUTCFullYear(), bkkNow.getUTCMonth(), bkkNow.getUTCDate(), 0, 0, 0),
  );
}

export default async function TenantDashboardPage({ params }: Props) {
  const { slug } = await params;
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const tenant = await prisma.agentTenant.findUnique({
    where: { slug },
    include: { members: { where: { clerkUserId: userId } } },
  });
  if (!tenant) notFound();
  if (tenant.members.length === 0) notFound();

  const member = tenant.members[0];
  const tonight = tonightInBangkok();
  const weekEnd = new Date(tonight);
  weekEnd.setUTCDate(weekEnd.getUTCDate() + 7);

  const venueWhere = {
    tenantId: tenant.id,
    ...(member.venueScope.length > 0 ? { id: { in: member.venueScope } } : {}),
  };

  const venues = await prisma.agentVenue.findMany({
    where: venueWhere,
    include: {
      scheduleSlots: {
        where: { date: { gte: tonight, lte: weekEnd } },
        include: { artist: true },
        orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
      },
    },
    orderBy: { name: 'asc' },
  });

  const tonightSlots = venues.flatMap((v) =>
    v.scheduleSlots
      .filter((s) => formatBangkokDate(s.date) === formatBangkokDate(tonight))
      .map((s) => ({ venue: v, slot: s })),
  );

  const uncoveredCount = venues.reduce(
    (n, v) =>
      n +
      v.scheduleSlots.filter(
        (s) => s.status === AgentSlotStatus.PLANNED && !s.specialEvent && !s.artistId,
      ).length,
    0,
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">{tenant.name}</h2>
          <p className="text-sm text-slate-500">
            Logged in as {member.role.toLowerCase().replace('_', ' ')} ·{' '}
            {tenant.tier.toLowerCase()} tier · {tenant.status.toLowerCase()}
          </p>
        </div>
        <Link
          href="/agent"
          className="text-sm text-slate-500 underline"
        >
          Switch workspace
        </Link>
      </div>

      <section>
        <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-slate-500">
          Tonight ({formatBangkokDate(tonight)})
        </h3>
        {tonightSlots.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-500">
            No slots scheduled for tonight. Add some on the schedule grid.
          </p>
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2">
            {tonightSlots.map(({ venue, slot }) => (
              <li
                key={slot.id}
                className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="text-sm font-medium">{venue.name}</div>
                <div className="text-xs text-slate-500">
                  {slot.slot ? `${slot.slot} · ` : ''}
                  {slot.startTime}–{slot.endTime}
                </div>
                <div className="mt-2 text-sm">
                  {slot.specialEvent ? (
                    <span className="text-slate-500 italic">{slot.specialEvent}</span>
                  ) : slot.artist ? (
                    <span>{slot.artist.stageName}</span>
                  ) : (
                    <span className="text-rose-600">Uncovered</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-slate-500">
          Next 7 days
        </h3>
        <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm shadow-sm">
          <p>
            <span className="font-medium">{venues.length}</span> venue
            {venues.length === 1 ? '' : 's'} ·{' '}
            <span className="font-medium">
              {venues.reduce((n, v) => n + v.scheduleSlots.length, 0)}
            </span>{' '}
            slots ·{' '}
            <span
              className={
                uncoveredCount > 0 ? 'font-medium text-rose-600' : 'font-medium'
              }
            >
              {uncoveredCount}
            </span>{' '}
            uncovered
          </p>
          {uncoveredCount > 0 && (
            <p className="mt-2 text-xs text-slate-500">
              The agent will start sourcing replacements automatically once you
              flag the slot or 24 hours before showtime, whichever comes first.
            </p>
          )}
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-slate-500">
          Quick actions
        </h3>
        <div className="grid gap-3 sm:grid-cols-3">
          <Link
            href={`/agent/${slug}/schedule`}
            className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:bg-slate-100"
          >
            <div className="font-medium">Schedule grid</div>
            <div className="text-xs text-slate-500">
              Edit upcoming slots, assign DJs, mark special events.
            </div>
          </Link>
          <Link
            href={`/agent/${slug}/roster`}
            className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:bg-slate-100"
          >
            <div className="font-medium">DJ roster</div>
            <div className="text-xs text-slate-500">
              Manage your DJ contacts, rates, LINE channels.
            </div>
          </Link>
          <Link
            href={`/agent/${slug}/settings`}
            className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:bg-slate-100"
          >
            <div className="font-medium">Settings</div>
            <div className="text-xs text-slate-500">
              Venues, autopilot mode, billing, members.
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import {
  CalendarIcon, ClockIcon, CurrencyDollarIcon, MapPinIcon,
  MegaphoneIcon, CheckCircleIcon, XMarkIcon,
} from '@heroicons/react/24/outline';

type Gig = {
  id: string;
  title: string;
  description: string;
  category: string;
  genres: string[];
  date: string;
  startTime: string;
  endTime: string;
  budgetMin: number | null;
  budgetMax: number | null;
  currency: string;
  venue: { id: string; name: string; city: string; venueType: string | null };
  _count: { applications: number };
  myApplication: {
    id: string;
    status: string;
    message: string | null;
    quotedRate: number | null;
  } | null;
};

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
  SHORTLISTED: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  ACCEPTED: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  DECLINED: 'bg-red-500/20 text-red-300 border-red-500/40',
};

export default function DJGigsClient({
  gigs,
  artistCategory,
}: {
  gigs: Gig[];
  artistCategory: string;
}) {
  const router = useRouter();
  const locale = useLocale();
  const [applying, setApplying] = useState<string | null>(null);
  const [openGig, setOpenGig] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, { message: string; quotedRate: string }>>({});

  async function apply(gigId: string) {
    setApplying(gigId);
    try {
      const f = form[gigId] || { message: '', quotedRate: '' };
      const res = await fetch(`/api/gigs/${gigId}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: f.message || undefined,
          quotedRate: f.quotedRate ? Number(f.quotedRate) : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to apply');
        return;
      }
      setOpenGig(null);
      router.refresh();
    } finally {
      setApplying(null);
    }
  }

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB', {
      weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
    });

  const fmtBudget = (g: Gig) => {
    if (!g.budgetMin && !g.budgetMax) return 'Budget: TBD';
    if (g.budgetMin && g.budgetMax) return `${g.currency} ${g.budgetMin.toLocaleString()}–${g.budgetMax.toLocaleString()}`;
    if (g.budgetMin) return `${g.currency} ${g.budgetMin.toLocaleString()}+`;
    return `up to ${g.currency} ${g.budgetMax!.toLocaleString()}`;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-playfair font-bold text-white tracking-tight">Open Gigs</h1>
        <p className="text-stone-400 mt-2">
          Venues looking for {artistCategory.toLowerCase()} talent. Apply to any that fit — venues review applicants and respond directly.
        </p>
      </div>

      {gigs.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-stone-700 rounded-xl">
          <MegaphoneIcon className="w-16 h-16 mx-auto mb-4 text-stone-600" />
          <p className="text-stone-400">No open gigs right now.</p>
          <p className="text-sm text-stone-500 mt-2">
            Check back soon — new gigs are posted by venues across Bangkok regularly.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {gigs.map((gig) => {
            const isOpen = openGig === gig.id;
            const formState = form[gig.id] || { message: '', quotedRate: '' };
            return (
              <div
                key={gig.id}
                className="bg-stone-900/60 backdrop-blur border border-stone-700 rounded-xl p-6 hover:border-cyan-500/40 transition"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-white">{gig.title}</h3>
                    <p className="text-sm text-stone-400">{gig.venue.name} · {gig.venue.city}{gig.venue.venueType ? ` · ${gig.venue.venueType}` : ''}</p>
                  </div>
                  {gig.myApplication && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${STATUS_STYLES[gig.myApplication.status] || STATUS_STYLES.PENDING}`}>
                      You: {gig.myApplication.status}
                    </span>
                  )}
                </div>

                <p className="text-stone-300 text-sm mb-4 whitespace-pre-wrap">{gig.description}</p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-stone-300 mb-4">
                  <span className="flex items-center gap-1.5">
                    <CalendarIcon className="w-4 h-4" /> {fmtDate(gig.date)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <ClockIcon className="w-4 h-4" /> {gig.startTime}–{gig.endTime}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CurrencyDollarIcon className="w-4 h-4" /> {fmtBudget(gig)}
                  </span>
                  <span className="text-stone-500">{gig._count.applications} applicant{gig._count.applications !== 1 ? 's' : ''}</span>
                </div>

                {gig.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {gig.genres.map((g) => (
                      <span key={g} className="px-2 py-0.5 bg-stone-800 text-stone-300 text-xs rounded">
                        {g}
                      </span>
                    ))}
                  </div>
                )}

                {gig.myApplication ? (
                  <div className="p-3 bg-stone-800/50 rounded border-l-2 border-cyan-500/40 text-sm text-stone-300">
                    <CheckCircleIcon className="inline w-4 h-4 mr-1 text-cyan-300" />
                    You applied on this gig. Venue will review your application.
                    {gig.myApplication.quotedRate && (
                      <div className="mt-1 text-xs text-stone-400">Your quote: {gig.currency} {gig.myApplication.quotedRate.toLocaleString()}</div>
                    )}
                  </div>
                ) : isOpen ? (
                  <div className="space-y-3 border-t border-stone-700 pt-4">
                    <textarea
                      placeholder="Cover note (optional) — tell the venue why you're a great fit"
                      rows={3}
                      maxLength={1000}
                      value={formState.message}
                      onChange={(e) =>
                        setForm({ ...form, [gig.id]: { ...formState, message: e.target.value } })
                      }
                      className="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded text-white text-sm placeholder-stone-500"
                    />
                    <input
                      type="number"
                      min="0"
                      step="500"
                      placeholder="Your quoted rate (THB, optional)"
                      value={formState.quotedRate}
                      onChange={(e) =>
                        setForm({ ...form, [gig.id]: { ...formState, quotedRate: e.target.value } })
                      }
                      className="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded text-white text-sm placeholder-stone-500"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => apply(gig.id)}
                        disabled={applying === gig.id}
                        className="px-4 py-2 bg-cyan-500 text-stone-900 font-bold rounded hover:brightness-110 transition disabled:opacity-50 text-sm"
                      >
                        {applying === gig.id ? 'Submitting…' : 'Submit Application'}
                      </button>
                      <button
                        onClick={() => setOpenGig(null)}
                        className="px-4 py-2 border border-stone-700 text-stone-300 rounded hover:bg-stone-800 transition text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setOpenGig(gig.id)}
                    className="px-5 py-2 bg-cyan-500 text-stone-900 font-bold rounded-lg hover:brightness-110 transition text-sm"
                  >
                    Apply for this Gig →
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

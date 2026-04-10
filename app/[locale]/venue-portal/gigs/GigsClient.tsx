'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import {
  CalendarIcon, ClockIcon, CurrencyDollarIcon, UserGroupIcon,
  PlusIcon, XMarkIcon, MapPinIcon,
} from '@heroicons/react/24/outline';

type Venue = { id: string; name: string };

type Gig = {
  id: string;
  venueId: string;
  venue: { id: string; name: string };
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
  status: 'OPEN' | 'FILLED' | 'CANCELLED' | 'EXPIRED';
  _count: { applications: number };
};

const CATEGORIES = [
  'DJ', 'BAND', 'SINGER', 'MUSICIAN', 'MC',
  'COMEDIAN', 'MAGICIAN', 'DANCER', 'PHOTOGRAPHER', 'SPEAKER',
];

const STATUS_STYLES: Record<string, string> = {
  OPEN: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
  FILLED: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  CANCELLED: 'bg-red-500/20 text-red-300 border-red-500/40',
  EXPIRED: 'bg-stone-500/20 text-stone-300 border-stone-500/40',
};

export default function GigsClient({
  venues,
  initialGigs,
}: {
  venues: Venue[];
  initialGigs: Gig[];
}) {
  const router = useRouter();
  const locale = useLocale();
  const [gigs, setGigs] = useState<Gig[]>(initialGigs);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({
    venueId: venues[0]?.id || '',
    title: '',
    description: '',
    category: 'DJ',
    genres: '',
    date: '',
    startTime: '21:00',
    endTime: '01:00',
    budgetMin: '',
    budgetMax: '',
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/venue-portal/gigs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          venueId: form.venueId,
          title: form.title,
          description: form.description,
          category: form.category,
          genres: form.genres
            .split(',')
            .map((g) => g.trim().toLowerCase())
            .filter(Boolean),
          date: form.date,
          startTime: form.startTime,
          endTime: form.endTime,
          budgetMin: form.budgetMin ? Number(form.budgetMin) : null,
          budgetMax: form.budgetMax ? Number(form.budgetMax) : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to post gig');
      }
      // Refresh gigs from server
      const listRes = await fetch('/api/venue-portal/gigs');
      const listData = await listRes.json();
      if (listRes.ok) {
        setGigs(
          listData.gigs.map((g: any) => ({
            ...g,
            date: g.date,
            budgetMin: g.budgetMin ? Number(g.budgetMin) : null,
            budgetMax: g.budgetMax ? Number(g.budgetMax) : null,
          }))
        );
      }
      setShowForm(false);
      setForm({
        venueId: venues[0]?.id || '',
        title: '',
        description: '',
        category: 'DJ',
        genres: '',
        date: '',
        startTime: '21:00',
        endTime: '01:00',
        budgetMin: '',
        budgetMax: '',
      });
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
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

  if (venues.length === 0) {
    return (
      <div className="text-center text-stone-300 py-20">
        <p className="text-xl mb-4">No venues linked to your account.</p>
        <p className="text-sm opacity-70">Complete venue onboarding first.</p>
        <Link
          href={`/${locale}/venue-onboarding`}
          className="inline-block mt-6 px-6 py-3 bg-cyan-500 text-stone-900 font-bold rounded-lg hover:brightness-110 transition"
        >
          Finish Venue Setup →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-white tracking-tight">Open Gigs</h1>
          <p className="text-stone-400 mt-2">
            Post a gig and let artists apply. Review applicants and pick the right fit.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-5 py-3 bg-cyan-500 text-stone-900 font-bold rounded-lg hover:brightness-110 transition"
        >
          {showForm ? <><XMarkIcon className="w-5 h-5" /> Cancel</> : <><PlusIcon className="w-5 h-5" /> Post a Gig</>}
        </button>
      </div>

      {/* Post form */}
      {showForm && (
        <form
          onSubmit={submit}
          className="bg-stone-900/60 backdrop-blur border border-stone-700 rounded-xl p-8 space-y-6"
        >
          <h2 className="text-xl font-bold text-white">New Gig</h2>
          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/40 rounded text-red-300 text-sm">
              {error}
            </div>
          )}

          {venues.length > 1 && (
            <div>
              <label className="block text-sm font-bold text-stone-300 mb-2">Venue</label>
              <select
                value={form.venueId}
                onChange={(e) => setForm({ ...form, venueId: e.target.value })}
                className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-lg text-white"
              >
                {venues.map((v) => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-stone-300 mb-2">
              Title <span className="text-stone-500 font-normal">— what are you looking for?</span>
            </label>
            <input
              type="text"
              required
              maxLength={120}
              placeholder="e.g. Friday Deep House Residency Opener"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-lg text-white placeholder-stone-500"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-stone-300 mb-2">
              Description <span className="text-stone-500 font-normal">— crowd, vibe, equipment, expectations</span>
            </label>
            <textarea
              required
              minLength={10}
              maxLength={2000}
              rows={5}
              placeholder="Tell artists what to expect. Crowd age, music direction, whether gear is provided, dress code, any must-knows."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-lg text-white placeholder-stone-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-stone-300 mb-2">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-lg text-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-300 mb-2">
                Genres <span className="text-stone-500 font-normal">(comma-separated)</span>
              </label>
              <input
                type="text"
                placeholder="deep house, tech house, lounge"
                value={form.genres}
                onChange={(e) => setForm({ ...form, genres: e.target.value })}
                className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-lg text-white placeholder-stone-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-stone-300 mb-2">Date</label>
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-300 mb-2">Start time</label>
              <input
                type="time"
                required
                value={form.startTime}
                onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-300 mb-2">End time</label>
              <input
                type="time"
                required
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-lg text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-stone-300 mb-2">
                Budget min <span className="text-stone-500 font-normal">(THB, optional)</span>
              </label>
              <input
                type="number"
                min="0"
                step="500"
                placeholder="3000"
                value={form.budgetMin}
                onChange={(e) => setForm({ ...form, budgetMin: e.target.value })}
                className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-lg text-white placeholder-stone-500"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-300 mb-2">
                Budget max <span className="text-stone-500 font-normal">(THB, optional)</span>
              </label>
              <input
                type="number"
                min="0"
                step="500"
                placeholder="6000"
                value={form.budgetMax}
                onChange={(e) => setForm({ ...form, budgetMax: e.target.value })}
                className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-lg text-white placeholder-stone-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-3 border border-stone-700 text-stone-300 rounded-lg hover:bg-stone-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-cyan-500 text-stone-900 font-bold rounded-lg hover:brightness-110 transition disabled:opacity-50"
            >
              {submitting ? 'Posting…' : 'Post Gig'}
            </button>
          </div>
        </form>
      )}

      {/* Gigs list */}
      {gigs.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-stone-700 rounded-xl">
          <UserGroupIcon className="w-16 h-16 mx-auto mb-4 text-stone-600" />
          <p className="text-stone-400">No gigs posted yet.</p>
          <p className="text-sm text-stone-500 mt-2">Click "Post a Gig" above to advertise your first open slot.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {gigs.map((gig) => (
            <div
              key={gig.id}
              className="bg-stone-900/60 backdrop-blur border border-stone-700 rounded-xl p-6 hover:border-cyan-500/40 transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-white truncate">{gig.title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${STATUS_STYLES[gig.status]}`}>
                      {gig.status}
                    </span>
                  </div>
                  <p className="text-stone-400 text-sm mb-4 line-clamp-2">{gig.description}</p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-stone-300">
                    <span className="flex items-center gap-1.5">
                      <MapPinIcon className="w-4 h-4" /> {gig.venue.name}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CalendarIcon className="w-4 h-4" /> {fmtDate(gig.date)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <ClockIcon className="w-4 h-4" /> {gig.startTime}–{gig.endTime}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CurrencyDollarIcon className="w-4 h-4" /> {fmtBudget(gig)}
                    </span>
                    <span className="flex items-center gap-1.5 text-cyan-300">
                      <UserGroupIcon className="w-4 h-4" /> {gig._count.applications} applicant{gig._count.applications !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {gig.genres.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {gig.genres.map((g) => (
                        <span key={g} className="px-2 py-0.5 bg-stone-800 text-stone-300 text-xs rounded">
                          {g}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <Link
                  href={`/${locale}/venue-portal/gigs/${gig.id}`}
                  className="px-4 py-2 bg-stone-800 border border-stone-700 text-white font-bold text-sm rounded-lg hover:bg-stone-700 transition whitespace-nowrap"
                >
                  View →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

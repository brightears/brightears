'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { ArrowTopRightOnSquareIcon, CheckIcon } from '@heroicons/react/24/outline';

type OperatingHours = { startTime?: string; endTime?: string } | null;

type Venue = {
  id: string;
  name: string;
  venueType: string | null;
  address: string | null;
  city: string;
  contactPerson: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  operatingHours: OperatingHours;
};

const VENUE_TYPES = ['Hotel', 'Restaurant', 'Bar', 'NightClub', 'Lounge', 'Rooftop', 'EventSpace', 'Other'];

export default function VenueProfileClient({ venues }: { venues: Venue[] }) {
  const router = useRouter();
  const locale = useLocale();
  const [activeId, setActiveId] = useState(venues[0]?.id || '');
  const [forms, setForms] = useState<Record<string, Venue>>(
    Object.fromEntries(venues.map((v) => [v.id, v]))
  );
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const activeVenue = forms[activeId];

  if (!activeVenue) {
    return (
      <div className="text-center py-20">
        <p className="text-stone-400">No venues linked to your account yet.</p>
        <Link
          href={`/${locale}/venue-onboarding`}
          className="inline-block mt-6 px-6 py-3 bg-cyan-500 text-stone-900 font-bold rounded-lg hover:brightness-110 transition"
        >
          Complete Venue Setup →
        </Link>
      </div>
    );
  }

  function update<K extends keyof Venue>(key: K, value: Venue[K]) {
    setForms({
      ...forms,
      [activeId]: { ...activeVenue, [key]: value },
    });
    setSavedAt(null);
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/venue-portal/venue?venueId=${activeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: activeVenue.name,
          venueType: activeVenue.venueType || null,
          address: activeVenue.address || null,
          city: activeVenue.city,
          contactPerson: activeVenue.contactPerson || null,
          contactEmail: activeVenue.contactEmail || null,
          contactPhone: activeVenue.contactPhone || null,
          operatingHours: activeVenue.operatingHours,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to save');
        return;
      }
      setSavedAt(Date.now());
      router.refresh();
    } catch (e: any) {
      setError(e.message || 'Unexpected error');
    } finally {
      setSaving(false);
    }
  }

  // Profile completeness computation
  const completeness = (() => {
    const checks = [
      !!activeVenue.name && activeVenue.name.length >= 2,
      !!activeVenue.venueType,
      !!activeVenue.address,
      !!activeVenue.city,
      !!activeVenue.contactPerson,
      !!activeVenue.contactEmail,
      !!activeVenue.contactPhone,
      !!activeVenue.operatingHours?.startTime,
    ];
    const filled = checks.filter(Boolean).length;
    return Math.round((filled / checks.length) * 100);
  })();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-playfair font-bold text-white tracking-tight">Venue Profile</h1>
        <p className="text-stone-400 mt-2">
          Keep your venue info accurate. This is what artists see on your public profile at{' '}
          <Link
            href={`/${locale}/venues/${activeId}`}
            className="text-cyan-300 hover:underline inline-flex items-center gap-1"
          >
            /venues/{activeId.slice(0, 8)}…
            <ArrowTopRightOnSquareIcon className="w-3 h-3" />
          </Link>
        </p>
      </div>

      {/* Venue switcher if multiple */}
      {venues.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {venues.map((v) => (
            <button
              key={v.id}
              onClick={() => setActiveId(v.id)}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition ${
                activeId === v.id
                  ? 'bg-cyan-500 text-stone-900'
                  : 'bg-stone-800 border border-stone-700 text-stone-300 hover:bg-stone-700'
              }`}
            >
              {forms[v.id]?.name || v.name}
            </button>
          ))}
        </div>
      )}

      {/* Completeness meter */}
      <div className="bg-stone-900/60 backdrop-blur border border-stone-700 rounded-xl p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-stone-400">Profile completeness</span>
          <span className={`text-sm font-bold ${
            completeness >= 80 ? 'text-emerald-300' : completeness >= 50 ? 'text-amber-300' : 'text-red-300'
          }`}>
            {completeness}%
          </span>
        </div>
        <div className="h-2 bg-stone-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${
              completeness >= 80 ? 'bg-emerald-500' : completeness >= 50 ? 'bg-amber-500' : 'bg-red-500'
            }`}
            style={{ width: `${completeness}%` }}
          />
        </div>
        {completeness < 100 && (
          <p className="text-xs text-stone-500 mt-2">
            Fill out all fields below to show up more prominently in the artist directory and
            search. Complete profiles get 2-3× more artist interest.
          </p>
        )}
      </div>

      {/* Edit form */}
      <div className="bg-stone-900/60 backdrop-blur border border-stone-700 rounded-xl p-6 space-y-5">
        {error && (
          <div className="p-3 bg-red-500/20 border border-red-500/40 rounded text-red-300 text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-bold text-stone-300 mb-2">Venue name</label>
          <input
            type="text"
            required
            maxLength={120}
            value={activeVenue.name}
            onChange={(e) => update('name', e.target.value)}
            className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-lg text-white"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-bold text-stone-300 mb-2">Venue type</label>
            <select
              value={activeVenue.venueType || ''}
              onChange={(e) => update('venueType', e.target.value || null)}
              className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-lg text-white"
            >
              <option value="">— Select —</option>
              {VENUE_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-stone-300 mb-2">City</label>
            <input
              type="text"
              value={activeVenue.city}
              onChange={(e) => update('city', e.target.value)}
              className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-lg text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-stone-300 mb-2">Address</label>
          <input
            type="text"
            placeholder="Street, district, postal code"
            value={activeVenue.address || ''}
            onChange={(e) => update('address', e.target.value || null)}
            className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-lg text-white placeholder-stone-500"
          />
        </div>

        <div className="pt-4 border-t border-stone-800">
          <h3 className="text-sm font-bold text-stone-200 uppercase tracking-widest mb-4">
            Contact Person
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-stone-300 mb-2">Name</label>
              <input
                type="text"
                placeholder="Who handles entertainment bookings?"
                value={activeVenue.contactPerson || ''}
                onChange={(e) => update('contactPerson', e.target.value || null)}
                className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-lg text-white placeholder-stone-500"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-300 mb-2">Phone</label>
              <input
                type="tel"
                placeholder="+66 2 123 4567"
                value={activeVenue.contactPhone || ''}
                onChange={(e) => update('contactPhone', e.target.value || null)}
                className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-lg text-white placeholder-stone-500"
              />
            </div>
          </div>
          <div className="mt-5">
            <label className="block text-sm font-bold text-stone-300 mb-2">Email</label>
            <input
              type="email"
              placeholder="manager@venue.com"
              value={activeVenue.contactEmail || ''}
              onChange={(e) => update('contactEmail', e.target.value || null)}
              className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-lg text-white placeholder-stone-500"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-stone-800">
          <h3 className="text-sm font-bold text-stone-200 uppercase tracking-widest mb-4">
            Operating Hours
          </h3>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-stone-300 mb-2">Opens</label>
              <input
                type="time"
                value={activeVenue.operatingHours?.startTime || ''}
                onChange={(e) =>
                  update('operatingHours', {
                    ...activeVenue.operatingHours,
                    startTime: e.target.value,
                  })
                }
                className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-300 mb-2">Closes</label>
              <input
                type="time"
                value={activeVenue.operatingHours?.endTime || ''}
                onChange={(e) =>
                  update('operatingHours', {
                    ...activeVenue.operatingHours,
                    endTime: e.target.value,
                  })
                }
                className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-lg text-white"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-stone-800">
          {savedAt && (
            <span className="text-sm text-emerald-300 flex items-center gap-1">
              <CheckIcon className="w-4 h-4" /> Saved
            </span>
          )}
          <button
            onClick={save}
            disabled={saving}
            className="ml-auto px-6 py-3 bg-cyan-500 text-stone-900 font-bold rounded-lg hover:brightness-110 transition disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

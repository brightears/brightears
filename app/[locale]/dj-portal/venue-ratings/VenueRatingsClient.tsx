'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';

type Venue = {
  id: string;
  name: string;
  city: string;
  myRating: {
    paidOnTime: number;
    soundQuality: number;
    crowdTreatment: number;
    wouldReturn: number;
    notes: string | null;
  } | null;
};

const DIMENSIONS: Array<{
  key: 'paidOnTime' | 'soundQuality' | 'crowdTreatment' | 'wouldReturn';
  label: string;
  description: string;
}> = [
  { key: 'paidOnTime', label: 'Paid on time', description: '1 = always late · 5 = always on time' },
  { key: 'soundQuality', label: 'Sound quality', description: '1 = poor gear · 5 = excellent setup' },
  { key: 'crowdTreatment', label: 'Crowd treatment', description: '1 = hostile · 5 = respectful' },
  { key: 'wouldReturn', label: 'Would return', description: '1 = never · 5 = absolutely' },
];

function StarRow({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= value;
        const Star = filled ? StarSolid : StarOutline;
        return (
          <button
            key={n}
            type="button"
            disabled={disabled}
            onClick={() => onChange(n)}
            className={`transition ${filled ? 'text-amber-400' : 'text-stone-600'} hover:scale-110 disabled:cursor-not-allowed`}
          >
            <Star className="w-7 h-7" />
          </button>
        );
      })}
    </div>
  );
}

export default function VenueRatingsClient({ venues }: { venues: Venue[] }) {
  const router = useRouter();
  const [openId, setOpenId] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState<string | null>(null);

  const getForm = (venueId: string) => {
    return (
      form[venueId] ||
      venues.find((v) => v.id === venueId)?.myRating || {
        paidOnTime: 5,
        soundQuality: 5,
        crowdTreatment: 5,
        wouldReturn: 5,
        notes: '',
      }
    );
  };

  async function submit(venueId: string) {
    setSaving(venueId);
    try {
      const f = getForm(venueId);
      const res = await fetch('/api/dj-portal/venue-ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          venueId,
          paidOnTime: Number(f.paidOnTime),
          soundQuality: Number(f.soundQuality),
          crowdTreatment: Number(f.crowdTreatment),
          wouldReturn: Number(f.wouldReturn),
          notes: f.notes || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to save');
        return;
      }
      setOpenId(null);
      router.refresh();
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-playfair font-bold text-white tracking-tight">Rate Venues</h1>
        <p className="text-stone-400 mt-2">
          Share your experience at venues you&apos;ve played. Ratings are{' '}
          <strong className="text-cyan-300">private and visible only to other artists</strong> —
          venues cannot see what you rated them. This helps the community avoid problem bookings.
        </p>
      </div>

      {venues.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-stone-700 rounded-xl">
          <p className="text-stone-400">No completed gigs yet.</p>
          <p className="text-sm text-stone-500 mt-2">
            You can rate a venue after you&apos;ve played at least one gig there.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {venues.map((venue) => {
            const isOpen = openId === venue.id;
            const f = getForm(venue.id);
            const hasRating = !!venue.myRating;
            return (
              <div
                key={venue.id}
                className="bg-stone-900/60 backdrop-blur border border-stone-700 rounded-xl p-6"
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-white">{venue.name}</h3>
                    <p className="text-sm text-stone-400">{venue.city}</p>
                  </div>
                  <button
                    onClick={() => setOpenId(isOpen ? null : venue.id)}
                    className="px-4 py-2 text-sm font-bold bg-stone-800 border border-stone-700 text-white rounded-lg hover:bg-stone-700 transition"
                  >
                    {hasRating ? 'Update rating' : 'Rate this venue'}
                  </button>
                </div>

                {hasRating && !isOpen && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-stone-800">
                    {DIMENSIONS.map((d) => (
                      <div key={d.key}>
                        <p className="text-[10px] uppercase tracking-wider text-stone-500">{d.label}</p>
                        <p className="text-lg font-bold text-amber-400 mt-1">
                          {venue.myRating![d.key]}/5
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {isOpen && (
                  <div className="mt-4 pt-4 border-t border-stone-800 space-y-4">
                    {DIMENSIONS.map((d) => (
                      <div key={d.key}>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-sm font-bold text-white">{d.label}</label>
                          <span className="text-xs text-stone-500">{d.description}</span>
                        </div>
                        <StarRow
                          value={f[d.key]}
                          onChange={(v) =>
                            setForm({ ...form, [venue.id]: { ...f, [d.key]: v } })
                          }
                          disabled={saving === venue.id}
                        />
                      </div>
                    ))}
                    <div>
                      <label className="block text-sm font-bold text-white mb-1">
                        Notes <span className="text-stone-500 font-normal">(private, optional)</span>
                      </label>
                      <textarea
                        rows={3}
                        maxLength={1000}
                        placeholder="Anything future artists should know — gear quirks, how they handle pay, crowd vibe, etc."
                        value={f.notes || ''}
                        onChange={(e) =>
                          setForm({ ...form, [venue.id]: { ...f, notes: e.target.value } })
                        }
                        className="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded text-white text-sm placeholder-stone-500"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => submit(venue.id)}
                        disabled={saving === venue.id}
                        className="px-4 py-2 bg-cyan-500 text-stone-900 font-bold rounded hover:brightness-110 transition disabled:opacity-50 text-sm"
                      >
                        {saving === venue.id ? 'Saving…' : 'Save Rating'}
                      </button>
                      <button
                        onClick={() => setOpenId(null)}
                        className="px-4 py-2 border border-stone-700 text-stone-300 rounded hover:bg-stone-800 transition text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

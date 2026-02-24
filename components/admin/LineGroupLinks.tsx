'use client';

import { useState, useEffect } from 'react';

type Venue = {
  id: string;
  name: string;
  lineGroupId: string | null;
};

export default function LineGroupLinks() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    fetchVenues();
  }, []);

  async function fetchVenues() {
    try {
      const res = await fetch('/api/admin/line/link-group');
      const data = await res.json();
      setVenues(data.venues || []);
      // Initialize edit values from current data
      const values: Record<string, string> = {};
      for (const v of data.venues || []) {
        values[v.id] = v.lineGroupId || '';
      }
      setEditValues(values);
    } catch {
      setMessage({ type: 'error', text: 'Failed to load venues' });
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(venueId: string) {
    const lineGroupId = editValues[venueId]?.trim();
    if (!lineGroupId) return;

    setSaving(venueId);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/line/link-group', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ venueId, lineGroupId }),
      });
      const data = await res.json();
      if (data.error) {
        setMessage({ type: 'error', text: data.error });
      } else {
        setMessage({ type: 'success', text: `Linked ${data.venue} to group` });
        // Update local state
        setVenues((prev) =>
          prev.map((v) => (v.id === venueId ? { ...v, lineGroupId } : v)),
        );
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error' });
    } finally {
      setSaving(null);
    }
  }

  async function handleClear(venueId: string) {
    setSaving(venueId);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/line/link-group', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ venueId, lineGroupId: '' }),
      });
      const data = await res.json();
      if (data.error) {
        setMessage({ type: 'error', text: data.error });
      } else {
        setMessage({ type: 'success', text: `Unlinked ${data.venue}` });
        setVenues((prev) =>
          prev.map((v) => (v.id === venueId ? { ...v, lineGroupId: null } : v)),
        );
        setEditValues((prev) => ({ ...prev, [venueId]: '' }));
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error' });
    } finally {
      setSaving(null);
    }
  }

  const linkedCount = venues.filter((v) => v.lineGroupId).length;

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">LINE Group Links</h2>
          <p className="text-gray-400 text-sm mt-1">
            {linkedCount}/{venues.length} venues linked
          </p>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-sm hover:bg-white/20 transition-colors"
        >
          {expanded ? 'Collapse' : 'Manage'}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 space-y-3">
          <p className="text-xs text-gray-500">
            Add the Bright Ears bot to a LINE group. It will reply with the Group ID. Paste it below.
          </p>

          {loading ? (
            <div className="text-gray-400 text-sm">Loading venues...</div>
          ) : (
            venues.map((venue) => {
              const isLinked = !!venue.lineGroupId;
              const hasChanged = editValues[venue.id] !== (venue.lineGroupId || '');

              return (
                <div
                  key={venue.id}
                  className="flex flex-wrap items-center gap-2"
                >
                  <div className="w-36 shrink-0">
                    <span className="text-sm text-white">{venue.name}</span>
                    {isLinked && (
                      <span className="ml-2 inline-block w-2 h-2 rounded-full bg-brand-cyan" title="Linked" />
                    )}
                  </div>
                  <input
                    type="text"
                    value={editValues[venue.id] || ''}
                    onChange={(e) =>
                      setEditValues((prev) => ({
                        ...prev,
                        [venue.id]: e.target.value,
                      }))
                    }
                    placeholder="Paste LINE Group ID (C...)"
                    className="flex-1 min-w-[200px] px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 text-sm font-mono focus:outline-none focus:border-brand-cyan"
                  />
                  <button
                    onClick={() => handleSave(venue.id)}
                    disabled={!editValues[venue.id]?.trim() || saving === venue.id || !hasChanged}
                    className="px-3 py-1.5 rounded-lg bg-brand-cyan text-white text-sm font-medium hover:bg-brand-cyan/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving === venue.id ? 'Saving...' : 'Save'}
                  </button>
                  {isLinked && (
                    <button
                      onClick={() => handleClear(venue.id)}
                      disabled={saving === venue.id}
                      className="px-2 py-1.5 rounded-lg text-gray-400 text-sm hover:text-red-400 hover:bg-white/10 transition-colors disabled:opacity-50"
                      title="Unlink"
                    >
                      &times;
                    </button>
                  )}
                </div>
              );
            })
          )}

          {message && (
            <div className={`text-sm ${message.type === 'error' ? 'text-red-400' : 'text-brand-cyan'}`}>
              {message.text}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

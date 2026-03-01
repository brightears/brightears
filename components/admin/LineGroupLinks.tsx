'use client';

import { useState, useEffect } from 'react';

type Venue = {
  id: string;
  name: string;
  lineGroupId: string | null;
  lineManagerGroupId: string | null;
};

type GroupType = 'dj' | 'manager';

export default function LineGroupLinks() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [djValues, setDjValues] = useState<Record<string, string>>({});
  const [mgrValues, setMgrValues] = useState<Record<string, string>>({});
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
      const dj: Record<string, string> = {};
      const mgr: Record<string, string> = {};
      for (const v of data.venues || []) {
        dj[v.id] = v.lineGroupId || '';
        mgr[v.id] = v.lineManagerGroupId || '';
      }
      setDjValues(dj);
      setMgrValues(mgr);
    } catch {
      setMessage({ type: 'error', text: 'Failed to load venues' });
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(venueId: string, groupType: GroupType) {
    const values = groupType === 'manager' ? mgrValues : djValues;
    const lineGroupId = values[venueId]?.trim();
    if (!lineGroupId) return;

    setSaving(`${venueId}-${groupType}`);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/line/link-group', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ venueId, lineGroupId, groupType }),
      });
      const data = await res.json();
      if (data.error) {
        setMessage({ type: 'error', text: data.error });
      } else {
        const label = groupType === 'manager' ? 'manager group' : 'DJ group';
        setMessage({ type: 'success', text: `Linked ${data.venue} ${label}` });
        const field = groupType === 'manager' ? 'lineManagerGroupId' : 'lineGroupId';
        setVenues((prev) =>
          prev.map((v) => (v.id === venueId ? { ...v, [field]: lineGroupId } : v)),
        );
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error' });
    } finally {
      setSaving(null);
    }
  }

  async function handleClear(venueId: string, groupType: GroupType) {
    setSaving(`${venueId}-${groupType}`);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/line/link-group', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ venueId, lineGroupId: '', groupType }),
      });
      const data = await res.json();
      if (data.error) {
        setMessage({ type: 'error', text: data.error });
      } else {
        const label = groupType === 'manager' ? 'manager group' : 'DJ group';
        setMessage({ type: 'success', text: `Unlinked ${data.venue} ${label}` });
        const field = groupType === 'manager' ? 'lineManagerGroupId' : 'lineGroupId';
        setVenues((prev) =>
          prev.map((v) => (v.id === venueId ? { ...v, [field]: null } : v)),
        );
        const setter = groupType === 'manager' ? setMgrValues : setDjValues;
        setter((prev) => ({ ...prev, [venueId]: '' }));
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error' });
    } finally {
      setSaving(null);
    }
  }

  const djLinked = venues.filter((v) => v.lineGroupId).length;
  const mgrLinked = venues.filter((v) => v.lineManagerGroupId).length;

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">LINE Group Links</h2>
          <p className="text-gray-400 text-sm mt-1">
            {djLinked}/{venues.length} DJ groups &middot; {mgrLinked}/{venues.length} manager groups
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
        <div className="mt-4 space-y-4">
          <div className="text-xs text-gray-500 space-y-1">
            <p>Add the Bright Ears bot to a LINE group. It will reply with the Group ID. Paste it below.</p>
            <p><span className="text-gray-400">DJ Group</span> = schedule reminders &middot; <span className="text-gray-400">Manager Group</span> = feedback cards (no account linking needed)</p>
          </div>

          {loading ? (
            <div className="text-gray-400 text-sm">Loading venues...</div>
          ) : (
            venues.map((venue) => (
              <div key={venue.id} className="space-y-1.5">
                <div className="text-sm text-white font-medium">{venue.name}</div>
                <GroupRow
                  label="DJ Group"
                  venueId={venue.id}
                  currentValue={venue.lineGroupId}
                  editValue={djValues[venue.id] || ''}
                  onEditChange={(val) => setDjValues((prev) => ({ ...prev, [venue.id]: val }))}
                  onSave={() => handleSave(venue.id, 'dj')}
                  onClear={() => handleClear(venue.id, 'dj')}
                  isSaving={saving === `${venue.id}-dj`}
                />
                <GroupRow
                  label="Manager"
                  venueId={venue.id}
                  currentValue={venue.lineManagerGroupId}
                  editValue={mgrValues[venue.id] || ''}
                  onEditChange={(val) => setMgrValues((prev) => ({ ...prev, [venue.id]: val }))}
                  onSave={() => handleSave(venue.id, 'manager')}
                  onClear={() => handleClear(venue.id, 'manager')}
                  isSaving={saving === `${venue.id}-manager`}
                />
              </div>
            ))
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

function GroupRow({
  label,
  venueId,
  currentValue,
  editValue,
  onEditChange,
  onSave,
  onClear,
  isSaving,
}: {
  label: string;
  venueId: string;
  currentValue: string | null;
  editValue: string;
  onEditChange: (val: string) => void;
  onSave: () => void;
  onClear: () => void;
  isSaving: boolean;
}) {
  const isLinked = !!currentValue;
  const hasChanged = editValue !== (currentValue || '');

  return (
    <div className="flex flex-wrap items-center gap-2 pl-3">
      <div className="w-24 shrink-0 whitespace-nowrap">
        <span className="text-xs text-gray-400">{label}</span>
        {isLinked && (
          <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-brand-cyan" title="Linked" />
        )}
      </div>
      <input
        type="text"
        value={editValue}
        onChange={(e) => onEditChange(e.target.value)}
        placeholder="Paste LINE Group ID (C...)"
        className="flex-1 min-w-[180px] px-3 py-1 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 text-xs font-mono focus:outline-none focus:border-brand-cyan"
      />
      <button
        onClick={onSave}
        disabled={!editValue.trim() || isSaving || !hasChanged}
        className="px-2.5 py-1 rounded-lg bg-brand-cyan text-white text-xs font-medium hover:bg-brand-cyan/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSaving ? 'Saving...' : 'Save'}
      </button>
      {isLinked && (
        <button
          onClick={onClear}
          disabled={isSaving}
          className="px-1.5 py-1 rounded-lg text-gray-400 text-xs hover:text-red-400 hover:bg-white/10 transition-colors disabled:opacity-50"
          title="Unlink"
        >
          &times;
        </button>
      )}
    </div>
  );
}

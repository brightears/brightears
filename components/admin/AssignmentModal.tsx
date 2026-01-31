'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import {
  XMarkIcon,
  TrashIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

interface Venue {
  id: string;
  name: string;
  operatingHours: { startTime: string; endTime: string; slots?: string[] } | null;
}

interface Artist {
  id: string;
  stageName: string;
  profileImage: string | null;
  category: string;
}

interface Assignment {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  slot: string | null;
  status: string;
  notes: string | null;
  specialEvent: string | null;
  venue: { id: string; name: string };
  artist: Artist | null;
  feedback: { id: string; overallRating: number } | null;
}

interface DJ {
  id: string;
  stageName: string;
  profileImage: string | null;
  genres: string[];
}

interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  date: Date;
  venue: Venue;
  slot: string | null;
  assignment?: Assignment;
  djs: DJ[];
}

// Convert "24:00" to "00:00" for HTML time input (only accepts 00:00-23:59)
const normalizeTimeForInput = (time: string): string => {
  return time === '24:00' ? '00:00' : time;
};

// Convert "00:00" back to "24:00" for database storage (if end time)
const normalizeTimeForDb = (time: string, isEndTime: boolean): string => {
  // If it's an end time and it's midnight, store as "24:00"
  if (isEndTime && time === '00:00') {
    return '24:00';
  }
  return time;
};

export default function AssignmentModal({
  isOpen,
  onClose,
  onSave,
  date,
  venue,
  slot,
  assignment,
  djs,
}: AssignmentModalProps) {
  // Determine if this is a special event or DJ assignment
  const isSpecialEventMode = assignment ? !!assignment.specialEvent : false;
  const [mode, setMode] = useState<'dj' | 'special'>(isSpecialEventMode ? 'special' : 'dj');
  const [selectedDjId, setSelectedDjId] = useState(assignment?.artist?.id || '');
  const [specialEventLabel, setSpecialEventLabel] = useState(assignment?.specialEvent || 'NO DJ');
  const [startTime, setStartTime] = useState(normalizeTimeForInput(assignment?.startTime || '20:00'));
  const [endTime, setEndTime] = useState(normalizeTimeForInput(assignment?.endTime || '00:00'));
  const [notes, setNotes] = useState(assignment?.notes || '');
  const [repeat, setRepeat] = useState<'none' | 'weekly' | 'biweekly'>('none');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Calculate repeat dates for preview
  const getRepeatDates = (): Date[] => {
    if (repeat === 'none' || assignment) return []; // No repeat for edits

    const dates: Date[] = [];
    const currentDate = new Date(date);
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const dayOfWeek = currentDate.getDay();

    // Start from the selected date and go forward
    let d = new Date(date);
    while (d.getMonth() === currentMonth) {
      // Skip the original date (it's already being created)
      if (d.getTime() !== date.getTime()) {
        dates.push(new Date(d));
      }
      // Increment by 7 or 14 days
      d.setDate(d.getDate() + (repeat === 'weekly' ? 7 : 14));
    }

    return dates;
  };

  const repeatDates = getRepeatDates();

  // Portal needs to render only on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update form when assignment changes
  useEffect(() => {
    if (assignment) {
      // Determine mode based on assignment data
      if (assignment.specialEvent) {
        setMode('special');
        setSpecialEventLabel(assignment.specialEvent);
        setSelectedDjId('');
      } else if (assignment.artist) {
        setMode('dj');
        setSelectedDjId(assignment.artist.id);
        setSpecialEventLabel('NO DJ');
      }
      setStartTime(normalizeTimeForInput(assignment.startTime));
      setEndTime(normalizeTimeForInput(assignment.endTime));
      setNotes(assignment.notes || '');
    } else {
      // Set default times based on venue operating hours
      const hours = venue.operatingHours;
      if (hours) {
        setStartTime(normalizeTimeForInput(hours.startTime || '20:00'));
        setEndTime(normalizeTimeForInput(hours.endTime || '00:00'));
      }
      setMode('dj');
      setSelectedDjId('');
      setSpecialEventLabel('NO DJ');
      setNotes('');
    }
  }, [assignment, venue]);

  if (!isOpen || !mounted) return null;

  const dateStr = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const handleSave = async () => {
    // Validate based on mode
    if (mode === 'dj' && !selectedDjId) {
      setError('Please select a DJ');
      return;
    }
    if (mode === 'special' && !specialEventLabel.trim()) {
      setError('Please enter a label for the special event');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const method = assignment ? 'PATCH' : 'POST';
      // Convert end time back to "24:00" for database if it's midnight
      const dbEndTime = normalizeTimeForDb(endTime, true);

      // For PATCH (editing), just update the single assignment
      if (assignment) {
        const body = {
          id: assignment.id,
          artistId: mode === 'dj' ? selectedDjId : null,
          specialEvent: mode === 'special' ? specialEventLabel.trim() : null,
          startTime,
          endTime: dbEndTime,
          notes: notes || null,
        };

        const res = await fetch('/api/admin/schedule', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to update assignment');
        }

        onSave();
        return;
      }

      // For POST (new), handle repeat mode
      const datesToCreate = [date, ...repeatDates];

      // Create assignments for each date
      let successCount = 0;
      let skipCount = 0;
      const errors: string[] = [];

      for (const d of datesToCreate) {
        const body = {
          venueId: venue.id,
          artistId: mode === 'dj' ? selectedDjId : null,
          specialEvent: mode === 'special' ? specialEventLabel.trim() : null,
          date: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
          startTime,
          endTime: dbEndTime,
          slot,
          notes: notes || null,
        };

        const res = await fetch('/api/admin/schedule', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        if (res.ok) {
          successCount++;
        } else if (res.status === 409) {
          // Conflict - slot already assigned, skip
          skipCount++;
        } else {
          const data = await res.json();
          errors.push(data.error || 'Unknown error');
        }
      }

      if (errors.length > 0) {
        throw new Error(`Created ${successCount}, skipped ${skipCount} (already assigned), ${errors.length} failed`);
      }

      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!assignment) return;
    if (!confirm('Are you sure you want to delete this assignment?')) return;

    setDeleting(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/schedule?id=${assignment.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete assignment');
      }

      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setDeleting(false);
    }
  };

  const selectedDj = djs.find((dj) => dj.id === selectedDjId);

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-hidden rounded-2xl bg-gradient-to-br from-stone-900 to-stone-800 border border-white/10 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div>
            <h3 className="text-lg font-playfair font-bold text-white">
              {assignment ? 'Edit Assignment' : 'New Assignment'}
            </h3>
            <p className="text-sm text-gray-400">
              {venue.name} {slot && `(${slot})`} • {dateStr}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Error message */}
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Mode Toggle */}
          <div className="flex gap-2 p-1 bg-stone-800 rounded-lg">
            <button
              type="button"
              onClick={() => setMode('dj')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                mode === 'dj'
                  ? 'bg-brand-cyan text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Assign DJ
            </button>
            <button
              type="button"
              onClick={() => setMode('special')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                mode === 'special'
                  ? 'bg-gray-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Special Event / No DJ
            </button>
          </div>

          {/* DJ Selection (only in DJ mode) */}
          {mode === 'dj' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select DJ
                </label>
                <select
                  value={selectedDjId}
                  onChange={(e) => setSelectedDjId(e.target.value)}
                  className="w-full bg-stone-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-cyan focus:outline-none"
                >
                  <option value="">Choose a DJ...</option>
                  {djs.map((dj) => (
                    <option key={dj.id} value={dj.id}>
                      {dj.stageName} - {(dj.genres || []).slice(0, 2).join(', ')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Selected DJ Preview */}
              {selectedDj && (
                <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-deep-teal flex-shrink-0">
                    {selectedDj.profileImage ? (
                      <Image
                        src={selectedDj.profileImage}
                        alt={selectedDj.stageName}
                        fill
                        className="object-cover object-top"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-lg font-medium">
                        {selectedDj.stageName.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-white font-medium">{selectedDj.stageName}</div>
                    <div className="text-sm text-gray-400">
                      {(selectedDj.genres || []).slice(0, 3).join(' • ')}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Special Event Label (only in special mode) */}
          {mode === 'special' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Event Label
              </label>
              <input
                type="text"
                value={specialEventLabel}
                onChange={(e) => setSpecialEventLabel(e.target.value)}
                placeholder="e.g., NO DJ, Private Event, Closed"
                className="w-full bg-stone-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-brand-cyan focus:outline-none"
              />
              <p className="mt-1 text-xs text-gray-500">
                Common options: NO DJ, Private Event, Closed, Holiday
              </p>
            </div>
          )}

          {/* Time inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-stone-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-cyan focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                End Time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-stone-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-cyan focus:outline-none"
              />
            </div>
          </div>

          {/* Repeat (only for new assignments) */}
          {!assignment && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Repeat
              </label>
              <select
                value={repeat}
                onChange={(e) => setRepeat(e.target.value as 'none' | 'weekly' | 'biweekly')}
                className="w-full bg-stone-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-cyan focus:outline-none"
              >
                <option value="none">Don't repeat</option>
                <option value="weekly">Every week (same day)</option>
                <option value="biweekly">Every 2 weeks</option>
              </select>

              {/* Preview of repeat dates */}
              {repeatDates.length > 0 && (
                <div className="mt-3 p-3 rounded-lg bg-brand-cyan/10 border border-brand-cyan/30">
                  <p className="text-sm text-brand-cyan font-medium mb-2">
                    Will also create assignments for:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {repeatDates.map((d, i) => (
                      <span
                        key={i}
                        className="text-xs bg-brand-cyan/20 text-brand-cyan px-2 py-1 rounded"
                      >
                        {d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Total: {repeatDates.length + 1} assignments
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Valentine's Day special, Cover for another DJ"
              rows={3}
              className="w-full bg-stone-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-brand-cyan focus:outline-none resize-none"
            />
          </div>

          {/* Existing feedback info */}
          {assignment?.feedback && (
            <div className="p-4 rounded-lg bg-brand-cyan/10 border border-brand-cyan/30">
              <div className="flex items-center gap-2 text-brand-cyan text-sm font-medium mb-1">
                <StarSolidIcon className="w-4 h-4" />
                Feedback Received
              </div>
              <div className="text-white">
                Rating: {assignment.feedback.overallRating}/5
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-stone-900/50">
          {assignment ? (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
            >
              <TrashIcon className="w-4 h-4" />
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-gray-400 hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || (mode === 'dj' && !selectedDjId) || (mode === 'special' && !specialEventLabel.trim())}
              className="px-6 py-2 rounded-lg bg-brand-cyan text-white font-medium hover:bg-brand-cyan/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : assignment ? 'Update' : mode === 'dj' ? 'Assign DJ' : 'Save Event'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

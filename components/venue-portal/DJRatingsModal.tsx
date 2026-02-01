'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import DJFeedbackCard from './DJFeedbackCard';

interface Assignment {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  slot: string | null;
  venue: { id: string; name: string };
  artist: {
    id: string;
    stageName: string;
    profileImage: string | null;
    category: string;
  };
}

interface DJFeedbackData {
  artistId: string;
  overallRating: number;
  notes: string;
}

interface DJRatingsModalProps {
  assignments: Assignment[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function DJRatingsModal({
  assignments,
  onClose,
  onSuccess,
}: DJRatingsModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // DJ feedback state - one entry per assignment
  const [djFeedback, setDjFeedback] = useState<Record<string, DJFeedbackData>>({});

  // Get venue and date from first assignment
  const firstAssignment = assignments[0];
  const venueName = firstAssignment?.venue.name;
  const date = firstAssignment?.date;

  // Initialize DJ feedback state
  useEffect(() => {
    const initial: Record<string, DJFeedbackData> = {};
    assignments.forEach((a) => {
      initial[a.id] = {
        artistId: a.artist.id,
        overallRating: 0,
        notes: '',
      };
    });
    setDjFeedback(initial);
  }, [assignments]);

  const handleDJFeedbackChange = (assignmentId: string, data: DJFeedbackData) => {
    setDjFeedback((prev) => ({
      ...prev,
      [assignmentId]: data,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Submit DJ feedback for each assignment that has a rating
      const promises = assignments.map(async (assignment) => {
        const feedback = djFeedback[assignment.id];
        if (!feedback || feedback.overallRating === 0) return null;

        const response = await fetch('/api/venue-portal/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            assignmentId: assignment.id,
            overallRating: feedback.overallRating,
            notes: feedback.notes || undefined,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(
            error.error || `Failed to save feedback for ${assignment.artist.stageName}`
          );
        }

        return response.json();
      });

      await Promise.all(promises);

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 1000);
    } catch (err) {
      console.error('Error submitting DJ ratings:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit ratings');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if any DJs have been rated
  const someDJsRated = Object.values(djFeedback).some((fb) => fb.overallRating > 0);
  const ratedCount = Object.values(djFeedback).filter((fb) => fb.overallRating > 0).length;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-gradient-to-br from-stone-900 to-stone-800 border border-white/10 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div>
            <h2 className="text-lg font-semibold text-white font-playfair">
              Rate DJs
            </h2>
            <p className="text-sm text-gray-400">
              {venueName} • {date && formatDate(date)}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white
                       disabled:opacity-50"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6">
          {success ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 rounded-full bg-brand-cyan/20 flex items-center justify-center mb-4">
                <CheckIcon className="w-8 h-8 text-brand-cyan" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                Ratings Submitted!
              </h3>
              <p className="text-gray-400 text-center">
                Thank you for rating the DJs.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <p className="text-sm text-gray-400">
                Rate each DJ&apos;s performance below.
              </p>

              <div className="space-y-3">
                {assignments.map((assignment) => (
                  <DJFeedbackCard
                    key={assignment.id}
                    artist={assignment.artist}
                    assignment={assignment}
                    value={djFeedback[assignment.id] || { artistId: assignment.artist.id, overallRating: 0, notes: '' }}
                    onChange={(data) => handleDJFeedbackChange(assignment.id, data)}
                    disabled={isSubmitting}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!success && (
          <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-sm text-gray-400">
              {ratedCount}/{assignments.length} rated
            </span>
            <button
              onClick={handleSubmit}
              disabled={!someDJsRated || isSubmitting}
              className="px-6 py-2 rounded-lg bg-brand-cyan text-white font-medium
                         hover:bg-brand-cyan/90 transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Ratings'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

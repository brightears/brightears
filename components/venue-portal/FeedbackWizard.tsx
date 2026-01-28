'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import NightFeedbackForm from './NightFeedbackForm';
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

interface NightFeedbackData {
  overallNightRating: number;
  peakBusyTime: string;
  peakCrowdLevel: string;
  crowdNationality: string;
  crowdType: string;
  weatherCondition: string;
  specialEvent: string;
  notes: string;
}

interface DJFeedbackData {
  artistId: string;
  overallRating: number;
  musicQuality: number | null;
  crowdEngagement: number | null;
  professionalism: number | null;
  whatWentWell: string;
  areasForImprovement: string;
  wouldRebook: boolean | null;
}

interface FeedbackWizardProps {
  assignments: Assignment[];
  onClose: () => void;
  onSuccess: () => void;
}

type Step = 'night' | 'djs' | 'submitting' | 'success';

export default function FeedbackWizard({
  assignments,
  onClose,
  onSuccess,
}: FeedbackWizardProps) {
  const [step, setStep] = useState<Step>('night');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Night feedback state
  const [nightFeedback, setNightFeedback] = useState<NightFeedbackData | null>(
    null
  );

  // DJ feedback state - one entry per assignment
  const [djFeedback, setDjFeedback] = useState<Record<string, DJFeedbackData>>(
    {}
  );

  // Get unique date and venue from assignments
  const firstAssignment = assignments[0];
  const date = firstAssignment?.date;
  const venue = firstAssignment?.venue;

  // Initialize DJ feedback state
  useEffect(() => {
    const initial: Record<string, DJFeedbackData> = {};
    assignments.forEach((a) => {
      initial[a.id] = {
        artistId: a.artist.id,
        overallRating: 0,
        musicQuality: null,
        crowdEngagement: null,
        professionalism: null,
        whatWentWell: '',
        areasForImprovement: '',
        wouldRebook: null,
      };
    });
    setDjFeedback(initial);
  }, [assignments]);

  const handleNightFeedbackSubmit = (data: NightFeedbackData) => {
    setNightFeedback(data);
    setStep('djs');
  };

  const handleDJFeedbackChange = (
    assignmentId: string,
    data: DJFeedbackData
  ) => {
    setDjFeedback((prev) => ({
      ...prev,
      [assignmentId]: data,
    }));
  };

  const handleSubmitAll = async () => {
    if (!nightFeedback || !venue) return;

    setIsSubmitting(true);
    setError(null);
    setStep('submitting');

    try {
      // 1. Submit night feedback
      const nightResponse = await fetch('/api/venue-portal/night-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          venueId: venue.id,
          date: date,
          ...nightFeedback,
        }),
      });

      if (!nightResponse.ok) {
        const nightError = await nightResponse.json();
        throw new Error(nightError.error || 'Failed to save night feedback');
      }

      // 2. Submit DJ feedback for each assignment
      const djPromises = assignments.map(async (assignment) => {
        const feedback = djFeedback[assignment.id];
        if (!feedback || feedback.overallRating === 0) return null;

        const response = await fetch('/api/venue-portal/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            assignmentId: assignment.id,
            overallRating: feedback.overallRating,
            musicQuality: feedback.musicQuality,
            crowdEngagement: feedback.crowdEngagement,
            professionalism: feedback.professionalism,
            whatWentWell: feedback.whatWentWell || undefined,
            areasForImprovement: feedback.areasForImprovement || undefined,
            wouldRebook: feedback.wouldRebook,
            // Include night context in DJ feedback
            crowdLevel: nightFeedback.peakCrowdLevel || undefined,
            guestMix: nightFeedback.crowdType || 'Mixed',
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

      await Promise.all(djPromises);

      setStep('success');
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit feedback');
      setStep('djs');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if all DJs have been rated
  const allDJsRated = Object.values(djFeedback).every(
    (fb) => fb.overallRating > 0
  );
  const someDJsRated = Object.values(djFeedback).some(
    (fb) => fb.overallRating > 0
  );

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
              Submit Feedback
            </h2>
            <p className="text-sm text-gray-400">
              {venue?.name} • {date && formatDate(date)}
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

        {/* Progress Steps */}
        <div className="flex items-center gap-2 px-6 py-3 bg-white/5 border-b border-white/10">
          <div
            className={`flex items-center gap-2 ${
              step === 'night' ? 'text-brand-cyan' : 'text-gray-400'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                step === 'night'
                  ? 'bg-brand-cyan text-white'
                  : nightFeedback
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white/10'
              }`}
            >
              {nightFeedback ? <CheckIcon className="w-4 h-4" /> : '1'}
            </div>
            <span className="text-sm">Night Overview</span>
          </div>
          <div className="flex-1 h-px bg-white/10" />
          <div
            className={`flex items-center gap-2 ${
              step === 'djs' ? 'text-brand-cyan' : 'text-gray-400'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                step === 'djs'
                  ? 'bg-brand-cyan text-white'
                  : allDJsRated
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white/10'
              }`}
            >
              {allDJsRated ? <CheckIcon className="w-4 h-4" /> : '2'}
            </div>
            <span className="text-sm">DJ Ratings ({assignments.length})</span>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6">
          {step === 'night' && venue && date && (
            <NightFeedbackForm
              venueName={venue.name}
              date={date}
              onSubmit={handleNightFeedbackSubmit}
              onCancel={onClose}
            />
          )}

          {step === 'djs' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-white mb-2">
                  Rate Each DJ
                </h3>
                <p className="text-sm text-gray-400">
                  Rate the performance of each DJ that played tonight. Expand for
                  detailed feedback.
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                {assignments.map((assignment) => (
                  <DJFeedbackCard
                    key={assignment.id}
                    artist={assignment.artist}
                    assignment={assignment}
                    value={djFeedback[assignment.id]}
                    onChange={(data) =>
                      handleDJFeedbackChange(assignment.id, data)
                    }
                    disabled={isSubmitting}
                  />
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setStep('night')}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg text-gray-400 hover:text-white
                             transition-colors disabled:opacity-50"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmitAll}
                  disabled={!someDJsRated || isSubmitting}
                  className="px-6 py-2 rounded-lg bg-brand-cyan text-white font-medium
                             hover:bg-brand-cyan/90 transition-colors
                             disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit All Feedback'}
                </button>
              </div>
            </div>
          )}

          {step === 'submitting' && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-cyan mb-4" />
              <p className="text-white">Saving feedback...</p>
            </div>
          )}

          {step === 'success' && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                <CheckIcon className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                Feedback Submitted!
              </h3>
              <p className="text-gray-400 text-center">
                Thank you for your feedback. It helps us improve our DJ roster.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

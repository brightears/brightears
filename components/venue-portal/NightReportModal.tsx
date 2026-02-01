'use client';

import { useState } from 'react';
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import NightFeedbackForm from './NightFeedbackForm';

interface NightFeedbackData {
  overallNightRating: number;
  peakBusyTime: string;
  peakCrowdLevel: string;
  crowdNationality: string;
  crowdType: string;
  weatherCondition: string;
  notes: string;
}

interface NightReportModalProps {
  venueId: string;
  venueName: string;
  date: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function NightReportModal({
  venueId,
  venueName,
  date,
  onClose,
  onSuccess,
}: NightReportModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (data: NightFeedbackData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/venue-portal/night-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          venueId,
          date,
          ...data,
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to save night report');
      }

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 1000);
    } catch (err) {
      console.error('Error submitting night report:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit night report');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-hidden rounded-2xl bg-gradient-to-br from-stone-900 to-stone-800 border border-white/10 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div>
            <h2 className="text-lg font-semibold text-white font-playfair">
              Night Report
            </h2>
            <p className="text-sm text-gray-400">
              {venueName} • {formatDate(date)}
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
        <div className="overflow-y-auto max-h-[calc(90vh-100px)] p-6">
          {success ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                <CheckIcon className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                Night Report Saved!
              </h3>
              <p className="text-gray-400 text-center">
                Your night report has been saved successfully.
              </p>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                  {error}
                </div>
              )}
              <NightFeedbackForm
                venueName={venueName}
                date={date}
                onSubmit={handleSubmit}
                onCancel={onClose}
                isSubmitting={isSubmitting}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

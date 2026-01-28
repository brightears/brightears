'use client';

import { useState } from 'react';
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import RatingStars from './RatingStars';
import Image from 'next/image';
import { UserGroupIcon } from '@heroicons/react/24/outline';

interface Assignment {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: { name: string };
  artist: {
    stageName: string;
    profileImage: string | null;
    category: string;
  };
}

interface FeedbackFormProps {
  assignment: Assignment;
  onClose: () => void;
  onSuccess: () => void;
}

const CROWD_LEVELS = ['Light', 'Moderate', 'Busy', 'Packed'] as const;
const GUEST_MIX = ['Tourists', 'Locals', 'Business', 'Mixed'] as const;

export default function FeedbackForm({
  assignment,
  onClose,
  onSuccess,
}: FeedbackFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [overallRating, setOverallRating] = useState(0);
  const [musicQuality, setMusicQuality] = useState(0);
  const [crowdEngagement, setCrowdEngagement] = useState(0);
  const [professionalism, setProfessionalism] = useState(0);
  const [whatWentWell, setWhatWentWell] = useState('');
  const [areasForImprovement, setAreasForImprovement] = useState('');
  const [crowdLevel, setCrowdLevel] = useState<string>('');
  const [guestMix, setGuestMix] = useState<string>('');

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (overallRating === 0) {
      setError('Please provide an overall rating');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/venue-portal/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignmentId: assignment.id,
          overallRating,
          musicQuality: musicQuality || undefined,
          crowdEngagement: crowdEngagement || undefined,
          professionalism: professionalism || undefined,
          whatWentWell: whatWentWell || undefined,
          areasForImprovement: areasForImprovement || undefined,
          crowdLevel: crowdLevel || undefined,
          guestMix: guestMix || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit feedback');
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-gradient-to-br from-stone-900 to-stone-800 rounded-2xl border border-white/10 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Submit Feedback</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              aria-label="Close"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Assignment info */}
          <div className="p-4 bg-white/5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-deep-teal flex-shrink-0">
                {assignment.artist.profileImage ? (
                  <Image
                    src={assignment.artist.profileImage}
                    alt={assignment.artist.stageName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <UserGroupIcon className="w-6 h-6" />
                  </div>
                )}
              </div>
              <div>
                <p className="font-medium text-white">
                  {assignment.artist.stageName}
                </p>
                <p className="text-sm text-gray-400">
                  {assignment.venue.name} • {formatDate(assignment.date)} •{' '}
                  {assignment.startTime} - {assignment.endTime}
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Overall Rating (Required) */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Overall Rating <span className="text-red-400">*</span>
              </label>
              <RatingStars
                rating={overallRating}
                onChange={setOverallRating}
                size="lg"
              />
            </div>

            {/* Optional Detailed Ratings */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  Music Quality
                </label>
                <RatingStars
                  rating={musicQuality}
                  onChange={setMusicQuality}
                  size="sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  Crowd Engagement
                </label>
                <RatingStars
                  rating={crowdEngagement}
                  onChange={setCrowdEngagement}
                  size="sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  Professionalism
                </label>
                <RatingStars
                  rating={professionalism}
                  onChange={setProfessionalism}
                  size="sm"
                />
              </div>
            </div>

            {/* Context: Crowd Level */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                How busy was the venue?
              </label>
              <div className="flex flex-wrap gap-2">
                {CROWD_LEVELS.map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setCrowdLevel(level)}
                    className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                      crowdLevel === level
                        ? 'bg-brand-cyan/20 border-brand-cyan/50 text-brand-cyan'
                        : 'border-white/20 text-gray-400 hover:border-white/40'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Context: Guest Mix */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Guest composition
              </label>
              <div className="flex flex-wrap gap-2">
                {GUEST_MIX.map((mix) => (
                  <button
                    key={mix}
                    type="button"
                    onClick={() => setGuestMix(mix)}
                    className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                      guestMix === mix
                        ? 'bg-brand-cyan/20 border-brand-cyan/50 text-brand-cyan'
                        : 'border-white/20 text-gray-400 hover:border-white/40'
                    }`}
                  >
                    {mix}
                  </button>
                ))}
              </div>
            </div>

            {/* Comments */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                What went well?
              </label>
              <textarea
                value={whatWentWell}
                onChange={(e) => setWhatWentWell(e.target.value)}
                placeholder="E.g., Great song selection, perfect energy for the crowd..."
                rows={2}
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-brand-cyan resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Areas for improvement
              </label>
              <textarea
                value={areasForImprovement}
                onChange={(e) => setAreasForImprovement(e.target.value)}
                placeholder="E.g., Could have read the room better during dinner service..."
                rows={2}
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-brand-cyan resize-none"
              />
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || overallRating === 0}
                className="w-full py-3 px-4 rounded-lg bg-brand-cyan text-white font-medium hover:bg-brand-cyan/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckIcon className="w-5 h-5" />
                    Submit Feedback
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

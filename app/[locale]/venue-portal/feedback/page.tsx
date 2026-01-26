'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import {
  ChatBubbleLeftRightIcon,
  ClockIcon,
  CheckCircleIcon,
  UserGroupIcon,
  StarIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import FeedbackForm from '@/components/venue-portal/FeedbackForm';
import RatingStars from '@/components/venue-portal/RatingStars';

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

interface Feedback {
  id: string;
  overallRating: number;
  musicQuality: number | null;
  crowdEngagement: number | null;
  professionalism: number | null;
  whatWentWell: string | null;
  areasForImprovement: string | null;
  wouldRebook: boolean | null;
  crowdLevel: string | null;
  guestMix: string | null;
  createdAt: string;
  venue: { id: string; name: string };
  artist: {
    id: string;
    stageName: string;
    profileImage: string | null;
    category: string;
  };
  assignment: {
    date: string;
    startTime: string;
    endTime: string;
    slot: string | null;
  };
}

type Tab = 'pending' | 'submitted';

export default function FeedbackPage() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<Tab>('pending');
  const [pendingAssignments, setPendingAssignments] = useState<Assignment[]>([]);
  const [submittedFeedback, setSubmittedFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  // Check for assignmentId in URL params
  useEffect(() => {
    const assignmentId = searchParams.get('assignmentId');
    if (assignmentId && pendingAssignments.length > 0) {
      const assignment = pendingAssignments.find((a) => a.id === assignmentId);
      if (assignment) {
        setSelectedAssignment(assignment);
        setShowFeedbackForm(true);
      }
    }
  }, [searchParams, pendingAssignments]);

  // Fetch data based on active tab
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (activeTab === 'pending') {
      params.set('pending', 'true');
    }

    fetch(`/api/venue-portal/feedback?${params}`)
      .then((res) => res.json())
      .then((data) => {
        if (activeTab === 'pending') {
          setPendingAssignments(data.assignments || []);
        } else {
          setSubmittedFeedback(data.feedback || []);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [activeTab]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleFeedbackSuccess = () => {
    setShowFeedbackForm(false);
    setSelectedAssignment(null);
    // Refresh the pending list
    fetch('/api/venue-portal/feedback?pending=true')
      .then((res) => res.json())
      .then((data) => {
        setPendingAssignments(data.assignments || []);
      });
  };

  return (
    <div className="space-y-6 pt-12 lg:pt-0">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white font-playfair flex items-center gap-3">
          <ChatBubbleLeftRightIcon className="w-7 h-7 text-amber-400" />
          Feedback
        </h1>
        <p className="text-gray-400 mt-1">
          Submit and view feedback for DJ performances
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'pending'
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              : 'text-gray-400 hover:bg-white/10 hover:text-white'
          }`}
        >
          <ClockIcon className="w-5 h-5" />
          Pending
          {pendingAssignments.length > 0 && (
            <span className="px-2 py-0.5 bg-amber-500 text-white text-xs rounded-full">
              {pendingAssignments.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('submitted')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'submitted'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'text-gray-400 hover:bg-white/10 hover:text-white'
          }`}
        >
          <CheckCircleIcon className="w-5 h-5" />
          Submitted
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-cyan"></div>
        </div>
      ) : activeTab === 'pending' ? (
        /* Pending Feedback */
        pendingAssignments.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircleIcon className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">All Caught Up!</h3>
            <p className="text-gray-500">
              You&apos;ve submitted feedback for all completed performances
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingAssignments.map((assignment) => (
              <div
                key={assignment.id}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-deep-teal flex-shrink-0">
                      {assignment.artist.profileImage ? (
                        <Image
                          src={assignment.artist.profileImage}
                          alt={assignment.artist.stageName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <UserGroupIcon className="w-7 h-7" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-white truncate">
                        {assignment.artist.stageName}
                      </p>
                      <p className="text-sm text-gray-400">
                        {assignment.venue.name} • {formatDate(assignment.date)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {assignment.startTime} - {assignment.endTime}
                        {assignment.slot && ` (${assignment.slot})`}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedAssignment(assignment);
                      setShowFeedbackForm(true);
                    }}
                    className="px-4 py-2 rounded-lg bg-brand-cyan text-white text-sm font-medium hover:bg-brand-cyan/90 transition-colors whitespace-nowrap"
                  >
                    Give Feedback
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Submitted Feedback */
        submittedFeedback.length === 0 ? (
          <div className="text-center py-12">
            <ChatBubbleLeftRightIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No Feedback Yet</h3>
            <p className="text-gray-500">
              Feedback you submit will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {submittedFeedback.map((feedback) => (
              <div
                key={feedback.id}
                className="p-4 rounded-xl bg-white/5 border border-white/10"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-deep-teal flex-shrink-0">
                      {feedback.artist.profileImage ? (
                        <Image
                          src={feedback.artist.profileImage}
                          alt={feedback.artist.stageName}
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
                        {feedback.artist.stageName}
                      </p>
                      <p className="text-sm text-gray-400">
                        {feedback.venue.name} •{' '}
                        {formatDate(feedback.assignment.date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <RatingStars
                      rating={feedback.overallRating}
                      readonly
                      size="sm"
                    />
                    <span className="text-white font-medium">
                      {feedback.overallRating}/5
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4 text-sm">
                  {feedback.musicQuality && (
                    <div>
                      <span className="text-gray-500">Music Quality</span>
                      <div className="flex items-center gap-1 mt-1">
                        <StarIconSolid className="w-4 h-4 text-amber-400" />
                        <span className="text-white">{feedback.musicQuality}/5</span>
                      </div>
                    </div>
                  )}
                  {feedback.crowdEngagement && (
                    <div>
                      <span className="text-gray-500">Engagement</span>
                      <div className="flex items-center gap-1 mt-1">
                        <StarIconSolid className="w-4 h-4 text-amber-400" />
                        <span className="text-white">{feedback.crowdEngagement}/5</span>
                      </div>
                    </div>
                  )}
                  {feedback.professionalism && (
                    <div>
                      <span className="text-gray-500">Professionalism</span>
                      <div className="flex items-center gap-1 mt-1">
                        <StarIconSolid className="w-4 h-4 text-amber-400" />
                        <span className="text-white">{feedback.professionalism}/5</span>
                      </div>
                    </div>
                  )}
                  {feedback.wouldRebook !== null && (
                    <div>
                      <span className="text-gray-500">Would Rebook</span>
                      <p
                        className={`mt-1 font-medium ${
                          feedback.wouldRebook ? 'text-emerald-400' : 'text-red-400'
                        }`}
                      >
                        {feedback.wouldRebook ? 'Yes' : 'No'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Comments */}
                {(feedback.whatWentWell || feedback.areasForImprovement) && (
                  <div className="pt-4 border-t border-white/10 space-y-3">
                    {feedback.whatWentWell && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">What went well</p>
                        <p className="text-sm text-gray-300">{feedback.whatWentWell}</p>
                      </div>
                    )}
                    {feedback.areasForImprovement && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Areas for improvement</p>
                        <p className="text-sm text-gray-300">{feedback.areasForImprovement}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Context tags */}
                {(feedback.crowdLevel || feedback.guestMix) && (
                  <div className="pt-3 flex flex-wrap gap-2">
                    {feedback.crowdLevel && (
                      <span className="px-2 py-1 bg-white/10 rounded text-xs text-gray-400">
                        {feedback.crowdLevel} crowd
                      </span>
                    )}
                    {feedback.guestMix && (
                      <span className="px-2 py-1 bg-white/10 rounded text-xs text-gray-400">
                        {feedback.guestMix} guests
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      )}

      {/* Feedback Form Modal */}
      {showFeedbackForm && selectedAssignment && (
        <FeedbackForm
          assignment={selectedAssignment}
          onClose={() => {
            setShowFeedbackForm(false);
            setSelectedAssignment(null);
          }}
          onSuccess={handleFeedbackSuccess}
        />
      )}
    </div>
  );
}

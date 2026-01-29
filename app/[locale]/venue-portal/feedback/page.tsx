'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  ChatBubbleLeftRightIcon,
  ClockIcon,
  CheckCircleIcon,
  CalendarDaysIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import FeedbackForm from '@/components/venue-portal/FeedbackForm';
import NightReportModal from '@/components/venue-portal/NightReportModal';
import DJRatingsModal from '@/components/venue-portal/DJRatingsModal';
import RatingStars from '@/components/venue-portal/RatingStars';
import DJAvatar from '@/components/venue-portal/DJAvatar';

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

interface HistoryAssignment extends Assignment {
  feedback: {
    id: string;
    overallRating: number;
    createdAt: string;
  } | null;
}

type Tab = 'pending' | 'history' | 'submitted';

// Group assignments by date and venue
interface DateVenueGroup {
  key: string;
  date: string;
  venue: { id: string; name: string };
  assignments: Assignment[];
}

function groupAssignmentsByDateVenue(assignments: Assignment[]): DateVenueGroup[] {
  const groups: Record<string, DateVenueGroup> = {};

  assignments.forEach((a) => {
    const key = `${a.date}_${a.venue.id}`;
    if (!groups[key]) {
      groups[key] = {
        key,
        date: a.date,
        venue: a.venue,
        assignments: [],
      };
    }
    groups[key].assignments.push(a);
  });

  return Object.values(groups).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export default function FeedbackPage() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<Tab>('pending');
  const [pendingAssignments, setPendingAssignments] = useState<Assignment[]>([]);
  const [historyAssignments, setHistoryAssignments] = useState<HistoryAssignment[]>([]);
  const [submittedFeedback, setSubmittedFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  // Single DJ feedback form
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  // Night report modal
  const [nightReportGroup, setNightReportGroup] = useState<DateVenueGroup | null>(null);
  const [showNightReport, setShowNightReport] = useState(false);

  // DJ ratings modal (multiple DJs)
  const [djRatingsGroup, setDjRatingsGroup] = useState<DateVenueGroup | null>(null);
  const [showDJRatings, setShowDJRatings] = useState(false);

  // Group pending assignments by date/venue
  const pendingGroups = useMemo(
    () => groupAssignmentsByDateVenue(pendingAssignments),
    [pendingAssignments]
  );

  // Check for assignmentId in URL params
  useEffect(() => {
    const assignmentId = searchParams.get('assignmentId');
    if (assignmentId) {
      // Check pending assignments first
      const pendingMatch = pendingAssignments.find((a) => a.id === assignmentId);
      if (pendingMatch) {
        setSelectedAssignment(pendingMatch);
        setShowFeedbackForm(true);
        return;
      }
      // Check history assignments
      const historyMatch = historyAssignments.find((a) => a.id === assignmentId && !a.feedback);
      if (historyMatch) {
        setSelectedAssignment(historyMatch);
        setShowFeedbackForm(true);
      }
    }
  }, [searchParams, pendingAssignments, historyAssignments]);

  // Fetch data based on active tab
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (activeTab === 'pending') {
      params.set('pending', 'true');
    } else if (activeTab === 'history') {
      params.set('history', 'true');
    }

    fetch(`/api/venue-portal/feedback?${params}`)
      .then((res) => res.json())
      .then((data) => {
        if (activeTab === 'pending') {
          setPendingAssignments(data.assignments || []);
        } else if (activeTab === 'history') {
          setHistoryAssignments(data.assignments || []);
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
    setShowNightReport(false);
    setNightReportGroup(null);
    setShowDJRatings(false);
    setDjRatingsGroup(null);
    // Refresh the pending list
    fetch('/api/venue-portal/feedback?pending=true')
      .then((res) => res.json())
      .then((data) => {
        setPendingAssignments(data.assignments || []);
      });
    // Also refresh history
    fetch('/api/venue-portal/feedback?history=true')
      .then((res) => res.json())
      .then((data) => {
        setHistoryAssignments(data.assignments || []);
      });
  };

  const handleOpenNightReport = (group: DateVenueGroup) => {
    setNightReportGroup(group);
    setShowNightReport(true);
  };

  const handleOpenDJRatings = (group: DateVenueGroup) => {
    setDjRatingsGroup(group);
    setShowDJRatings(true);
  };

  return (
    <div className="space-y-6 pt-12 lg:pt-0">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white font-playfair flex items-center gap-3">
          <ChatBubbleLeftRightIcon className="w-7 h-7 text-brand-cyan" />
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
              ? 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30'
              : 'text-gray-400 hover:bg-white/10 hover:text-white'
          }`}
        >
          <ClockIcon className="w-5 h-5" />
          Pending
          {pendingAssignments.length > 0 && (
            <span className="px-2 py-0.5 bg-brand-cyan text-white text-xs rounded-full">
              {pendingAssignments.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'history'
              ? 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30'
              : 'text-gray-400 hover:bg-white/10 hover:text-white'
          }`}
        >
          <CalendarDaysIcon className="w-5 h-5" />
          History
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
        /* Pending Feedback - Grouped by Date/Venue */
        pendingGroups.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircleIcon className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">All Caught Up!</h3>
            <p className="text-gray-500 mb-4">
              You&apos;ve submitted feedback for all completed performances
            </p>
            <button
              onClick={() => setActiveTab('history')}
              className="text-brand-cyan hover:text-brand-cyan/80 text-sm"
            >
              View past shows in History →
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {pendingGroups.map((group) => (
              <div
                key={group.key}
                className="rounded-xl bg-white/5 border border-white/10 overflow-hidden"
              >
                {/* Group Header */}
                <div className="p-4 bg-white/10 border-b border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-white">{group.venue.name}</h3>
                      <p className="text-sm text-gray-400">{formatDate(group.date)}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenNightReport(group)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/20 text-gray-300 text-sm hover:bg-white/10 hover:text-white transition-colors"
                    >
                      <SparklesIcon className="w-4 h-4" />
                      Night Report
                    </button>
                    <button
                      onClick={() => handleOpenDJRatings(group)}
                      className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-brand-cyan text-white text-sm font-medium hover:bg-brand-cyan/90 transition-colors"
                    >
                      Rate {group.assignments.length} DJ{group.assignments.length > 1 ? 's' : ''}
                    </button>
                  </div>
                </div>

                {/* DJs in this group */}
                <div className="divide-y divide-white/5">
                  {group.assignments.map((assignment) => (
                    <div key={assignment.id} className="p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <DJAvatar
                            src={assignment.artist.profileImage}
                            name={assignment.artist.stageName}
                            size="md"
                            className="w-12 h-12 rounded-lg"
                          />
                          <div className="min-w-0">
                            <p className="font-medium text-white truncate">
                              {assignment.artist.stageName}
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
                          className="text-sm text-brand-cyan hover:text-brand-cyan/80 transition-colors flex flex-col items-end"
                        >
                          <span>Rate DJ →</span>
                          <span className="text-xs text-gray-500">Quick rating</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )
      ) : activeTab === 'history' ? (
        /* History - All Completed Shows */
        historyAssignments.length === 0 ? (
          <div className="text-center py-12">
            <CalendarDaysIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No Show History</h3>
            <p className="text-gray-500">
              Completed shows will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {historyAssignments.map((assignment) => (
              <div
                key={assignment.id}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <DJAvatar
                      src={assignment.artist.profileImage}
                      name={assignment.artist.stageName}
                      size="md"
                      className="w-14 h-14 rounded-lg"
                    />
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
                  <div className="flex items-center gap-3">
                    {assignment.feedback ? (
                      <div className="flex items-center gap-1 text-brand-cyan">
                        <StarIconSolid className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {assignment.feedback.overallRating}/5
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedAssignment(assignment);
                          setShowFeedbackForm(true);
                        }}
                        className="px-4 py-2 rounded-lg bg-brand-cyan text-white text-sm font-medium hover:bg-brand-cyan/90 transition-colors whitespace-nowrap"
                      >
                        Give Feedback
                      </button>
                    )}
                  </div>
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
                    <DJAvatar
                      src={feedback.artist.profileImage}
                      name={feedback.artist.stageName}
                      size="md"
                      className="rounded-lg"
                    />
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
                        <StarIconSolid className="w-4 h-4 text-brand-cyan" />
                        <span className="text-white">{feedback.musicQuality}/5</span>
                      </div>
                    </div>
                  )}
                  {feedback.crowdEngagement && (
                    <div>
                      <span className="text-gray-500">Engagement</span>
                      <div className="flex items-center gap-1 mt-1">
                        <StarIconSolid className="w-4 h-4 text-brand-cyan" />
                        <span className="text-white">{feedback.crowdEngagement}/5</span>
                      </div>
                    </div>
                  )}
                  {feedback.professionalism && (
                    <div>
                      <span className="text-gray-500">Professionalism</span>
                      <div className="flex items-center gap-1 mt-1">
                        <StarIconSolid className="w-4 h-4 text-brand-cyan" />
                        <span className="text-white">{feedback.professionalism}/5</span>
                      </div>
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

      {/* Single DJ Feedback Form */}
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

      {/* Night Report Modal */}
      {showNightReport && nightReportGroup && (
        <NightReportModal
          venueId={nightReportGroup.venue.id}
          venueName={nightReportGroup.venue.name}
          date={nightReportGroup.date}
          onClose={() => {
            setShowNightReport(false);
            setNightReportGroup(null);
          }}
          onSuccess={handleFeedbackSuccess}
        />
      )}

      {/* DJ Ratings Modal */}
      {showDJRatings && djRatingsGroup && (
        <DJRatingsModal
          assignments={djRatingsGroup.assignments}
          onClose={() => {
            setShowDJRatings(false);
            setDjRatingsGroup(null);
          }}
          onSuccess={handleFeedbackSuccess}
        />
      )}
    </div>
  );
}

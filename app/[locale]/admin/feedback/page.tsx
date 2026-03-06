'use client';

import { useEffect, useState } from 'react';
import { StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import {
  ChatBubbleLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

interface FeedbackItem {
  id: string;
  overallRating: number;
  notes: string | null;
  createdAt: string;
  artist: { id: string; stageName: string; profileImage: string | null };
  venue: { id: string; name: string };
  assignment: { date: string; startTime: string; endTime: string };
}

interface Stats {
  count: number;
  avgRating: number;
  thisWeek: number;
}

export default function AdminFeedbackPage() {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [stats, setStats] = useState<Stats>({ count: 0, avgRating: 0, thisWeek: 0 });
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [venueFilter, setVenueFilter] = useState('');
  const [venues, setVenues] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '20' });
    if (venueFilter) params.set('venueId', venueFilter);

    fetch(`/api/admin/feedback?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setFeedback(data.feedback || []);
        setStats(data.stats || { count: 0, avgRating: 0, thisWeek: 0 });
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
        if (data.venues) setVenues(data.venues);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, venueFilter]);

  function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[d.getMonth()]} ${d.getDate()}`;
  }

  function renderStars(rating: number) {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) =>
          i <= rating ? (
            <StarSolidIcon key={i} className="w-4 h-4 text-brand-cyan" />
          ) : (
            <StarIcon key={i} className="w-4 h-4 text-gray-600" />
          ),
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pt-8 lg:pt-0">
        <h1 className="text-3xl font-playfair font-bold text-white mb-2">
          Feedback Overview
        </h1>
        <p className="text-gray-400">All venue manager ratings across all venues</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
          <div className="text-2xl font-bold text-white">{stats.count}</div>
          <div className="text-gray-400 text-sm">Total Ratings</div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-brand-cyan">{stats.avgRating}</span>
            <StarSolidIcon className="w-5 h-5 text-brand-cyan" />
          </div>
          <div className="text-gray-400 text-sm">Average Rating</div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
          <div className="text-2xl font-bold text-white">{stats.thisWeek}</div>
          <div className="text-gray-400 text-sm">This Week</div>
        </div>
      </div>

      {/* Filter + List */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
        {/* Venue filter */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">Recent Feedback</h2>
          <select
            value={venueFilter}
            onChange={(e) => {
              setVenueFilter(e.target.value);
              setPage(1);
            }}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-cyan"
          >
            <option value="">All Venues</option>
            {venues.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-12">Loading...</div>
        ) : feedback.length === 0 ? (
          <div className="text-center text-gray-400 py-12">No feedback yet</div>
        ) : (
          <div className="space-y-4">
            {feedback.map((item) => (
              <div
                key={item.id}
                className="bg-white/5 rounded-lg border border-white/10 p-4"
              >
                <div className="flex items-start gap-4">
                  {/* DJ Photo */}
                  <div className="w-12 h-12 rounded-full bg-white/10 overflow-hidden flex-shrink-0">
                    {item.artist.profileImage ? (
                      <img
                        src={item.artist.profileImage}
                        alt={item.artist.stageName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 text-lg font-bold">
                        {item.artist.stageName.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <span className="text-white font-medium">
                          {item.artist.stageName}
                        </span>
                        <span className="text-gray-500 mx-2">at</span>
                        <span className="text-gray-300">{item.venue.name}</span>
                      </div>
                      <div className="text-gray-500 text-sm whitespace-nowrap">
                        {formatDate(item.assignment.date)}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-1">
                      {renderStars(item.overallRating)}
                      <span className="text-gray-500 text-sm">
                        {item.assignment.startTime} - {item.assignment.endTime}
                      </span>
                    </div>

                    {item.notes && (
                      <div className="mt-2 flex items-start gap-2">
                        <ChatBubbleLeftIcon className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-300 text-sm">{item.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
            <div className="text-sm text-gray-400">
              {total} total ratings
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-2 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-400">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-2 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

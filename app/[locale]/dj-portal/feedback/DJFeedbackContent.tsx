'use client';

import {
  StarIcon,
  MusicalNoteIcon,
  UserGroupIcon,
  BriefcaseIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

interface FeedbackEntry {
  id: string;
  venue: string;
  date: string;
  startTime: string;
  endTime: string;
  overallRating: number;
  musicQuality: number | null;
  crowdEngagement: number | null;
  professionalism: number | null;
  notes: string | null;
  crowdLevel: string | null;
  guestMix: string | null;
  createdAt: string;
}

interface Averages {
  overall: number | null;
  musicQuality: number | null;
  crowdEngagement: number | null;
  professionalism: number | null;
  totalRatings: number;
}

interface Props {
  data: {
    feedback: FeedbackEntry[];
    averages: Averages;
  };
  locale: string;
}

function formatDate(date: string, locale: string) {
  const d = new Date(date);
  return d.toLocaleDateString(locale === 'th' ? 'th-TH' : 'en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function RatingDisplay({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) {
  const sizeClass = size === 'lg' ? 'w-6 h-6' : 'w-4 h-4';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIconSolid
          key={star}
          className={`${sizeClass} ${star <= rating ? 'text-brand-cyan' : 'text-gray-600'}`}
        />
      ))}
    </div>
  );
}

function AverageCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number | null;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
      <div className="flex justify-center mb-2 text-brand-cyan">{icon}</div>
      <p className="text-2xl font-bold text-white">
        {value !== null ? value : '--'}
      </p>
      <p className="text-sm text-gray-400 mt-1">{label}</p>
    </div>
  );
}

export default function DJFeedbackContent({ data, locale }: Props) {
  const { feedback, averages } = data;
  const isTh = locale === 'th';

  // Build rating trend data (last 20 ratings, chronological order)
  const trendData = [...feedback]
    .slice(0, 20)
    .reverse();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pt-12 lg:pt-0">
        <h1 className="text-3xl font-bold text-white font-playfair flex items-center gap-3">
          <StarIcon className="w-8 h-8 text-brand-cyan" />
          {isTh ? 'คำติชม' : 'Feedback'}
        </h1>
        <p className="text-gray-400 mt-2">
          {averages.totalRatings} {isTh ? 'รีวิวทั้งหมด' : 'total reviews'}
        </p>
      </div>

      {/* Average Rating — prominent display */}
      <div className="rounded-xl border border-brand-cyan/30 bg-brand-cyan/5 backdrop-blur-sm p-6 text-center">
        <p className="text-sm text-gray-400 mb-2">
          {isTh ? 'คะแนนเฉลี่ยรวม' : 'Overall Average Rating'}
        </p>
        <p className="text-5xl font-bold text-white mb-3">
          {averages.overall !== null ? averages.overall : '--'}
          <span className="text-xl text-gray-400">/5</span>
        </p>
        {averages.overall !== null && (
          <RatingDisplay rating={Math.round(averages.overall)} size="lg" />
        )}
      </div>

      {/* Category Averages */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <AverageCard
          label={isTh ? 'คุณภาพเพลง' : 'Music Quality'}
          value={averages.musicQuality}
          icon={<MusicalNoteIcon className="w-6 h-6" />}
        />
        <AverageCard
          label={isTh ? 'การมีส่วนร่วม' : 'Crowd Engagement'}
          value={averages.crowdEngagement}
          icon={<UserGroupIcon className="w-6 h-6" />}
        />
        <AverageCard
          label={isTh ? 'ความเป็นมืออาชีพ' : 'Professionalism'}
          value={averages.professionalism}
          icon={<BriefcaseIcon className="w-6 h-6" />}
        />
      </div>

      {/* Rating Trend — simple visual bar */}
      {trendData.length > 1 && (
        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            {isTh ? 'แนวโน้มคะแนน' : 'Rating Trend'}
          </h2>
          <div className="flex items-end gap-1 h-24">
            {trendData.map((fb, idx) => (
              <div
                key={fb.id}
                className="flex-1 flex flex-col items-center justify-end gap-1"
              >
                <span className="text-xs text-gray-500">{fb.overallRating}</span>
                <div
                  className="w-full rounded-t bg-brand-cyan/60 min-w-[8px] transition-all"
                  style={{ height: `${(fb.overallRating / 5) * 100}%` }}
                  title={`${fb.venue} - ${formatDate(fb.date, locale)} - ${fb.overallRating}/5`}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-gray-500">
              {trendData.length > 0 ? formatDate(trendData[0].date, locale) : ''}
            </span>
            <span className="text-xs text-gray-500">
              {trendData.length > 0 ? formatDate(trendData[trendData.length - 1].date, locale) : ''}
            </span>
          </div>
        </div>
      )}

      {/* Feedback List */}
      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
        <div className="p-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">
            {isTh ? 'รีวิวทั้งหมด' : 'All Reviews'}
          </h2>
        </div>
        {feedback.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            {isTh ? 'ยังไม่มีคำติชม' : 'No feedback received yet'}
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {feedback.map((fb) => (
              <div
                key={fb.id}
                className="p-4 hover:bg-white/5 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-medium text-white">{fb.venue}</p>
                      <RatingDisplay rating={fb.overallRating} />
                    </div>
                    <p className="text-sm text-gray-400">
                      {formatDate(fb.date, locale)} &middot; {fb.startTime} - {fb.endTime}
                    </p>
                    {fb.notes && (
                      <p className="text-sm text-gray-300 mt-2 italic">
                        &ldquo;{fb.notes}&rdquo;
                      </p>
                    )}
                    {/* Sub-ratings */}
                    {(fb.musicQuality || fb.crowdEngagement || fb.professionalism) && (
                      <div className="flex flex-wrap gap-3 mt-2">
                        {fb.musicQuality && (
                          <span className="text-xs text-gray-500">
                            {isTh ? 'เพลง' : 'Music'}: {fb.musicQuality}/5
                          </span>
                        )}
                        {fb.crowdEngagement && (
                          <span className="text-xs text-gray-500">
                            {isTh ? 'มีส่วนร่วม' : 'Engagement'}: {fb.crowdEngagement}/5
                          </span>
                        )}
                        {fb.professionalism && (
                          <span className="text-xs text-gray-500">
                            {isTh ? 'มืออาชีพ' : 'Professional'}: {fb.professionalism}/5
                          </span>
                        )}
                      </div>
                    )}
                    {/* Context */}
                    {(fb.crowdLevel || fb.guestMix) && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {fb.crowdLevel && (
                          <span className="text-xs bg-white/10 text-gray-400 px-2 py-0.5 rounded">
                            {fb.crowdLevel}
                          </span>
                        )}
                        {fb.guestMix && (
                          <span className="text-xs bg-white/10 text-gray-400 px-2 py-0.5 rounded">
                            {fb.guestMix}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

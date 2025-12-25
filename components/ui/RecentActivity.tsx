'use client';

import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { UserCircleIcon } from '@heroicons/react/24/solid';

interface Activity {
  id: string;
  customerName: string;
  artistName: string;
  eventDate: string;
  timestamp: number;
  avatar?: string;
}

interface RecentActivityProps {
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  maxItems?: number;
  autoHide?: boolean;
  autoHideDuration?: number; // milliseconds
  enabled?: boolean;
  showDelay?: number; // Delay before showing first notification (milliseconds)
}

const RecentActivity: React.FC<RecentActivityProps> = ({
  position = 'bottom-left',
  maxItems = 3,
  autoHide = true,
  autoHideDuration = 10000,
  enabled = true,
  showDelay = 3000
}) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [visibleActivities, setVisibleActivities] = useState<Set<string>>(new Set());
  const [dismissed, setDismissed] = useState(false);

  // Mock activities data - In production, this would come from an API
  const mockActivities: Activity[] = [
    {
      id: '1',
      customerName: 'John D.',
      artistName: 'DJ Natcha',
      eventDate: 'Oct 15',
      timestamp: Date.now()
    },
    {
      id: '2',
      customerName: 'Sarah K.',
      artistName: 'The Soul Band',
      eventDate: 'Oct 22',
      timestamp: Date.now() + 5000
    },
    {
      id: '3',
      customerName: 'Michael R.',
      artistName: 'Jazz Trio',
      eventDate: 'Nov 3',
      timestamp: Date.now() + 10000
    },
    {
      id: '4',
      customerName: 'Lisa M.',
      artistName: 'DJ Mike',
      eventDate: 'Nov 10',
      timestamp: Date.now() + 15000
    },
    {
      id: '5',
      customerName: 'David P.',
      artistName: 'Acoustic Duo',
      eventDate: 'Nov 15',
      timestamp: Date.now() + 20000
    }
  ];

  useEffect(() => {
    if (!enabled || dismissed) return;

    // Initial delay before showing first activity
    const initialTimer = setTimeout(() => {
      const shuffled = [...mockActivities].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, maxItems);
      setActivities(selected);

      // Show activities one by one with staggered entrance
      selected.forEach((activity, index) => {
        setTimeout(() => {
          setVisibleActivities((prev) => new Set([...prev, activity.id]));

          // Auto-hide individual activity after duration
          if (autoHide) {
            setTimeout(() => {
              setVisibleActivities((prev) => {
                const newSet = new Set(prev);
                newSet.delete(activity.id);
                return newSet;
              });
            }, autoHideDuration);
          }
        }, index * 2000); // 2 second delay between each notification
      });
    }, showDelay);

    return () => clearTimeout(initialTimer);
  }, [enabled, dismissed, maxItems, autoHide, autoHideDuration, showDelay]);

  const handleDismiss = (activityId: string) => {
    setVisibleActivities((prev) => {
      const newSet = new Set(prev);
      newSet.delete(activityId);
      return newSet;
    });
  };

  const handleDismissAll = () => {
    setDismissed(true);
    setVisibleActivities(new Set());
  };

  if (!enabled || activities.length === 0) return null;

  const positionClasses = {
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4'
  };

  const visibleActivitiesList = activities.filter((activity) =>
    visibleActivities.has(activity.id)
  );

  if (visibleActivitiesList.length === 0) return null;

  return (
    <div
      className={`fixed ${positionClasses[position]} z-50 space-y-2 max-w-sm pointer-events-none`}
      role="status"
      aria-live="polite"
      aria-label="Recent booking activity"
    >
      {visibleActivitiesList.map((activity, index) => (
        <div
          key={activity.id}
          className="
            bg-white/95 backdrop-blur-md border border-brand-cyan/20
            rounded-xl p-4 shadow-xl
            animate-activity-slide-in
            pointer-events-auto
            hover:shadow-2xl hover:border-brand-cyan/40
            transition-all duration-300
            transform hover:-translate-y-1
          "
          style={{
            animationDelay: `${index * 100}ms`
          }}
        >
          <div className="flex items-start justify-between gap-3">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {activity.avatar ? (
                <img
                  src={activity.avatar}
                  alt={activity.customerName}
                  className="w-10 h-10 rounded-full object-cover border-2 border-brand-cyan/20"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-brand-cyan/10 flex items-center justify-center border-2 border-brand-cyan/20">
                  <UserCircleIcon className="w-8 h-8 text-brand-cyan" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-inter text-dark-gray leading-relaxed">
                <span className="font-semibold">{activity.customerName}</span> just booked{' '}
                <span className="font-semibold text-brand-cyan">{activity.artistName}</span> for{' '}
                <span className="font-medium">{activity.eventDate}</span>
              </p>
              <p className="text-xs text-gray-500 mt-1 font-inter">
                A few moments ago
              </p>
            </div>

            {/* Dismiss Button */}
            <button
              onClick={() => handleDismiss(activity.id)}
              className="
                flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600
                transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 rounded
                p-1
              "
              aria-label="Dismiss notification"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Trust indicator */}
          <div className="mt-2 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-1 animate-pulse"></div>
                <span className="font-inter">Live booking</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentActivity;

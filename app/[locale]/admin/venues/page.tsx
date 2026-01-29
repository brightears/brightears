'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import {
  BuildingOfficeIcon,
  PlusIcon,
  MapPinIcon,
  ClockIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

interface Venue {
  id: string;
  name: string;
  venueType: string | null;
  city: string;
  isActive: boolean;
  operatingHours: {
    startTime?: string;
    endTime?: string;
    hasMultipleSlots?: boolean;
    slots?: Array<{ name: string; startTime: string; endTime: string }>;
  } | null;
  corporate: {
    companyName: string;
  };
  _count: {
    assignments: number;
    feedback: number;
  };
}

export default function AdminVenuesPage() {
  const locale = useLocale();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/venues');
      if (!response.ok) {
        throw new Error('Failed to fetch venues');
      }
      const data = await response.json();
      setVenues(data.venues);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="pt-8 lg:pt-0 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-white mb-2">
            Venues
          </h1>
          <p className="text-gray-400">
            Manage venue clients and onboard new venues
          </p>
        </div>
        <Link
          href={`/${locale}/admin/venues/new`}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-cyan text-white font-medium hover:bg-brand-cyan/90 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          New Venue
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-cyan border-t-transparent" />
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
          <p className="text-red-400">{error}</p>
          <button
            onClick={fetchVenues}
            className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : venues.length === 0 ? (
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8">
          <div className="text-center py-16 text-gray-500">
            <BuildingOfficeIcon className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <p className="text-lg mb-2">No venues yet</p>
            <p className="text-sm mb-6">Get started by onboarding your first venue client.</p>
            <Link
              href={`/${locale}/admin/venues/new`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-cyan text-white font-medium rounded-lg hover:bg-brand-cyan/90 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              Onboard First Venue
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {venues.map((venue) => (
            <div
              key={venue.id}
              className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden hover:border-white/20 transition-colors"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-white">{venue.name}</h3>
                    <p className="text-sm text-gray-400">{venue.corporate.companyName}</p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      venue.isActive
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}
                  >
                    {venue.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-400">
                  {venue.venueType && (
                    <div className="flex items-center gap-1">
                      <BuildingOfficeIcon className="w-4 h-4" />
                      {venue.venueType}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <MapPinIcon className="w-4 h-4" />
                    {venue.city}
                  </div>
                  {venue.operatingHours && (
                    <div className="flex items-center gap-1">
                      <ClockIcon className="w-4 h-4" />
                      {venue.operatingHours.startTime} - {venue.operatingHours.endTime}
                      {venue.operatingHours.hasMultipleSlots &&
                        ` (${venue.operatingHours.slots?.length || 0} slots)`}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-gray-400">
                      <UserGroupIcon className="w-4 h-4" />
                      <span className="text-white font-medium">
                        {venue._count.assignments}
                      </span>{' '}
                      shows
                    </div>
                    <div className="text-gray-400">
                      <span className="text-white font-medium">
                        {venue._count.feedback}
                      </span>{' '}
                      reviews
                    </div>
                  </div>

                  <Link
                    href={`/${locale}/admin/venues/${venue.id}`}
                    className="text-brand-cyan hover:text-brand-cyan/80 text-sm font-medium"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

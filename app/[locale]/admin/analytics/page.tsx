'use client';

import { useState, useEffect } from 'react';
import {
  ExclamationTriangleIcon,
  LightBulbIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  HeartIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

interface Alert {
  type: 'warning' | 'critical';
  category: 'rating_drop' | 'unassigned_slot' | 'overworked' | 'venue_health';
  title: string;
  description: string;
  entityId?: string;
  entityName?: string;
}

interface Recommendation {
  type: 'positive' | 'action';
  category: 'top_performer' | 'trending_venue' | 'suggestion';
  title: string;
  description: string;
  entityId?: string;
  entityName?: string;
}

interface Stats {
  totalDJs: number;
  activeDJsThisWeek: number;
  totalVenues: number;
  alertsCount: number;
  criticalAlerts: number;
  recommendationsCount: number;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'rating_drop':
      return <ArrowTrendingDownIcon className="w-5 h-5" />;
    case 'unassigned_slot':
      return <ClockIcon className="w-5 h-5" />;
    case 'overworked':
      return <ExclamationCircleIcon className="w-5 h-5" />;
    case 'venue_health':
      return <BuildingOfficeIcon className="w-5 h-5" />;
    case 'top_performer':
      return <CheckCircleIcon className="w-5 h-5" />;
    case 'trending_venue':
      return <HeartIcon className="w-5 h-5" />;
    default:
      return <LightBulbIcon className="w-5 h-5" />;
  }
};

export default function AdminAnalyticsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/recommendations');
      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }

      const data = await response.json();
      setAlerts(data.alerts);
      setRecommendations(data.recommendations);
      setStats(data.stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-cyan border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="pt-8 lg:pt-0">
          <h1 className="text-3xl font-playfair font-bold text-white mb-2">
            Analytics & Insights
          </h1>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
          <p className="text-red-400">{error}</p>
          <button
            onClick={fetchData}
            className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pt-8 lg:pt-0">
        <h1 className="text-3xl font-playfair font-bold text-white mb-2">
          Analytics & Insights
        </h1>
        <p className="text-gray-400">
          Platform performance with actionable recommendations
        </p>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <UserGroupIcon className="w-4 h-4" />
              <span className="text-xs">Total DJs</span>
            </div>
            <div className="text-2xl font-bold text-white">{stats.totalDJs}</div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <UserGroupIcon className="w-4 h-4" />
              <span className="text-xs">Active This Week</span>
            </div>
            <div className="text-2xl font-bold text-brand-cyan">
              {stats.activeDJsThisWeek}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <BuildingOfficeIcon className="w-4 h-4" />
              <span className="text-xs">Venues</span>
            </div>
            <div className="text-2xl font-bold text-white">{stats.totalVenues}</div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <ExclamationTriangleIcon className="w-4 h-4" />
              <span className="text-xs">Alerts</span>
            </div>
            <div className="text-2xl font-bold text-amber-400">{stats.alertsCount}</div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <ExclamationCircleIcon className="w-4 h-4" />
              <span className="text-xs">Critical</span>
            </div>
            <div className="text-2xl font-bold text-red-400">{stats.criticalAlerts}</div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <LightBulbIcon className="w-4 h-4" />
              <span className="text-xs">Recommendations</span>
            </div>
            <div className="text-2xl font-bold text-green-400">
              {stats.recommendationsCount}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alerts Section */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10 flex items-center gap-2">
            <ExclamationTriangleIcon className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-medium text-white">Attention Needed</h2>
            <span className="ml-auto text-sm text-gray-500">
              {alerts.length} alert{alerts.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="divide-y divide-white/5 max-h-[400px] overflow-y-auto">
            {alerts.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                <CheckCircleIcon className="w-12 h-12 mx-auto mb-2 text-green-400/50" />
                <p>All clear! No issues need attention.</p>
              </div>
            ) : (
              alerts.map((alert, index) => (
                <div
                  key={index}
                  className={`px-6 py-4 flex items-start gap-4 ${
                    alert.type === 'critical' ? 'bg-red-500/5' : ''
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg ${
                      alert.type === 'critical'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}
                  >
                    {getCategoryIcon(alert.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-medium">{alert.title}</h3>
                      {alert.type === 'critical' && (
                        <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded">
                          Critical
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm mt-1">{alert.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recommendations Section */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10 flex items-center gap-2">
            <LightBulbIcon className="w-5 h-5 text-green-400" />
            <h2 className="text-lg font-medium text-white">Recommendations</h2>
            <span className="ml-auto text-sm text-gray-500">
              {recommendations.length} suggestion{recommendations.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="divide-y divide-white/5 max-h-[400px] overflow-y-auto">
            {recommendations.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                <ChartBarIcon className="w-12 h-12 mx-auto mb-2 text-gray-500/50" />
                <p>Not enough data yet for recommendations.</p>
                <p className="text-sm mt-1">Check back after more DJ performances.</p>
              </div>
            ) : (
              recommendations.map((rec, index) => (
                <div key={index} className="px-6 py-4 flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-green-500/20 text-green-400">
                    {getCategoryIcon(rec.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium">{rec.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">{rec.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Performance Metrics Placeholder */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
        <h2 className="text-lg font-medium text-white mb-4">Performance Trends</h2>
        <div className="text-center py-12 text-gray-500">
          <ChartBarIcon className="w-16 h-16 mx-auto mb-4 text-gray-600" />
          <p className="text-lg mb-2">Charts Coming Soon</p>
          <p className="text-sm">
            Weekly performance trends, rating distributions, and venue comparisons
          </p>
        </div>
      </div>
    </div>
  );
}

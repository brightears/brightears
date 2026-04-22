'use client';

import { useEffect, useState } from 'react';

interface DJHealth {
  stageName: string;
  shifts30d: number;
  avg30d: number | null;
  lowRatings: number;
  fives: number;
  shiftsPrior30d: number | null;
  avgPrior30d: number | null;
  drift: number | null;
}

interface RosterHealthData {
  generatedAt: string;
  windowStart: string;
  windowEnd: string;
  djs: DJHealth[];
}

export default function AdminRosterHealthPage() {
  const [data, setData] = useState<RosterHealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/roster-health')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-gray-400 p-4">Loading roster health…</div>;
  }

  if (error) {
    return <div className="text-red-400 p-4">Failed to load: {error}</div>;
  }

  if (!data || data.djs.length === 0) {
    return <div className="text-gray-400 p-4">No rated shifts in last 30 days.</div>;
  }

  const formatDrift = (d: number | null) => {
    if (d === null) return '—';
    const sign = d > 0 ? '+' : '';
    return `${sign}${d.toFixed(2)}`;
  };

  const driftClass = (d: number | null) => {
    if (d === null) return 'text-gray-400';
    if (d <= -0.5) return 'text-red-400';
    if (d < 0) return 'text-amber-400';
    if (d >= 0.5) return 'text-emerald-400';
    return 'text-gray-300';
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-white text-2xl font-playfair font-bold">Roster Health</h1>
        <p className="text-gray-400 text-sm">
          Last 30 days ({data.windowStart} → {data.windowEnd}) vs prior 30 days.
          Only DJs with ≥2 rated shifts in the window.
        </p>
        <p className="text-gray-500 text-xs mt-1">
          Generated: {new Date(data.generatedAt).toLocaleString()}
        </p>
      </div>

      <div className="overflow-x-auto bg-stone-800/50 rounded-lg border border-white/10">
        <table className="min-w-full divide-y divide-white/10 text-sm">
          <thead className="bg-stone-900/50">
            <tr className="text-left text-gray-400 uppercase text-xs tracking-wider">
              <th className="px-4 py-3">DJ</th>
              <th className="px-4 py-3 text-right">Shifts 30d</th>
              <th className="px-4 py-3 text-right">Avg</th>
              <th className="px-4 py-3 text-right">Fives</th>
              <th className="px-4 py-3 text-right">Low (≤2)</th>
              <th className="px-4 py-3 text-right">Prior Shifts</th>
              <th className="px-4 py-3 text-right">Prior Avg</th>
              <th className="px-4 py-3 text-right">Drift</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.djs.map((dj) => (
              <tr key={dj.stageName} className="text-gray-200 hover:bg-white/5">
                <td className="px-4 py-3 font-medium text-white">{dj.stageName}</td>
                <td className="px-4 py-3 text-right">{dj.shifts30d}</td>
                <td className="px-4 py-3 text-right">
                  {dj.avg30d !== null ? dj.avg30d.toFixed(2) : '—'}
                </td>
                <td className="px-4 py-3 text-right">{dj.fives}</td>
                <td className={`px-4 py-3 text-right ${dj.lowRatings > 0 ? 'text-red-400 font-semibold' : ''}`}>
                  {dj.lowRatings}
                </td>
                <td className="px-4 py-3 text-right text-gray-400">
                  {dj.shiftsPrior30d ?? '—'}
                </td>
                <td className="px-4 py-3 text-right text-gray-400">
                  {dj.avgPrior30d !== null ? dj.avgPrior30d.toFixed(2) : '—'}
                </td>
                <td className={`px-4 py-3 text-right font-mono ${driftClass(dj.drift)}`}>
                  {formatDrift(dj.drift)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-xs text-gray-500">
        Drift legend:
        <span className="text-red-400 ml-2">≤ -0.50 concerning</span>
        <span className="text-amber-400 ml-2">&lt; 0 declining</span>
        <span className="text-emerald-400 ml-2">≥ +0.50 trending up</span>
      </div>
    </div>
  );
}

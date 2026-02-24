'use client';

import { useState } from 'react';

type ActionResult = {
  total?: number;
  sent?: number;
  skipped?: number;
  date?: string;
  errors?: string[];
  error?: string;
};

export default function LineActions() {
  const [loading, setLoading] = useState<string | null>(null);
  const [result, setResult] = useState<ActionResult | null>(null);
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastRole, setBroadcastRole] = useState('');

  async function handleAction(action: string, extra?: Record<string, unknown>) {
    setLoading(action);
    setResult(null);
    try {
      const res = await fetch('/api/admin/line/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...extra }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ error: 'Network error' });
    } finally {
      setLoading(null);
    }
  }

  function handleBroadcast() {
    if (!broadcastMessage.trim()) return;
    handleAction('broadcast', {
      message: broadcastMessage.trim(),
      role: broadcastRole || undefined,
    });
    setBroadcastMessage('');
    setShowBroadcast(false);
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
      <h2 className="text-lg font-semibold text-white mb-4">LINE Notifications</h2>

      <div className="flex flex-wrap gap-3">
        {/* Send Feedback Requests */}
        <button
          onClick={() => handleAction('feedback_requests')}
          disabled={loading !== null}
          className="px-4 py-2 rounded-lg bg-brand-cyan text-white font-medium hover:bg-brand-cyan/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {loading === 'feedback_requests' ? (
            <span className="flex items-center gap-2">
              <Spinner /> Sending...
            </span>
          ) : (
            'Send Feedback Requests'
          )}
        </button>

        {/* Send DJ Reminders */}
        <button
          onClick={() => handleAction('dj_reminder')}
          disabled={loading !== null}
          className="px-4 py-2 rounded-lg bg-brand-cyan text-white font-medium hover:bg-brand-cyan/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {loading === 'dj_reminder' ? (
            <span className="flex items-center gap-2">
              <Spinner /> Sending...
            </span>
          ) : (
            'Send DJ Reminders'
          )}
        </button>

        {/* Broadcast Toggle */}
        <button
          onClick={() => setShowBroadcast(!showBroadcast)}
          disabled={loading !== null}
          className="px-4 py-2 rounded-lg bg-white/10 text-white font-medium hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          Broadcast Message
        </button>
      </div>

      {/* Broadcast Form */}
      {showBroadcast && (
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs text-gray-400 mb-1">Message</label>
            <input
              type="text"
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-brand-cyan"
              onKeyDown={(e) => e.key === 'Enter' && handleBroadcast()}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Audience</label>
            <select
              value={broadcastRole}
              onChange={(e) => setBroadcastRole(e.target.value)}
              className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:border-brand-cyan"
            >
              <option value="">All Users</option>
              <option value="CORPORATE">Venue Managers</option>
              <option value="ARTIST">DJs</option>
            </select>
          </div>
          <button
            onClick={handleBroadcast}
            disabled={!broadcastMessage.trim() || loading !== null}
            className="px-4 py-2 rounded-lg bg-brand-cyan text-white font-medium hover:bg-brand-cyan/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {loading === 'broadcast' ? (
              <span className="flex items-center gap-2">
                <Spinner /> Sending...
              </span>
            ) : (
              'Send'
            )}
          </button>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="mt-4 text-sm">
          {result.error ? (
            <span className="text-red-400">{result.error}</span>
          ) : (
            <span className="text-gray-300">
              Sent: <span className="text-brand-cyan font-medium">{result.sent ?? 0}</span>
              {result.skipped !== undefined && (
                <> &middot; Skipped: {result.skipped}</>
              )}
              {result.total !== undefined && (
                <> &middot; Total: {result.total}</>
              )}
              {result.date && (
                <> &middot; Date: {result.date}</>
              )}
              {result.errors && result.errors.length > 0 && (
                <> &middot; <span className="text-red-400">{result.errors.length} error(s)</span></>
              )}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

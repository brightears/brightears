'use client';

import { useState, useEffect } from 'react';

interface LinkedUser {
  id: string;
  email: string;
  name: string | null;
  lineLinkedAt: string | null;
  corporate: { companyName: string } | null;
}

export default function LineLinkedAccounts() {
  const [users, setUsers] = useState<LinkedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [unlinking, setUnlinking] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    fetch('/api/admin/line/linked-accounts')
      .then((r) => r.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleUnlink = async (userId: string, email: string) => {
    if (!confirm(`Unlink LINE from ${email}? They will need to re-link to receive notifications.`)) return;
    setUnlinking(userId);
    try {
      const res = await fetch('/api/admin/line/linked-accounts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
      }
    } finally {
      setUnlinking(null);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-playfair font-bold text-white">
            LINE Linked Accounts
          </h2>
          <p className="text-gray-400 text-sm">
            {loading ? '...' : `${users.length} account${users.length !== 1 ? 's' : ''} linked`}
          </p>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="px-4 py-2 text-sm rounded-lg border border-white/20 text-gray-300 hover:bg-white/10 transition-colors"
        >
          {expanded ? 'Hide' : 'Manage'}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 space-y-2">
          {loading ? (
            <p className="text-gray-500 text-sm">Loading...</p>
          ) : users.length === 0 ? (
            <p className="text-gray-500 text-sm">No accounts linked yet.</p>
          ) : (
            users.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-3"
              >
                <div>
                  <div className="text-white text-sm font-medium">{u.email}</div>
                  <div className="text-gray-400 text-xs">
                    {u.corporate?.companyName || 'No company'} — linked{' '}
                    {u.lineLinkedAt
                      ? new Date(u.lineLinkedAt).toLocaleDateString()
                      : 'unknown'}
                  </div>
                </div>
                <button
                  onClick={() => handleUnlink(u.id, u.email)}
                  disabled={unlinking === u.id}
                  className="px-3 py-1 text-xs rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-colors disabled:opacity-50"
                >
                  {unlinking === u.id ? 'Unlinking...' : 'Unlink'}
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

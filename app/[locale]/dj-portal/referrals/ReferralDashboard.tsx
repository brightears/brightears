'use client';

import { useState, useEffect } from 'react';

interface ReferralData {
  code: string;
  referralLink: string;
  stats: {
    totalReferrals: number;
    totalCreditsEarned: number;
  };
  recentReferrals: {
    id: string;
    status: string;
    creditsEarned: number;
    createdAt: string;
    creditedAt: string | null;
  }[];
}

export default function ReferralDashboard() {
  const [data, setData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<'code' | 'link' | null>(null);

  useEffect(() => {
    fetch('/api/referrals')
      .then((res) => res.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const copyToClipboard = (text: string, type: 'code' | 'link') => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <span className="material-symbols-outlined text-[#4fd6ff] text-4xl animate-spin">progress_activity</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-16 text-[#bcc8ce]">
        Could not load referral data. Please try again.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-playfair font-bold text-white mb-2">Referrals</h1>
        <p className="text-[#bcc8ce]">Share your code. Earn free AI credits when other artists join.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-xl text-center">
          <p className="text-3xl font-playfair font-bold text-[#4fd6ff]">{data.stats.totalReferrals}</p>
          <p className="text-xs text-[#bcc8ce] uppercase tracking-widest mt-2">Artists Referred</p>
        </div>
        <div className="glass-card p-6 rounded-xl text-center">
          <p className="text-3xl font-playfair font-bold text-[#f0bba5]">{data.stats.totalCreditsEarned}</p>
          <p className="text-xs text-[#bcc8ce] uppercase tracking-widest mt-2">Credits Earned</p>
        </div>
        <div className="glass-card p-6 rounded-xl text-center">
          <p className="text-3xl font-playfair font-bold text-[#4fd6ff]">10</p>
          <p className="text-xs text-[#bcc8ce] uppercase tracking-widest mt-2">Credits Per Referral</p>
        </div>
      </div>

      {/* Referral Code */}
      <div className="glass-card p-8 rounded-xl space-y-6">
        <h2 className="text-xl font-bold">Your Referral Code</h2>

        {/* Code */}
        <div className="flex items-center gap-4">
          <div className="flex-1 bg-[#1c1b1b] border border-[#3d494e]/20 rounded-lg px-6 py-4 font-mono text-2xl text-[#4fd6ff] tracking-widest text-center">
            {data.code}
          </div>
          <button
            onClick={() => copyToClipboard(data.code, 'code')}
            className="px-6 py-4 bg-[#2a2a2a] rounded-lg hover:bg-[#353534] transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[#4fd6ff]">
              {copied === 'code' ? 'check' : 'content_copy'}
            </span>
            <span className="text-sm">{copied === 'code' ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>

        {/* Share Link */}
        <div>
          <label className="text-[10px] font-bold text-[#bcc8ce] uppercase tracking-widest mb-2 block">Share Link</label>
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-[#1c1b1b] border border-[#3d494e]/20 rounded-lg px-4 py-3 text-sm text-[#bcc8ce] truncate">
              {data.referralLink}
            </div>
            <button
              onClick={() => copyToClipboard(data.referralLink, 'link')}
              className="px-4 py-3 bg-[#2a2a2a] rounded-lg hover:bg-[#353534] transition-colors flex items-center gap-2 shrink-0"
            >
              <span className="material-symbols-outlined text-[#4fd6ff] text-sm">
                {copied === 'link' ? 'check' : 'content_copy'}
              </span>
              <span className="text-sm">{copied === 'link' ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-[#1c1b1b] rounded-lg p-6 space-y-3">
          <p className="text-sm font-bold">How it works:</p>
          <ul className="text-sm text-[#bcc8ce] space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-[#4fd6ff]">1.</span>
              Share your code or link with other artists
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#4fd6ff]">2.</span>
              They sign up and enter your code
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#4fd6ff]">3.</span>
              You get <strong className="text-[#4fd6ff]">10 free credits</strong>, they get <strong className="text-[#f0bba5]">5 bonus credits</strong>
            </li>
          </ul>
        </div>
      </div>

      {/* Recent Referrals */}
      {data.recentReferrals.length > 0 && (
        <div className="glass-card p-8 rounded-xl">
          <h2 className="text-xl font-bold mb-6">Recent Referrals</h2>
          <div className="space-y-4">
            {data.recentReferrals.map((ref) => (
              <div key={ref.id} className="flex items-center justify-between py-3 border-b border-[#3d494e]/10 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${ref.status === 'credited' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                  <span className="text-sm capitalize">{ref.status.replace('_', ' ')}</span>
                </div>
                <div className="text-sm">
                  {ref.creditsEarned > 0 && (
                    <span className="text-[#4fd6ff] font-bold">+{ref.creditsEarned} credits</span>
                  )}
                </div>
                <div className="text-xs text-[#bcc8ce]">
                  {new Date(ref.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

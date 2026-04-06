'use client';

import { useState, useEffect } from 'react';

interface UsageData {
  credits: {
    balance: number;
    totalPurchased: number;
    totalUsed: number;
    freeMonthlyUsed: number;
    freeMonthlyLimit: number;
  };
  recentGenerations: {
    id: string;
    contentType: string;
    artistName: string | null;
    venueName: string | null;
    status: string;
    createdAt: string;
  }[];
}

const CREDIT_PACKS = [
  { credits: 10, price: 5, label: 'Starter', popular: false },
  { credits: 50, price: 20, label: 'Creator', popular: true },
  { credits: 200, price: 60, label: 'Pro', popular: false },
];

export default function CreditsContent() {
  const [data, setData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/ai/generate-content')
      .then((res) => res.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <span className="material-symbols-outlined text-[#4fd6ff] text-4xl animate-spin">progress_activity</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-playfair font-bold text-white mb-2">Credits</h1>
        <p className="text-[#bcc8ce]">Purchase credits to generate more AI content.</p>
      </div>

      {/* Current Balance */}
      {data && (
        <div className="glass-card p-8 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-sm text-[#bcc8ce] uppercase tracking-widest font-bold">Current Balance</p>
            <p className="text-5xl font-playfair font-bold text-[#4fd6ff] mt-2">{data.credits.balance}</p>
            <p className="text-xs text-[#bcc8ce] mt-2">
              Free this month: {data.credits.freeMonthlyUsed}/{data.credits.freeMonthlyLimit} used
            </p>
          </div>
          <div className="text-right space-y-1 text-sm text-[#bcc8ce]">
            <p>Total purchased: {data.credits.totalPurchased}</p>
            <p>Total used: {data.credits.totalUsed}</p>
          </div>
        </div>
      )}

      {/* Credit Packs */}
      <div>
        <h2 className="text-xl font-bold mb-6">Buy Credits</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CREDIT_PACKS.map((pack) => (
            <div
              key={pack.credits}
              className={`p-8 rounded-xl flex flex-col items-center text-center space-y-4 relative ${
                pack.popular
                  ? 'bg-[#131313] border-2 border-[#4fd6ff] shadow-lg shadow-[#4fd6ff]/10'
                  : 'bg-[#2a2a2a] border border-[#3d494e]/20'
              }`}
            >
              {pack.popular && (
                <div className="absolute -top-3 bg-[#4fd6ff] text-[#003543] px-4 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full">
                  Best Value
                </div>
              )}
              <p className="text-sm font-bold uppercase tracking-widest text-[#bcc8ce]">{pack.label}</p>
              <p className="text-4xl font-playfair font-bold">{pack.credits}</p>
              <p className="text-xs text-[#bcc8ce] uppercase tracking-widest">Credits</p>
              <p className="text-2xl font-bold text-[#4fd6ff]">${pack.price}</p>
              <p className="text-xs text-[#bcc8ce]">${(pack.price / pack.credits).toFixed(2)} per credit</p>
              <button
                className={`w-full py-3 rounded-lg font-bold mt-4 transition-all ${
                  pack.popular
                    ? 'bg-[#4fd6ff] text-[#003543] hover:brightness-110'
                    : 'border border-[#3d494e] text-[#e5e2e1] hover:bg-white/5'
                }`}
                onClick={() => alert('Stripe integration coming soon! Contact us at info@brightears.io for early access.')}
              >
                Buy Now
              </button>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-[#bcc8ce]/50 mt-6">
          Secure payment via Stripe. Credits never expire.
        </p>
      </div>

      {/* Recent Generations */}
      {data && data.recentGenerations.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-6">Recent Generations</h2>
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="divide-y divide-[#3d494e]/10">
              {data.recentGenerations.map((gen) => (
                <div key={gen.id} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-[#4fd6ff]">
                      {gen.contentType === 'INSTAGRAM_POST' ? 'grid_view' :
                       gen.contentType === 'EVENT_POSTER' ? 'article' :
                       gen.contentType === 'INSTAGRAM_STORY' ? 'smartphone' :
                       gen.contentType === 'EPK_HEADER' ? 'badge' : 'panorama_wide_angle'}
                    </span>
                    <div>
                      <p className="font-medium text-sm">{gen.contentType.replace('_', ' ')}</p>
                      <p className="text-xs text-[#bcc8ce]">
                        {gen.artistName || 'Untitled'} {gen.venueName ? `at ${gen.venueName}` : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-xs px-2 py-1 rounded ${
                      gen.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' :
                      gen.status === 'FAILED' ? 'bg-red-500/20 text-red-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {gen.status}
                    </span>
                    <span className="text-xs text-[#bcc8ce]">
                      {new Date(gen.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

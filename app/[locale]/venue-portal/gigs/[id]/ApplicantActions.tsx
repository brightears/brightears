'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * ApplicantActions handles both:
 * - "cancel-gig": a single button to cancel the whole gig (venue only)
 * - "review-applicant": accept/shortlist/decline buttons on a single application
 */
export default function ApplicantActions({
  gigId,
  applicationId,
  artistId,
  action,
}: {
  gigId: string;
  applicationId?: string;
  artistId?: string;
  action: 'cancel-gig' | 'review-applicant';
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function updateGig(data: any) {
    setLoading('gig');
    try {
      const res = await fetch(`/api/venue-portal/gigs/${gigId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || 'Failed');
        return;
      }
      router.refresh();
    } finally {
      setLoading(null);
    }
  }

  async function updateApplication(status: 'SHORTLISTED' | 'ACCEPTED' | 'DECLINED') {
    if (!applicationId) return;
    setLoading(status);
    try {
      const res = await fetch(`/api/venue-portal/gigs/${gigId}/applications/${applicationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || 'Failed');
        return;
      }
      // If ACCEPTED, also mark the gig as FILLED
      if (status === 'ACCEPTED' && artistId) {
        await fetch(`/api/venue-portal/gigs/${gigId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'FILLED', filledArtistId: artistId }),
        });
      }
      router.refresh();
    } finally {
      setLoading(null);
    }
  }

  if (action === 'cancel-gig') {
    return (
      <button
        onClick={() => {
          if (confirm('Cancel this gig? Artists will be notified their application is no longer valid.')) {
            updateGig({ status: 'CANCELLED' });
          }
        }}
        disabled={loading === 'gig'}
        className="px-4 py-2 text-sm border border-red-500/40 text-red-300 rounded-lg hover:bg-red-500/10 transition disabled:opacity-50"
      >
        {loading === 'gig' ? 'Cancelling…' : 'Cancel this gig'}
      </button>
    );
  }

  // review-applicant mode
  return (
    <div className="flex gap-2">
      <button
        onClick={() => updateApplication('SHORTLISTED')}
        disabled={loading !== null}
        className="px-3 py-1.5 text-xs font-bold border border-amber-500/40 text-amber-300 rounded hover:bg-amber-500/10 transition disabled:opacity-50"
      >
        {loading === 'SHORTLISTED' ? '…' : 'Shortlist'}
      </button>
      <button
        onClick={() => updateApplication('ACCEPTED')}
        disabled={loading !== null}
        className="px-3 py-1.5 text-xs font-bold bg-emerald-500 text-stone-900 rounded hover:brightness-110 transition disabled:opacity-50"
      >
        {loading === 'ACCEPTED' ? '…' : 'Accept'}
      </button>
      <button
        onClick={() => updateApplication('DECLINED')}
        disabled={loading !== null}
        className="px-3 py-1.5 text-xs font-bold border border-red-500/40 text-red-300 rounded hover:bg-red-500/10 transition disabled:opacity-50"
      >
        {loading === 'DECLINED' ? '…' : 'Decline'}
      </button>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { ArrowLeftIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import OnboardingWizard, { OnboardingData } from '@/components/admin/onboarding/OnboardingWizard';

export default function NewVenuePage() {
  const locale = useLocale();
  const router = useRouter();
  const [success, setSuccess] = useState<{
    venueName: string;
    email: string;
  } | null>(null);

  const handleComplete = async (data: OnboardingData) => {
    const response = await fetch('/api/admin/venues/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create venue');
    }

    const result = await response.json();
    setSuccess({
      venueName: result.data.venueName,
      email: data.credentials.email,
    });
  };

  if (success) {
    return (
      <div className="space-y-8">
        <div className="pt-8 lg:pt-0">
          <Link
            href={`/${locale}/admin/venues`}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Venues
          </Link>

          <h1 className="text-3xl font-playfair font-bold text-white mb-2">
            Venue Created!
          </h1>
        </div>

        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-8 text-center">
          <CheckCircleIcon className="w-16 h-16 text-green-400 mx-auto mb-4" />

          <h2 className="text-2xl font-medium text-white mb-2">
            {success.venueName} is ready!
          </h2>

          <p className="text-gray-400 mb-6">
            The venue has been created and the user account is ready.
          </p>

          <div className="bg-white/5 rounded-lg p-4 mb-6 max-w-sm mx-auto text-left">
            <div className="text-sm text-gray-400 mb-1">Login Email:</div>
            <div className="text-white font-mono">{success.email}</div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Link
              href={`/${locale}/admin/venues`}
              className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors"
            >
              View All Venues
            </Link>
            <button
              onClick={() => {
                setSuccess(null);
              }}
              className="px-6 py-2.5 bg-brand-cyan hover:bg-brand-cyan/90 text-white font-medium rounded-lg transition-colors"
            >
              Add Another Venue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="pt-8 lg:pt-0">
        <Link
          href={`/${locale}/admin/venues`}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Venues
        </Link>

        <h1 className="text-3xl font-playfair font-bold text-white mb-2">
          Onboard New Venue
        </h1>
        <p className="text-gray-400">
          Create venue account, assign DJs, and set up schedule
        </p>
      </div>

      <OnboardingWizard onComplete={handleComplete} />
    </div>
  );
}

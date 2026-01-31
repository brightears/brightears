'use client';

import { useUser, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useLocale } from 'next-intl';

/**
 * Auth Redirect Handler
 *
 * After sign-in, this page checks the user's role and redirects to the appropriate dashboard:
 * - ADMIN → /admin
 * - CORPORATE → /venue-portal
 * - Others → / (homepage)
 */
export default function AuthRedirect() {
  const { user, isLoaded } = useUser();
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    if (!isLoaded) return;

    // If not signed in, redirect to sign-in page
    if (!isSignedIn) {
      router.replace('/sign-in');
      return;
    }

    const role = user?.publicMetadata?.role as string;

    if (role === 'ADMIN') {
      router.replace(`/${locale}/admin`);
    } else if (role === 'CORPORATE') {
      router.replace(`/${locale}/venue-portal`);
    } else {
      router.replace(`/${locale}`);
    }
  }, [isLoaded, isSignedIn, user, router, locale]);

  return (
    <div className="min-h-screen bg-deep-teal flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-cyan border-t-transparent mx-auto mb-4" />
        <p className="text-white/70 text-sm">Redirecting...</p>
      </div>
    </div>
  );
}

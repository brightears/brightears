'use client';

import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';

/**
 * Auth Redirect Handler
 *
 * After sign-in, this page fetches the user's role from the database and redirects:
 * - ADMIN → /admin
 * - CORPORATE → /venue-portal
 * - Others → / (homepage)
 */
export default function AuthRedirect() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const locale = useLocale();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!isLoaded || isRedirecting) return;

    // If not signed in, redirect to sign-in page
    if (!isSignedIn) {
      router.replace('/sign-in');
      return;
    }

    // Fetch user role from database via API
    const fetchUserRole = async () => {
      setIsRedirecting(true);
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();

        const role = data.user?.role;

        if (role === 'ADMIN') {
          router.replace(`/${locale}/admin`);
        } else if (role === 'CORPORATE') {
          router.replace(`/${locale}/venue-portal`);
        } else {
          router.replace(`/${locale}`);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        // Fallback to homepage on error
        router.replace(`/${locale}`);
      }
    };

    fetchUserRole();
  }, [isLoaded, isSignedIn, router, locale, isRedirecting]);

  return (
    <div className="min-h-screen bg-deep-teal flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-cyan border-t-transparent mx-auto mb-4" />
        <p className="text-white/70 text-sm">Redirecting...</p>
      </div>
    </div>
  );
}

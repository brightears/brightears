'use client';

import { useAuth, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';

const ROLE_CACHE_KEY = 'brightears_user_role';

/**
 * Auth Redirect Handler
 *
 * After sign-in, redirects based on user role:
 * - ADMIN → /admin
 * - CORPORATE → /venue-portal
 * - Others → / (homepage)
 *
 * Priority order for role detection:
 * 1. Clerk publicMetadata.role (instant, synced from DB)
 * 2. localStorage cache (instant, from previous login)
 * 3. API call to /api/auth/me (fallback, syncs role to Clerk)
 */
export default function AuthRedirect() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const locale = useLocale();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Redirect based on role
  const redirectByRole = (role: string | null) => {
    if (role === 'ADMIN') {
      router.replace(`/${locale}/admin`);
    } else if (role === 'CORPORATE') {
      router.replace(`/${locale}/venue-portal`);
    } else {
      router.replace(`/${locale}`);
    }
  };

  useEffect(() => {
    if (!isLoaded || isRedirecting) return;

    // If not signed in, redirect to sign-in page
    if (!isSignedIn) {
      localStorage.removeItem(ROLE_CACHE_KEY);
      router.replace('/sign-in');
      return;
    }

    setIsRedirecting(true);

    // Priority 1: Check Clerk's publicMetadata (instant, no API call)
    const clerkRole = user?.publicMetadata?.role as string | undefined;
    if (clerkRole) {
      localStorage.setItem(ROLE_CACHE_KEY, clerkRole);
      redirectByRole(clerkRole);
      return;
    }

    // Priority 2: Check localStorage cache (instant)
    const cachedRole = localStorage.getItem(ROLE_CACHE_KEY);
    if (cachedRole) {
      redirectByRole(cachedRole);
      // Fetch in background to sync role to Clerk for next time
      fetch('/api/auth/me').catch(() => {});
      return;
    }

    // Priority 3: Fetch from API (syncs role to Clerk for future logins)
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        const role = data.user?.role;
        if (role) {
          localStorage.setItem(ROLE_CACHE_KEY, role);
        }
        redirectByRole(role);
      })
      .catch((error) => {
        console.error('Error fetching user role:', error);
        router.replace(`/${locale}`);
      });
  }, [isLoaded, isSignedIn, user, router, locale, isRedirecting]);

  return (
    <div className="min-h-screen bg-deep-teal flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-cyan border-t-transparent mx-auto mb-4" />
        <p className="text-white/70 text-sm">Redirecting...</p>
      </div>
    </div>
  );
}

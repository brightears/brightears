import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

// Define protected routes that require authentication
const isProtectedRoute = createRouteMatcher([
  '/(.*)/dashboard(.*)',
  '/(.*)/profile(.*)',
  '/(.*)/bookings(.*)',
  '/(.*)/settings(.*)',
  '/(.*)/admin(.*)',
  '/(.*)/artist-dashboard(.*)',
]);

// Check if the request is for an API route
const isApiRoute = createRouteMatcher(['/api(.*)']);

// Auth routes should skip intl middleware (Clerk handles these)
const isAuthRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)']);

export default clerkMiddleware(async (auth, req) => {
  // Skip internationalization for API routes
  if (isApiRoute(req)) {
    return;
  }

  // Skip internationalization for auth routes (Clerk handles these)
  if (isAuthRoute(req)) {
    return;
  }

  // Handle internationalization for non-API routes
  const intlResponse = intlMiddleware(req);

  // Check if route requires authentication
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  return intlResponse;
});

export const config = {
  matcher: [
    // Skip Next.js internals, static files, and SEO files (sitemap, robots)
    '/((?!_next|sitemap\\.xml|robots\\.txt|ai\\.txt|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
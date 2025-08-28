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

export default clerkMiddleware(async (auth, req) => {
  // Skip internationalization for API routes
  if (isApiRoute(req)) {
    // Only handle authentication for API routes
    // Note: Most API routes handle their own auth, but we can add global protection here if needed
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
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { locales, defaultLocale } from './i18n.config';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed' // English URLs won't have /en prefix
});

// Define protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/bookings',
  '/settings'
];

// Define public routes that should never require authentication
const publicRoutes = [
  '/',
  '/artists',
  '/login',
  '/register',
  '/about',
  '/contact'
];

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // First, handle internationalization for all routes
  const intlResponse = intlMiddleware(req);
  
  // If intl middleware returns a redirect, respect it
  if (intlResponse && intlResponse.headers.get('location')) {
    return intlResponse;
  }

  // Remove locale prefix to check the actual route
  const pathnameWithoutLocale = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, '') || '/';

  // Check if it's a public route - if so, skip auth entirely
  const isPublicRoute = publicRoutes.some(route => {
    if (route === '/') {
      return pathnameWithoutLocale === '/';
    }
    return pathnameWithoutLocale === route || pathnameWithoutLocale.startsWith(route + '/');
  });

  // For public routes, just continue with intl response
  if (isPublicRoute) {
    return intlResponse;
  }

  // Check if it's a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathnameWithoutLocale.startsWith(route)
  );

  // For protected routes, check authentication
  if (isProtectedRoute) {
    const session = await auth();
    
    if (!session) {
      // Redirect to login if accessing protected route without auth
      const loginUrl = new URL('/login', req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Return the intl middleware response for all other cases
  return intlResponse;
}

export const config = {
  // Skip all paths that should not be internationalized or need auth
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
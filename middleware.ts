import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { locales, defaultLocale } from './i18n.config';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed' // English URLs won't have /en prefix
});

const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/bookings',
  '/settings'
];

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Check if it's a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.includes(route)
  );

  if (isProtectedRoute && !req.auth) {
    // Redirect to login if accessing protected route without auth
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Apply intl middleware for all routes
  return intlMiddleware(req);
})

export const config = {
  // Skip all paths that should not be internationalized or need auth
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
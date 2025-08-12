import createMiddleware from 'next-intl/middleware';
import { withAuth } from 'next-auth/middleware';
import { NextRequest, NextResponse } from 'next/server';
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

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if it's a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.includes(route)
  );

  if (isProtectedRoute) {
    // Apply auth middleware for protected routes
    return withAuth(request as any, {
      callbacks: {
        authorized: ({ token }) => !!token,
      },
      pages: {
        signIn: '/login',
      },
    });
  }

  // Apply only intl middleware for public routes
  return intlMiddleware(request);
}

export const config = {
  // Skip all paths that should not be internationalized or need auth
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
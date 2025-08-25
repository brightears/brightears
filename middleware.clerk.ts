import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/artists(.*)",
  "/search(.*)",
  "/how-it-works",
  "/corporate",
  "/api/health",
  "/api/artists(.*)",
  "/api/clerk-webhook",
  "/(en|th)/(.*)",
]);

// Define protected routes by role
const isArtistRoute = createRouteMatcher([
  "/dashboard/artist(.*)",
  "/api/artist(.*)",
]);

const isCustomerRoute = createRouteMatcher([
  "/dashboard/customer(.*)",
  "/bookings(.*)",
  "/favorites(.*)",
]);

const isCorporateRoute = createRouteMatcher([
  "/dashboard/corporate(.*)",
]);

const isAdminRoute = createRouteMatcher([
  "/dashboard/admin(.*)",
  "/api/admin(.*)",
]);

export default clerkMiddleware((auth, req) => {
  const { userId, sessionClaims } = auth();
  const { pathname } = req.nextUrl;

  // Allow public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Redirect to sign-in if not authenticated
  if (!userId) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Get user role from session claims
  const userRole = sessionClaims?.metadata?.role as string;

  // Check role-based access
  if (isArtistRoute(req) && userRole !== "ARTIST") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (isCustomerRoute(req) && userRole !== "CUSTOMER") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (isCorporateRoute(req) && userRole !== "CORPORATE") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (isAdminRoute(req) && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
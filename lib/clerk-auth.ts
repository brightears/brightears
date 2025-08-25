import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export type UserRole = "ARTIST" | "CUSTOMER" | "CORPORATE" | "ADMIN";

/**
 * Get the current authenticated user
 */
export async function getClerkUser() {
  return await currentUser();
}

/**
 * Get the current user's role from metadata
 */
export async function getUserRole(): Promise<UserRole | null> {
  const user = await currentUser();
  if (!user) return null;
  
  // Role should be stored in public metadata
  return user.publicMetadata?.role as UserRole || "CUSTOMER";
}

/**
 * Check if user has a specific role
 */
export async function hasRole(role: UserRole): Promise<boolean> {
  const userRole = await getUserRole();
  return userRole === role;
}

/**
 * Check if user has any of the specified roles
 */
export async function hasAnyRole(roles: UserRole[]): Promise<boolean> {
  const userRole = await getUserRole();
  return userRole ? roles.includes(userRole) : false;
}

/**
 * Require authentication - redirects to sign-in if not authenticated
 */
export async function requireAuth() {
  const { userId } = auth();
  
  if (!userId) {
    redirect("/sign-in");
  }
  
  return userId;
}

/**
 * Require specific role - redirects if user doesn't have the role
 */
export async function requireRole(role: UserRole) {
  const userId = await requireAuth();
  const userRole = await getUserRole();
  
  if (userRole !== role) {
    redirect("/dashboard");
  }
  
  return userId;
}

/**
 * Require any of the specified roles
 */
export async function requireAnyRole(roles: UserRole[]) {
  const userId = await requireAuth();
  const userRole = await getUserRole();
  
  if (!userRole || !roles.includes(userRole)) {
    redirect("/dashboard");
  }
  
  return userId;
}

/**
 * Check if the current user is an artist
 */
export async function isArtist(): Promise<boolean> {
  return hasRole("ARTIST");
}

/**
 * Check if the current user is a customer
 */
export async function isCustomer(): Promise<boolean> {
  return hasRole("CUSTOMER");
}

/**
 * Check if the current user is corporate
 */
export async function isCorporate(): Promise<boolean> {
  return hasRole("CORPORATE");
}

/**
 * Check if the current user is an admin
 */
export async function isAdmin(): Promise<boolean> {
  return hasRole("ADMIN");
}

/**
 * Get the sign-in URL with redirect
 */
export function getSignInUrl(redirectUrl?: string): string {
  const url = new URL("/sign-in", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000");
  if (redirectUrl) {
    url.searchParams.set("redirect_url", redirectUrl);
  }
  return url.toString();
}

/**
 * Get the sign-up URL with redirect
 */
export function getSignUpUrl(redirectUrl?: string): string {
  const url = new URL("/sign-up", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000");
  if (redirectUrl) {
    url.searchParams.set("redirect_url", redirectUrl);
  }
  return url.toString();
}
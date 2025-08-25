"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";

export function useClerkUser() {
  const { user, isLoaded, isSignedIn } = useUser();
  const convexUser = useQuery(api.users.getCurrentUser);
  const updateLastActive = useMutation(api.users.updateLastActive);

  // Update last active timestamp
  useEffect(() => {
    if (isSignedIn && convexUser) {
      const interval = setInterval(() => {
        updateLastActive();
      }, 60000); // Update every minute

      return () => clearInterval(interval);
    }
  }, [isSignedIn, convexUser, updateLastActive]);

  return {
    clerkUser: user,
    convexUser,
    isLoaded,
    isSignedIn,
    role: convexUser?.role,
    isArtist: convexUser?.role === "ARTIST",
    isCustomer: convexUser?.role === "CUSTOMER",
    isCorporate: convexUser?.role === "CORPORATE",
    isAdmin: convexUser?.role === "ADMIN",
    profile: convexUser?.profile,
  };
}
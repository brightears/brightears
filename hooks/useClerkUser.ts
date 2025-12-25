"use client";

import { useUser } from "@clerk/nextjs";

export function useClerkUser() {
  const { user, isLoaded, isSignedIn } = useUser();


  return {
    clerkUser: user,
    isLoaded,
    isSignedIn,
  };
}
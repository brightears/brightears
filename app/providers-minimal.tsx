"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";

export function ProvidersMinimal({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
    >
      <ThemeProvider attribute="class" defaultTheme="light">
        {children}
      </ThemeProvider>
    </ClerkProvider>
  );
}
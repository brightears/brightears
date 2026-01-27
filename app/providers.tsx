"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: "#00bbe4", // Brand cyan
          colorText: "#1F2937",
          colorTextSecondary: "#6B7280",
          colorBackground: "#FFFFFF",
          colorInputBackground: "#F9FAFB",
          colorInputText: "#1F2937",
          borderRadius: "0.5rem",
          fontFamily: "Inter, system-ui, sans-serif",
        },
        elements: {
          formButtonPrimary:
            "bg-brand-cyan hover:bg-brand-cyan/90 text-white transition-colors",
          card: "shadow-lg",
          formFieldInput:
            "border-gray-300 focus:border-brand-cyan focus:ring-brand-cyan",
          footerActionLink:
            "text-brand-cyan hover:text-brand-cyan/80",
          identityPreviewText:
            "text-gray-700",
          identityPreviewEditButton:
            "text-brand-cyan hover:text-brand-cyan/80",
          formFieldLabel:
            "text-gray-700 font-medium",
          phoneInputBox:
            "border-gray-300 focus:border-brand-cyan",
          formFieldSuccessText:
            "text-green-600",
          formFieldErrorText:
            "text-red-600",
          otpCodeFieldInput:
            "border-gray-300 focus:border-brand-cyan",
          formResendCodeLink:
            "text-brand-cyan hover:text-brand-cyan/80",
          headerTitle:
            "text-2xl font-bold text-gray-900",
          headerSubtitle:
            "text-gray-600",
          socialButtonsBlockButton:
            "border-gray-300 hover:bg-gray-50",
          dividerLine:
            "bg-gray-200",
          dividerText:
            "text-gray-500",
          // Hide sign-up footer for B2B invite-only portal
          footerAction: "hidden",
        },
        layout: {
          socialButtonsPlacement: "top",
          socialButtonsVariant: "blockButton",
        },
      }}
      localization={{
        locale: "en-US",
      }}
    >
      <ThemeProvider attribute="class" defaultTheme="light">
        {children}
      </ThemeProvider>
    </ClerkProvider>
  );
}

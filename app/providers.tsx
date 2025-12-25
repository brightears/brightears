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
          colorPrimary: "#8B5CF6", // Purple to match your brand
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
            "bg-purple-600 hover:bg-purple-700 text-white transition-colors",
          card: "shadow-lg",
          formFieldInput: 
            "border-gray-300 focus:border-purple-500 focus:ring-purple-500",
          footerActionLink: 
            "text-purple-600 hover:text-purple-700",
          identityPreviewText: 
            "text-gray-700",
          identityPreviewEditButton: 
            "text-purple-600 hover:text-purple-700",
          formFieldLabel: 
            "text-gray-700 font-medium",
          phoneInputBox: 
            "border-gray-300 focus:border-purple-500",
          formFieldSuccessText: 
            "text-green-600",
          formFieldErrorText: 
            "text-red-600",
          otpCodeFieldInput: 
            "border-gray-300 focus:border-purple-500",
          formResendCodeLink: 
            "text-purple-600 hover:text-purple-700",
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
        },
        layout: {
          socialButtonsPlacement: "top",
          socialButtonsVariant: "blockButton",
        },
      }}
      localization={{
        // Thai language support
        locale: "en-US", // Can be changed to "th-TH" when Thai is needed
      }}
    >
      <ThemeProvider attribute="class" defaultTheme="light">
        {children}
      </ThemeProvider>
    </ClerkProvider>
  );
}
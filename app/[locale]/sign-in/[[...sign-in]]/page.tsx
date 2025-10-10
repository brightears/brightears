import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-cyan-50">
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-xl",
            footer: "hidden", // Hide development mode badge
            formButtonPrimary: "bg-brand-cyan hover:bg-deep-teal",
            headerTitle: "text-dark-gray",
            headerSubtitle: "text-gray-600",
          },
          layout: {
            socialButtonsPlacement: "bottom",
            socialButtonsVariant: "iconButton",
          },
        }}
        signUpUrl="/sign-up"
        fallbackRedirectUrl="/dashboard"
      />
    </div>
  );
}
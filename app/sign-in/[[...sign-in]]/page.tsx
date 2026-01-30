import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-deep-teal to-deep-teal/80 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-playfair font-bold text-white">
            Welcome Back
          </h1>
          <p className="mt-2 text-white/70">
            Sign in to access your dashboard
          </p>
        </div>

        <SignIn
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-xl border-0 bg-white/95 backdrop-blur-sm",
              headerTitle: "text-deep-teal",
              headerSubtitle: "text-gray-600",
              formButtonPrimary: "bg-brand-cyan hover:bg-brand-cyan/90",
              formFieldInput: "border-gray-300 focus:border-brand-cyan focus:ring-brand-cyan",
              footerActionLink: "text-brand-cyan hover:text-brand-cyan/80",
            },
          }}
          forceRedirectUrl="/en/admin"
        />

        <div className="mt-6 text-center">
          <p className="text-sm text-white/60">
            Need access? Contact{" "}
            <a
              href="mailto:support@brightears.io"
              className="text-brand-cyan hover:text-brand-cyan/80"
            >
              support@brightears.io
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

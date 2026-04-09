import { SignUp } from "@clerk/nextjs";

export default function VenueSignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#131313] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-playfair font-bold text-white">
            Register Your Venue
          </h1>
          <p className="mt-2 text-[#bcc8ce]">
            List your venue and discover entertainment — free.
          </p>
        </div>

        <SignUp
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-xl border-0 bg-white/95 backdrop-blur-sm",
              headerTitle: "text-[#003543]",
              headerSubtitle: "text-gray-600",
              formButtonPrimary: "bg-[#4fd6ff] hover:bg-[#00bbe4] text-[#003543]",
              formFieldInput: "border-gray-300 focus:border-[#4fd6ff] focus:ring-[#4fd6ff]",
              footerActionLink: "text-[#4fd6ff] hover:text-[#00bbe4]",
            },
          }}
          forceRedirectUrl="/venue-onboarding"
        />

        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-[#bcc8ce]">
            Already have an account?{" "}
            <a href="/sign-in" className="text-[#4fd6ff] hover:text-[#00bbe4]">
              Sign in
            </a>
          </p>
          <p className="text-sm text-[#bcc8ce]">
            Are you an artist?{" "}
            <a href="/sign-up" className="text-[#4fd6ff] hover:text-[#00bbe4]">
              Join as an artist
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

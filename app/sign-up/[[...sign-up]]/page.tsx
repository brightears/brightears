import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Your Account</h1>
          <p className="mt-2 text-gray-600">
            Join Bright Ears to book amazing entertainment
          </p>
        </div>
        
        <SignUp
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-xl border-0",
              formFieldInput: "border-gray-300",
              formButtonPrimary: "bg-purple-600 hover:bg-purple-700",
            },
          }}
          fallbackRedirectUrl="/register/choice"
          signInUrl="/sign-in"
        />
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gradient-to-br from-purple-50 to-pink-50 text-gray-500">
                Account Types
              </span>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-1 gap-3">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Customer:</span> Book artists for events
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Artist:</span> Showcase your talent
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Corporate:</span> Manage business bookings
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
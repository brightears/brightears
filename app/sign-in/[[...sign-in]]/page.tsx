import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p className="mt-2 text-gray-600">
            Sign in to access your Bright Ears account
          </p>
        </div>
        
        <SignIn
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-xl border-0",
            },
          }}
          redirectUrl="/dashboard"
          signUpUrl="/sign-up"
        />
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Are you an artist?{" "}
            <a
              href="/artist-login"
              className="font-medium text-purple-600 hover:text-purple-500"
            >
              Use temporary artist login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  const lineEnabled = !!process.env.LINE_LOGIN_CHANNEL_ID;

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

        {lineEnabled && (
          <div className="mb-6">
            <a
              href="/api/auth/line/start?role=ARTIST"
              className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-lg bg-[#06C755] hover:bg-[#05B04A] text-white font-bold shadow-lg transition-all"
              aria-label="Continue with LINE"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 10.304c0-5.369-5.383-9.738-12-9.738S0 4.935 0 10.304c0 4.814 4.269 8.846 10.036 9.608.391.084.923.258 1.058.592.121.303.079.778.039 1.085l-.171 1.027c-.053.303-.242 1.186 1.039.647 1.281-.54 6.911-4.069 9.428-6.967C23.163 14.386 24 12.451 24 10.304zM7.822 13.13H5.438a.5.5 0 0 1-.5-.5V7.87a.5.5 0 1 1 1 0v4.26h1.884a.5.5 0 1 1 0 1zm1.836-.5a.5.5 0 0 1-1 0V7.87a.5.5 0 1 1 1 0v4.76zm5.6 0a.5.5 0 0 1-.4.49.5.5 0 0 1-.1.01.5.5 0 0 1-.41-.21l-2.44-3.32v3.02a.5.5 0 1 1-1 0V7.87a.5.5 0 0 1 .4-.49.5.5 0 0 1 .51.2l2.44 3.32V7.87a.5.5 0 1 1 1 0v4.76zm3.372-2.88a.5.5 0 0 1 0 1H16.94v.88h1.69a.5.5 0 1 1 0 1h-2.19a.5.5 0 0 1-.5-.5V7.87a.5.5 0 0 1 .5-.5h2.19a.5.5 0 1 1 0 1H16.94v.88h1.69z" />
              </svg>
              Continue with LINE
            </a>
            <p className="text-center text-xs text-white/40 mt-3">
              Faster for Thai users — one tap, no email required
            </p>
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-white/20" />
              <span className="text-xs text-white/40 uppercase tracking-widest">or</span>
              <div className="flex-1 h-px bg-white/20" />
            </div>
          </div>
        )}

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
          forceRedirectUrl="/en/auth-redirect"
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

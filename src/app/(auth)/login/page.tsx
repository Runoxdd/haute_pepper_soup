import { signIn } from "@/lib/auth";
import Link from "next/link";

// searchParams is read at runtime → must not be statically prerendered
export const dynamic = "force-dynamic";

// Auth.js error code → human-readable message
const AUTH_ERRORS: Record<string, string> = {
  Configuration:
    "Server configuration error. Check AUTH_SECRET and AUTH_URL env vars on Vercel.",
  AccessDenied: "Access was denied. Your account may not be authorised.",
  OAuthSignin:
    "Could not start Google sign-in. Check AUTH_GOOGLE_ID is set correctly on Vercel.",
  OAuthCallback:
    "Google returned an error. Make sure the Authorized Redirect URI in Google Cloud Console is: [your-site]/api/auth/callback/google",
  OAuthCreateAccount:
    "Could not create your account. Check MONGODB_URI is set and your MongoDB cluster allows connections from anywhere (0.0.0.0/0).",
  Default: "An unexpected sign-in error occurred. Check Vercel function logs for details.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const { callbackUrl, error } = await searchParams;
  const errorMessage = error ? (AUTH_ERRORS[error] ?? AUTH_ERRORS.Default) : null;

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#FAFAF9] dark:bg-[#0A0A0A] px-4">
      <div className="w-full max-w-sm space-y-8">
        {/* Error banner — shown when Auth.js redirects back with ?error= */}
        {errorMessage && (
          <div role="alert" className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 px-4 py-3">
            <p className="text-sm font-semibold text-red-700 dark:text-red-400">Sign-in failed</p>
            <p className="mt-1 text-xs text-red-600 dark:text-red-300">{errorMessage}</p>
            {error && <p className="mt-1 text-xs text-red-400 dark:text-red-500">Error code: {error}</p>}
          </div>
        )}
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Sign in to Haute Pepper Soup
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-white/60">
            Order premium pepper soup, delivered to your door.
          </p>
        </div>

        {/* Auth buttons */}
        <div className="space-y-3">
          {/* Google — primary */}
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: callbackUrl ?? "/menu" });
            }}
          >
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-white dark:bg-white px-4 py-3 text-sm font-semibold text-[#0A0A0A] shadow-sm border border-gray-200 dark:border-transparent transition-colors hover:bg-gray-50 dark:hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-brand-dark"
            >
              <GoogleIcon />
              Continue with Google
            </button>
          </form>

          {/* Facebook — secondary */}
          <form
            action={async () => {
              "use server";
              await signIn("facebook", { redirectTo: callbackUrl ?? "/menu" });
            }}
          >
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 px-4 py-3 text-sm font-semibold text-gray-700 dark:text-white transition-colors hover:bg-gray-100 dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-brand-dark"
            >
              <FacebookIcon />
              Continue with Facebook
            </button>
          </form>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200 dark:bg-white/10" />
          <span className="text-xs text-gray-400 dark:text-white/40">or</span>
          <div className="h-px flex-1 bg-gray-200 dark:bg-white/10" />
        </div>

        {/* Guest link */}
        <Link
          href="/menu"
          className="block w-full rounded-xl border border-gray-200 dark:border-white/10 px-4 py-3 text-center text-sm font-medium text-gray-500 dark:text-white/70 transition-colors hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-700 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-brand-dark"
        >
          Continue as Guest
        </Link>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-400 dark:text-white/30">
          By signing in, you agree to our{" "}
          <a href="/terms" className="underline hover:text-text-primary transition-colors">terms of service</a>
          {" "}and{" "}
          <a href="/privacy" className="underline hover:text-text-primary transition-colors">privacy policy</a>.
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Inline SVG icons (avoids external dependency)
// ---------------------------------------------------------------------------

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11.96 11.96 0 0 0 0 12c0 1.94.46 3.77 1.28 5.41l3.56-2.77v-.55Z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z"
        fill="#EA4335"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#1877F2" aria-hidden="true">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.025 4.388 11.025 10.125 11.927v-8.437H7.078v-3.49h3.047V9.41c0-3.026 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.971H15.83c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796v8.437C19.612 23.098 24 18.098 24 12.073Z" />
    </svg>
  );
}

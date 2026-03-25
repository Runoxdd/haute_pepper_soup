import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AccessDeniedPage() {
  const session = await auth();

  // If not logged in at all, go to login
  if (!session?.user) {
    redirect("/login?callbackUrl=/admin");
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-8 w-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          />
        </svg>
      </div>
      
      <h1 className="font-serif text-3xl font-bold tracking-tight text-text-primary">
        Access Denied
      </h1>
      
      <p className="mt-4 max-w-md text-text-secondary">
        You are signed in as <span className="font-semibold text-text-primary">{session.user.email}</span>, 
        but this account does not have administrator permissions.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="rounded-xl bg-brand-lemon-dark dark:bg-brand-lemon px-6 py-3 text-sm font-semibold text-white dark:text-brand-dark shadow-sm transition-colors hover:opacity-90"
        >
          Back to Home
        </Link>
        <Link
          href="/login"
          className="rounded-xl border border-gray-200 dark:border-white/10 px-6 py-3 text-sm font-semibold text-text-primary transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
        >
          Sign in with another account
        </Link>
      </div>

      <div className="mt-12 text-xs text-text-muted">
        <p>If this is your admin email, check your <code className="rounded bg-gray-100 dark:bg-white/5 px-1 py-0.5">ADMIN_EMAILS</code> environment variable on Vercel.</p>
      </div>
    </div>
  );
}

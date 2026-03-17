"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
      <div className="mx-auto max-w-md">
        {/* Error icon */}
        <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10">
          <svg
            className="h-10 w-10 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>

        <h1 className="font-serif text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          Something went wrong
        </h1>
        <p className="mt-4 text-base leading-relaxed text-text-secondary">
          We hit an unexpected error. Please try again, and if the problem
          persists, reach out to us on WhatsApp.
        </p>

        {/* Error digest for debugging (only shown in dev or for support) */}
        {error.digest && (
          <p className="mt-3 text-xs text-text-muted">
            Error ID: {error.digest}
          </p>
        )}

        <button
          onClick={reset}
          className="mt-8 inline-flex h-14 items-center justify-center rounded-full bg-brand-lemon px-10 text-base font-semibold dark:text-[#0A0A0A] transition-transform hover:scale-[1.03] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-brand-dark"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

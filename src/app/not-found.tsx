import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
      <div className="mx-auto max-w-md">
        {/* Decorative 404 */}
        <div className="relative mb-8">
          <span className="font-serif text-[8rem] font-bold leading-none tracking-tighter text-gray-100 dark:text-[rgba(255,255,255,0.04)] sm:text-[10rem]">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="h-16 w-16 text-gray-300 dark:text-[rgba(255,255,255,0.15)]"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
              />
            </svg>
          </div>
        </div>

        <h1 className="font-serif text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          This page doesn&rsquo;t exist
        </h1>
        <p className="mt-4 text-base leading-relaxed text-text-secondary">
          The page you&rsquo;re looking for may have been moved or no longer
          exists. Let&rsquo;s get you back to something delicious.
        </p>

        <Link
          href="/menu"
          className="mt-8 inline-flex h-14 items-center justify-center rounded-full bg-brand-lemon px-10 text-base font-semibold dark:text-[#0A0A0A] transition-transform hover:scale-[1.03] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-brand-dark"
        >
          Back to Menu
        </Link>
      </div>
    </div>
  );
}

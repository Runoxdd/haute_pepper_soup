import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin";
import { isMockMode } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: {
    default: "Admin Panel",
    template: "%s | Admin | Haute Pepper Soup",
  },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Skip auth in mock mode so admin can be previewed without MongoDB/OAuth
  if (!isMockMode()) {
    const { auth } = await import("@/lib/auth");
    const session = await auth();
    
    if (!session?.user?.email) {
      redirect("/login?callbackUrl=/admin");
    }

    if (!isAdmin(session.user.email)) {
      redirect("/admin/access-denied");
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9] dark:bg-[#0A0A0A]">
      {/* Admin top bar */}
      <nav aria-label="Admin navigation" className="border-b border-gray-200 dark:border-[rgba(255,255,255,0.08)] bg-white/50 dark:bg-[rgba(255,255,255,0.02)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-6">
            <Link
              href="/admin"
              className="font-serif text-lg font-bold tracking-tight text-text-primary"
            >
              Admin Panel
            </Link>
            <div className="hidden items-center gap-1 sm:flex">
              <Link
                href="/admin"
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-500 dark:text-[rgba(255,255,255,0.6)] transition-colors hover:bg-gray-100 dark:hover:bg-[rgba(255,255,255,0.05)] hover:text-gray-900 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon focus-visible:ring-offset-1 focus-visible:ring-offset-white dark:focus-visible:ring-offset-brand-dark"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/menu"
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-500 dark:text-[rgba(255,255,255,0.6)] transition-colors hover:bg-gray-100 dark:hover:bg-[rgba(255,255,255,0.05)] hover:text-gray-900 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon focus-visible:ring-offset-1 focus-visible:ring-offset-white dark:focus-visible:ring-offset-brand-dark"
              >
                Menu
              </Link>
              <Link
                href="/admin/orders"
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-500 dark:text-[rgba(255,255,255,0.6)] transition-colors hover:bg-gray-100 dark:hover:bg-[rgba(255,255,255,0.05)] hover:text-gray-900 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon focus-visible:ring-offset-1 focus-visible:ring-offset-white dark:focus-visible:ring-offset-brand-dark"
              >
                Orders
              </Link>
              <Link
                href="/admin/catering"
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-500 dark:text-[rgba(255,255,255,0.6)] transition-colors hover:bg-gray-100 dark:hover:bg-[rgba(255,255,255,0.05)] hover:text-gray-900 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon focus-visible:ring-offset-1 focus-visible:ring-offset-white dark:focus-visible:ring-offset-brand-dark"
              >
                Catering
              </Link>
            </div>
          </div>
          <Link
            href="/"
            className="text-xs font-medium text-gray-400 dark:text-[rgba(255,255,255,0.4)] transition-colors hover:text-gray-700 dark:hover:text-white"
          >
            &larr; Back to Site
          </Link>
        </div>

        {/* Mobile nav */}
        <div className="flex items-center gap-1 overflow-x-auto border-t border-gray-200 dark:border-[rgba(255,255,255,0.06)] px-6 py-2 sm:hidden">
          <Link
            href="/admin"
            className="shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-500 dark:text-[rgba(255,255,255,0.6)] transition-colors hover:bg-gray-100 dark:hover:bg-[rgba(255,255,255,0.05)] hover:text-gray-900 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon focus-visible:ring-offset-1 focus-visible:ring-offset-white dark:focus-visible:ring-offset-brand-dark"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/menu"
            className="shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-500 dark:text-[rgba(255,255,255,0.6)] transition-colors hover:bg-gray-100 dark:hover:bg-[rgba(255,255,255,0.05)] hover:text-gray-900 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon focus-visible:ring-offset-1 focus-visible:ring-offset-white dark:focus-visible:ring-offset-brand-dark"
          >
            Menu
          </Link>
          <Link
            href="/admin/orders"
            className="shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-500 dark:text-[rgba(255,255,255,0.6)] transition-colors hover:bg-gray-100 dark:hover:bg-[rgba(255,255,255,0.05)] hover:text-gray-900 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon focus-visible:ring-offset-1 focus-visible:ring-offset-white dark:focus-visible:ring-offset-brand-dark"
          >
            Orders
          </Link>
          <Link
            href="/admin/catering"
            className="shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-500 dark:text-[rgba(255,255,255,0.6)] transition-colors hover:bg-gray-100 dark:hover:bg-[rgba(255,255,255,0.05)] hover:text-gray-900 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon focus-visible:ring-offset-1 focus-visible:ring-offset-white dark:focus-visible:ring-offset-brand-dark"
          >
            Catering
          </Link>
        </div>
      </nav>

      {/* Admin content */}
      <main id="main-content" className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}

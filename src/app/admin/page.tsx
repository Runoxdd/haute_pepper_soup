import type { Metadata } from "next";
import Link from "next/link";
import { getDashboardStats } from "@/lib/data";
import { DashboardStats } from "@/components/admin/DashboardStats";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-text-primary">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Welcome back. Here&rsquo;s what&rsquo;s happening today.
        </p>
      </div>

      {/* Stats cards */}
      <DashboardStats
        todayOrders={stats.todayOrdersCount}
        todayRevenue={stats.todayRevenue}
        pendingCount={stats.pendingCount}
        failedNotifications={stats.failedNotificationsCount}
      />

      {/* Quick actions */}
      <div className="mt-10">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-text-muted">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link
            href="/admin/orders"
            className="glass-card flex items-center gap-4 rounded-xl p-5 transition-colors hover:border-gray-300 dark:hover:border-[rgba(255,255,255,0.2)]"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-lemon-dark/10 dark:bg-brand-lemon/10">
              <svg
                className="h-5 w-5 text-brand-lemon-dark dark:text-brand-lemon"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"
                />
              </svg>
            </div>
            <div>
              <p className="font-medium text-text-primary">View Orders</p>
              <p className="text-xs text-text-muted">
                Manage and track all customer orders
              </p>
            </div>
          </Link>

          <Link
            href="/admin/menu"
            className="glass-card flex items-center gap-4 rounded-xl p-5 transition-colors hover:border-gray-300 dark:hover:border-[rgba(255,255,255,0.2)]"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-lemon-dark/10 dark:bg-brand-lemon/10">
              <svg
                className="h-5 w-5 text-brand-lemon-dark dark:text-brand-lemon"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="font-medium text-text-primary">Edit Menu</p>
              <p className="text-xs text-text-muted">
                Add, edit, or deactivate dishes
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

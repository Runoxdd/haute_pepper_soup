"use client";

import GlassCard from "@/components/ui/GlassCard";
import { formatNGN } from "@/lib/format";

interface DashboardStatsProps {
  todayOrders: number;
  todayRevenue: number;
  pendingCount: number;
  failedNotifications: number;
}

/**
 * Admin dashboard stat cards.
 *
 * Displays today's orders, pending orders, today's revenue,
 * and a prominent red warning banner if any orders have failed
 * notifications (unnotified orders).
 *
 * Glass card styling with responsive grid layout.
 */
export { DashboardStats };
export default function DashboardStats({
  todayOrders,
  todayRevenue,
  pendingCount,
  failedNotifications,
}: DashboardStatsProps) {
  const stats = [
    {
      label: "Today's Orders",
      value: todayOrders.toString(),
      icon: (
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
            d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
          />
        </svg>
      ),
      accent: "bg-brand-lemon-dark/10 dark:bg-brand-lemon/10",
    },
    {
      label: "Pending",
      value: pendingCount.toString(),
      icon: (
        <svg
          className="h-5 w-5 text-status-pending"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      accent: "bg-status-pending/10",
    },
    {
      label: "Revenue Today",
      value: formatNGN(todayRevenue),
      icon: (
        <svg
          className="h-5 w-5 text-status-completed"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
          />
        </svg>
      ),
      accent: "bg-status-completed/10",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Unnotified Orders Warning */}
      {failedNotifications > 0 && (
        <div
          className="flex items-center gap-3 rounded-xl border border-status-failed/30 bg-status-failed/10 px-5 py-4"
          role="alert"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-status-failed/20">
            <svg
              className="h-5 w-5 text-status-failed"
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
          <div>
            <p className="font-semibold text-status-failed">
              UNNOTIFIED ORDERS
            </p>
            <p className="text-sm text-status-failed/80">
              {failedNotifications} order{failedNotifications !== 1 ? "s" : ""}{" "}
              failed to send email notification. Check the orders page and
              resend.
            </p>
          </div>
        </div>
      )}

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <GlassCard key={stat.label} hover className="p-5">
            <div className="flex items-start gap-4">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${stat.accent}`}
              >
                {stat.icon}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-text-muted">
                  {stat.label}
                </p>
                <p className="tabular-nums mt-1 text-2xl font-bold text-text-primary">
                  {stat.value}
                </p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

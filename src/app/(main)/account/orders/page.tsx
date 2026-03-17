import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getUserOrders } from "@/lib/data";
import { formatNGN } from "@/lib/format";

export const metadata: Metadata = {
  title: "My Orders",
  description: "View your Haute Pepper Soup order history.",
  robots: { index: false, follow: false },
};

const statusLabels: Record<string, { text: string; className: string }> = {
  pending: {
    text: "Pending",
    className: "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30",
  },
  contacted: {
    text: "Contacted",
    className: "bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30",
  },
  completed: {
    text: "Completed",
    className: "bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30",
  },
};

export default async function UserOrdersPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { orders } = await getUserOrders(session.user.id);

  return (
    <div className="px-6 pb-24 pt-8 sm:pt-12">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          My Orders
        </h1>
        <p className="mt-2 text-text-secondary">
          Your order history with Haute Pepper Soup.
        </p>

        {orders.length === 0 ? (
          /* ── Empty state ──────────────────────────────────────────── */
          <div className="mt-16 text-center">
            <div className="mb-4 text-5xl" aria-hidden="true">
              <span className="opacity-30">&#127858;</span>
            </div>
            <h2 className="text-xl font-semibold text-text-primary">No orders yet</h2>
            <p className="mt-2 text-sm text-text-secondary">
              Browse our menu and place your first order!
            </p>
            <Link
              href="/menu"
              className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-brand-lemon px-8 text-sm font-semibold text-brand-dark transition-transform hover:scale-[1.03] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lemon focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-brand-dark"
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          /* ── Order list ───────────────────────────────────────────── */
          <div className="mt-8 space-y-4">
            {orders.map((order) => {
              const status =
                statusLabels[order.status] ?? statusLabels.pending;
              const date = new Date(order.created_at);

              return (
                <Link
                  key={order._id.toString()}
                  href={`/order/${order.reference}`}
                  className="glass-card group block rounded-xl p-5 transition-colors hover:border-gray-300 dark:hover:border-[rgba(255,255,255,0.2)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <span className="font-serif text-lg font-bold tracking-tight text-text-primary">
                          {order.reference}
                        </span>
                        <span
                          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${status.className}`}
                        >
                          {status.text}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-text-muted">
                        {date.toLocaleDateString("en-NG", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}{" "}
                        &middot;{" "}
                        {order.items.length}{" "}
                        {order.items.length === 1 ? "item" : "items"}
                      </p>
                    </div>
                    <span className="tabular-nums text-lg font-semibold text-brand-lemon-dark dark:text-brand-lemon">
                      {formatNGN(order.total_price)}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

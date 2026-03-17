"use client";

import { useState, useCallback, useEffect } from "react";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { formatNGN, formatDate } from "@/lib/format";
import type { OrderStatus } from "@/types";

// ─── Types ───────────────────────────────────────────────────────────────────

interface OrderItemData {
  menu_item_id: string;
  menu_item_name: string;
  side: string;
  quantity: number;
  unit_price: number;
}

interface OrderData {
  _id: string;
  reference: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  address: string;
  notes?: string;
  items: OrderItemData[];
  total_price: number;
  status: OrderStatus;
  notification_status: string;
  party_service_inquiry: boolean;
  created_at: string;
  updated_at: string;
}

interface OrdersResponse {
  orders: OrderData[];
  total: number;
  page: number;
  totalPages: number;
}

interface OrderTableProps {
  initialData: OrdersResponse;
}

type FilterTab = "all" | "pending" | "contacted" | "completed";

// ─── Status Badge ────────────────────────────────────────────────────────────

const statusConfig: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-status-pending/15 text-status-pending border-status-pending/30",
  },
  contacted: {
    label: "Contacted",
    className: "bg-status-contacted/15 text-status-contacted border-status-contacted/30",
  },
  completed: {
    label: "Completed",
    className: "bg-status-completed/15 text-status-completed border-status-completed/30",
  },
};

function StatusBadge({ status }: { status: OrderStatus }) {
  const config = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${config.className}`}
    >
      {config.label}
    </span>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * Admin order management table with pagination, status filters,
 * search, date range filtering, expandable rows, and action buttons.
 *
 * 20 orders per page. Filter tabs: All | Pending | Contacted | Completed.
 * Each row shows: reference, customer name, phone, items count, total,
 * status badge, and time ago. Actions: Mark Contacted, Mark Completed,
 * Resend Notification.
 */
export { OrderTable };
export default function OrderTable({ initialData }: OrderTableProps) {
  const [data, setData] = useState<OrdersResponse>(initialData);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // ─── Fetch orders ──────────────────────────────────────────────────────

  const fetchOrders = useCallback(
    async (page: number, tab: FilterTab, search: string, from: string, to: string) => {
      setLoading(true);

      const params = new URLSearchParams();
      params.set("page", page.toString());
      params.set("limit", "20");
      if (tab !== "all") params.set("status", tab);
      if (search.trim()) params.set("search", search.trim());
      if (from) params.set("date_from", from);
      if (to) params.set("date_to", to);

      try {
        const res = await fetch(`/api/admin/orders?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch orders");
        const newData: OrdersResponse = await res.json();
        setData(newData);
      } catch {
        // Keep existing data on error
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Refetch when filters change
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchOrders(currentPage, activeTab, searchQuery, dateFrom, dateTo);
    }, 300); // Debounce search input

    return () => clearTimeout(timeout);
  }, [currentPage, activeTab, searchQuery, dateFrom, dateTo, fetchOrders]);

  // ─── Status update ─────────────────────────────────────────────────────

  const updateOrderStatus = useCallback(
    async (orderId: string, newStatus: OrderStatus) => {
      setActionLoading(orderId);
      try {
        const res = await fetch(`/api/admin/orders/${orderId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        });

        if (!res.ok) throw new Error("Status update failed");

        // Optimistic update
        setData((prev) => ({
          ...prev,
          orders: prev.orders.map((o) =>
            o._id === orderId
              ? { ...o, status: newStatus, updated_at: new Date().toISOString() }
              : o,
          ),
        }));
      } catch {
        // Could add per-row error feedback
      } finally {
        setActionLoading(null);
      }
    },
    [],
  );

  // ─── Resend notification ───────────────────────────────────────────────

  const resendNotification = useCallback(async (orderId: string) => {
    setActionLoading(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/resend`, {
        method: "POST",
      });

      if (!res.ok) throw new Error("Resend failed");

      // Update notification status optimistically
      setData((prev) => ({
        ...prev,
        orders: prev.orders.map((o) =>
          o._id === orderId
            ? { ...o, notification_status: "sent" }
            : o,
        ),
      }));
    } catch {
      // Could show inline error
    } finally {
      setActionLoading(null);
    }
  }, []);

  // ─── Tab change ────────────────────────────────────────────────────────

  const handleTabChange = useCallback((tab: FilterTab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  }, []);

  // ─── Render ────────────────────────────────────────────────────────────

  const filterTabs: { key: FilterTab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "contacted", label: "Contacted" },
    { key: "completed", label: "Completed" },
  ];

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1 rounded-xl border border-glass-border bg-glass-bg p-1">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => handleTabChange(tab.key)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon focus-visible:ring-offset-1 focus-visible:ring-offset-white dark:ring-offset-brand-dark ${
              activeTab === tab.key
                ? "bg-brand-lemon-dark/10 dark:bg-brand-lemon/10 text-brand-lemon-dark dark:text-brand-lemon"
                : "text-text-secondary hover:text-text-primary hover:bg-glass-hover"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search + Date Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by reference, name, or phone\u2026"
            aria-label="Search orders"
            className="w-full rounded-xl border border-glass-border bg-glass-bg py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-muted transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:ring-offset-brand-dark"
          />
        </div>
        <div className="flex gap-2">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => {
              setDateFrom(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="Filter from date"
            className="rounded-xl border border-glass-border bg-glass-bg px-3 py-2.5 text-sm text-text-primary transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:ring-offset-brand-dark"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => {
              setDateTo(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="Filter to date"
            className="rounded-xl border border-glass-border bg-glass-bg px-3 py-2.5 text-sm text-text-primary transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:ring-offset-brand-dark"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto rounded-xl border border-glass-border">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-glass-border bg-glass-bg">
              <th className="px-4 py-3 font-medium text-text-muted">Ref</th>
              <th className="px-4 py-3 font-medium text-text-muted">Customer</th>
              <th className="hidden px-4 py-3 font-medium text-text-muted sm:table-cell">Phone</th>
              <th className="hidden px-4 py-3 font-medium text-text-muted md:table-cell">Items</th>
              <th className="px-4 py-3 font-medium text-text-muted text-right">Total</th>
              <th className="px-4 py-3 font-medium text-text-muted">Status</th>
              <th className="hidden px-4 py-3 font-medium text-text-muted lg:table-cell">Time</th>
              <th className="px-4 py-3 font-medium text-text-muted text-right">Actions</th>
            </tr>
          </thead>
          <tbody className={loading ? "opacity-50 transition-opacity" : ""} aria-live="polite" aria-busy={loading}>
            {data.orders.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-text-muted">
                  No orders found matching your filters.
                </td>
              </tr>
            ) : (
              data.orders.map((order) => (
                <OrderRow
                  key={order._id}
                  order={order}
                  isExpanded={expandedOrder === order._id}
                  onToggleExpand={() =>
                    setExpandedOrder(
                      expandedOrder === order._id ? null : order._id,
                    )
                  }
                  onUpdateStatus={updateOrderStatus}
                  onResendNotification={resendNotification}
                  isActionLoading={actionLoading === order._id}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data.totalPages > 1 && (
        <div className="flex items-center justify-between px-1">
          <p className="text-sm text-text-muted">
            Page {data.page} of {data.totalPages} ({data.total} total)
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="!px-3 !py-1.5 !text-xs"
            >
              Previous
            </Button>
            <Button
              variant="ghost"
              disabled={currentPage >= data.totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="!px-3 !py-1.5 !text-xs"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Order Row ───────────────────────────────────────────────────────────────

interface OrderRowProps {
  order: OrderData;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onResendNotification: (orderId: string) => void;
  isActionLoading: boolean;
}

function OrderRow({
  order,
  isExpanded,
  onToggleExpand,
  onUpdateStatus,
  onResendNotification,
  isActionLoading,
}: OrderRowProps) {
  const [confirmComplete, setConfirmComplete] = useState(false);
  const itemsCount = order.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <>
      <tr
        className="border-b border-glass-border transition-colors hover:bg-glass-hover cursor-pointer"
        onClick={onToggleExpand}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggleExpand();
          }
        }}
        tabIndex={0}
        role="button"
        aria-expanded={isExpanded}
        aria-label={`Order ${order.reference}, ${order.customer_name}, ${order.status}. Press to ${isExpanded ? "collapse" : "expand"} details.`}
      >
        <td className="px-4 py-3">
          <span className="font-mono text-xs font-semibold text-brand-lemon-dark dark:text-brand-lemon">
            {order.reference}
          </span>
          {order.notification_status === "failed" && (
            <span
              className="ml-1.5 inline-block h-2 w-2 rounded-full bg-status-failed"
              title="Notification failed"
              role="img"
              aria-label="Notification failed"
            />
          )}
        </td>
        <td className="px-4 py-3 font-medium text-text-primary">
          {order.customer_name}
        </td>
        <td className="hidden px-4 py-3 text-text-secondary sm:table-cell">
          <a
            href={`tel:${order.customer_phone}`}
            onClick={(e) => e.stopPropagation()}
            className="hover:text-brand-lemon-dark dark:hover:text-brand-lemon transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon rounded"
          >
            {order.customer_phone}
          </a>
        </td>
        <td className="hidden px-4 py-3 tabular-nums text-text-secondary md:table-cell">
          {itemsCount}
        </td>
        <td className="px-4 py-3 tabular-nums font-semibold text-text-primary text-right">
          {formatNGN(order.total_price)}
        </td>
        <td className="px-4 py-3">
          <StatusBadge status={order.status} />
        </td>
        <td className="hidden px-4 py-3 text-xs text-text-muted lg:table-cell">
          {formatDate(new Date(order.created_at))}
        </td>
        <td className="px-4 py-3 text-right">
          <div
            className="flex items-center justify-end gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            {order.status === "pending" && (
              <Button
                variant="ghost"
                onClick={() => onUpdateStatus(order._id, "contacted")}
                loading={isActionLoading}
                className="!px-2 !py-1 !text-[11px]"
                aria-label={`Mark ${order.reference} as contacted`}
              >
                Contacted
              </Button>
            )}
            {order.status === "contacted" && (
              <Button
                variant="ghost"
                onClick={() => setConfirmComplete(true)}
                loading={isActionLoading}
                className="!px-2 !py-1 !text-[11px]"
                aria-label={`Mark ${order.reference} as completed`}
              >
                Complete
              </Button>
            )}
            {order.notification_status === "failed" && (
              <Button
                variant="ghost"
                onClick={() => onResendNotification(order._id)}
                loading={isActionLoading}
                className="!px-2 !py-1 !text-[11px] !text-status-failed"
                aria-label={`Resend notification for ${order.reference}`}
              >
                Resend
              </Button>
            )}
          </div>

          {/* Completion confirmation dialog */}
          <ConfirmDialog
            open={confirmComplete}
            variant="default"
            title="Complete Order"
            message={`Mark order ${order.reference} from ${order.customer_name} as completed? This action cannot be undone.`}
            confirmLabel="Mark Completed"
            cancelLabel="Cancel"
            loading={isActionLoading}
            onConfirm={() => {
              onUpdateStatus(order._id, "completed");
              setConfirmComplete(false);
            }}
            onCancel={() => setConfirmComplete(false)}
          />
        </td>
      </tr>

      {/* Expanded Details */}
      {isExpanded && (
        <tr className="border-b border-glass-border">
          <td colSpan={8} className="px-4 py-4">
            <GlassCard className="p-4 space-y-3">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Contact Info */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                    Customer Details
                  </h4>
                  <p className="text-sm text-text-primary">{order.customer_name}</p>
                  <p className="text-sm text-text-secondary">
                    <a
                      href={`tel:${order.customer_phone}`}
                      className="hover:text-brand-lemon-dark dark:hover:text-brand-lemon transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon rounded"
                    >
                      {order.customer_phone}
                    </a>
                  </p>
                  {order.customer_email && (
                    <p className="text-sm text-text-secondary">
                      {order.customer_email}
                    </p>
                  )}
                  <p className="text-sm text-text-secondary">{order.address}</p>
                  {order.notes && (
                    <p className="text-sm text-text-muted italic">
                      Note: {order.notes}
                    </p>
                  )}
                  {order.party_service_inquiry && (
                    <p className="text-xs font-medium text-brand-lemon-dark dark:text-brand-lemon">
                      Interested in catering / party service
                    </p>
                  )}
                </div>

                {/* Order Items */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                    Items
                  </h4>
                  <ul className="space-y-1.5">
                    {order.items.map((item, idx) => (
                      <li
                        key={`${item.menu_item_id}-${idx}`}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-text-primary">
                          {item.quantity}x {item.menu_item_name}
                          {item.side !== "None" && (
                            <span className="text-text-muted">
                              {" "}
                              ({item.side})
                            </span>
                          )}
                        </span>
                        <span className="tabular-nums text-text-secondary">
                          {formatNGN(item.unit_price * item.quantity)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between border-t border-glass-border pt-2">
                    <span className="text-sm font-semibold text-text-primary">
                      Total
                    </span>
                    <span className="tabular-nums text-sm font-bold text-brand-lemon-dark dark:text-brand-lemon">
                      {formatNGN(order.total_price)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions Row */}
              <div className="flex flex-wrap items-center gap-2 border-t border-glass-border pt-3">
                {order.status === "pending" && (
                  <Button
                    variant="primary"
                    onClick={() => onUpdateStatus(order._id, "contacted")}
                    loading={isActionLoading}
                    className="!text-xs"
                  >
                    Mark Contacted
                  </Button>
                )}
                {order.status === "contacted" && (
                  <Button
                    variant="secondary"
                    onClick={() => setConfirmComplete(true)}
                    loading={isActionLoading}
                    className="!text-xs"
                  >
                    Mark Completed
                  </Button>
                )}
                {order.notification_status === "failed" && (
                  <Button
                    variant="ghost"
                    onClick={() => onResendNotification(order._id)}
                    loading={isActionLoading}
                    className="!text-xs border-status-failed/30 text-status-failed hover:bg-status-failed/10"
                  >
                    Resend Notification
                  </Button>
                )}
                <span className="ml-auto text-xs text-text-muted">
                  Notification: {order.notification_status}
                </span>
              </div>
            </GlassCard>
          </td>
        </tr>
      )}
    </>
  );
}

/**
 * Data access layer with automatic mock data fallback.
 *
 * When MONGODB_URI is set: queries MongoDB.
 * When MONGODB_URI is NOT set: returns mock data for local preview.
 *
 * This lets `pnpm dev` show a working site without any external services.
 */

import {
  isMockMode,
  MOCK_DISHES,
  MOCK_ORDERS,
  MOCK_CATERING_SERVICES,
  getMockDashboardStats,
} from "./mock-data";

// ─── Menu Items ──────────────────────────────────────────────

export async function getActiveMenuItems() {
  if (isMockMode()) {
    return MOCK_DISHES.filter((d) => d.is_active);
  }

  const { getDb } = await import("./mongodb");
  const db = await getDb();
  return db
    .collection("menu_items")
    .find({ is_active: true })
    .sort({ category: 1, name: 1 })
    .toArray();
}

export async function getAllMenuItems() {
  if (isMockMode()) {
    return MOCK_DISHES;
  }

  const { getDb } = await import("./mongodb");
  const db = await getDb();
  return db
    .collection("menu_items")
    .find({})
    .sort({ is_active: -1, category: 1, name: 1 })
    .toArray();
}

export async function getMenuItemCount() {
  if (isMockMode()) {
    return MOCK_DISHES.length;
  }

  const { getDb } = await import("./mongodb");
  const db = await getDb();
  return db.collection("menu_items").countDocuments();
}

// ─── Orders ──────────────────────────────────────────────────

export async function getOrderByReference(reference: string) {
  if (isMockMode()) {
    return MOCK_ORDERS.find((o) => o.reference === reference) ?? null;
  }

  const { getDb } = await import("./mongodb");
  const db = await getDb();
  return db.collection("orders").findOne({ reference });
}

export async function getUserOrders(userId: string, page = 1, limit = 20) {
  if (isMockMode()) {
    return {
      orders: MOCK_ORDERS.slice(0, limit),
      total: MOCK_ORDERS.length,
      page,
      totalPages: Math.ceil(MOCK_ORDERS.length / limit),
    };
  }

  const { getDb } = await import("./mongodb");
  const { ObjectId } = await import("mongodb");
  const db = await getDb();
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    db
      .collection("orders")
      .find({ user_id: new ObjectId(userId) })
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .toArray(),
    db
      .collection("orders")
      .countDocuments({ user_id: new ObjectId(userId) }),
  ]);

  return {
    orders,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

// ─── Admin Dashboard ─────────────────────────────────────────

export async function getDashboardStats() {
  if (isMockMode()) {
    return getMockDashboardStats();
  }

  const { getDb } = await import("./mongodb");
  const db = await getDb();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [todayOrders, pendingCount, failedNotificationsCount] =
    await Promise.all([
      db
        .collection("orders")
        .find({ created_at: { $gte: today } })
        .toArray(),
      db.collection("orders").countDocuments({ status: "pending" }),
      db
        .collection("orders")
        .countDocuments({ notification_status: "failed" }),
    ]);

  return {
    todayOrdersCount: todayOrders.length,
    pendingCount,
    todayRevenue: todayOrders.reduce(
      (sum: number, o) => sum + ((o as Record<string, unknown>).total_price as number ?? 0),
      0
    ),
    failedNotificationsCount,
  };
}

// ─── Catering Services ───────────────────────────────────────

export async function getActiveCateringServices() {
  if (isMockMode()) {
    return MOCK_CATERING_SERVICES.filter((s) => s.is_active).sort(
      (a, b) => a.sort_order - b.sort_order
    );
  }

  const { getDb } = await import("./mongodb");
  const db = await getDb();
  return db
    .collection("catering_services")
    .find({ is_active: true })
    .sort({ sort_order: 1 })
    .toArray();
}

export async function getAllCateringServices() {
  if (isMockMode()) {
    return MOCK_CATERING_SERVICES.sort((a, b) => a.sort_order - b.sort_order);
  }

  const { getDb } = await import("./mongodb");
  const db = await getDb();
  return db
    .collection("catering_services")
    .find({})
    .sort({ sort_order: 1 })
    .toArray();
}

// ─── Admin Orders ────────────────────────────────────────────

export async function getAdminOrders(params: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}) {
  const { page = 1, limit = 20, status, search } = params;

  if (isMockMode()) {
    let filtered = [...MOCK_ORDERS];
    if (status) filtered = filtered.filter((o) => o.status === status);
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.reference.toLowerCase().includes(q) ||
          o.customer_name.toLowerCase().includes(q) ||
          o.customer_phone.includes(q)
      );
    }
    return {
      orders: filtered.slice((page - 1) * limit, page * limit),
      total: filtered.length,
      page,
      totalPages: Math.ceil(filtered.length / limit),
    };
  }

  const { getDb } = await import("./mongodb");
  const db = await getDb();
  const skip = (page - 1) * limit;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filter: Record<string, any> = {};
  if (status) filter.status = status;
  if (search) {
    const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.$or = [
      { reference: { $regex: escaped, $options: "i" } },
      { customer_name: { $regex: escaped, $options: "i" } },
      { customer_phone: { $regex: escaped, $options: "i" } },
    ];
  }

  const [orders, total] = await Promise.all([
    db
      .collection("orders")
      .find(filter)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .toArray(),
    db.collection("orders").countDocuments(filter),
  ]);

  return {
    orders,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

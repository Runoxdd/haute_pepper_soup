import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";
import type { Filter, Document } from "mongodb";

/**
 * GET /api/admin/orders
 * Admin only — paginated order list with filters.
 *
 * Query params:
 *   page             — page number (default 1)
 *   limit            — items per page (default 20, max 100)
 *   status           — pending | contacted | completed
 *   date_from        — ISO date string (inclusive)
 *   date_to          — ISO date string (inclusive, end of day)
 *   notification_status — pending | sent | failed
 *   search           — searches reference, customer_name, customer_phone
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email || !isAdmin(session.user.email)) {
      return NextResponse.json(
        { error: "Unauthorized", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);

    // Pagination — guard against NaN from non-numeric input
    const rawPage = parseInt(searchParams.get("page") || "1", 10);
    const rawLimit = parseInt(searchParams.get("limit") || "20", 10);
    const page = Math.max(1, Number.isFinite(rawPage) ? rawPage : 1);
    const limit = Math.min(
      100,
      Math.max(1, Number.isFinite(rawLimit) ? rawLimit : 20)
    );
    const skip = (page - 1) * limit;

    // Build filter
    const filter: Filter<Document> = {};

    const status = searchParams.get("status");
    if (status && ["pending", "contacted", "completed"].includes(status)) {
      filter.status = status;
    }

    const notificationStatus = searchParams.get("notification_status");
    if (
      notificationStatus &&
      ["pending", "sent", "failed"].includes(notificationStatus)
    ) {
      filter.notification_status = notificationStatus;
    }

    const dateFrom = searchParams.get("date_from");
    const dateTo = searchParams.get("date_to");
    if (dateFrom || dateTo) {
      filter.created_at = {};
      if (dateFrom) {
        const from = new Date(dateFrom);
        if (!isNaN(from.getTime())) {
          (filter.created_at as Record<string, Date>).$gte = from;
        }
      }
      if (dateTo) {
        const to = new Date(dateTo);
        if (!isNaN(to.getTime())) {
          // Include the entire end day
          to.setHours(23, 59, 59, 999);
          (filter.created_at as Record<string, Date>).$lte = to;
        }
      }
      // Clean up empty date filter
      if (Object.keys(filter.created_at as object).length === 0) {
        delete filter.created_at;
      }
    }

    const search = searchParams.get("search")?.trim();
    if (search) {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [
        { reference: { $regex: escapedSearch, $options: "i" } },
        { customer_name: { $regex: escapedSearch, $options: "i" } },
        { customer_phone: { $regex: escapedSearch, $options: "i" } },
      ];
    }

    const db = await getDb();
    const collection = db.collection("orders");

    const [orders, total] = await Promise.all([
      collection
        .find(filter)
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      collection.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      orders,
      total,
      page,
      totalPages,
    });
  } catch (error) {
    console.error("GET /api/admin/orders error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders", code: "ORDERS_FETCH_ERROR" },
      { status: 500 }
    );
  }
}

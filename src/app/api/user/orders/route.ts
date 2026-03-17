import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { auth } from "@/lib/auth";

/**
 * GET /api/user/orders
 * Authenticated only — fetch personal order history, paginated, newest first.
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required", code: "UNAUTHENTICATED" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    // Guard against NaN from non-numeric input
    const rawPage = parseInt(searchParams.get("page") || "1", 10);
    const rawLimit = parseInt(searchParams.get("limit") || "20", 10);
    const page = Math.max(1, Number.isFinite(rawPage) ? rawPage : 1);
    const limit = Math.min(
      100,
      Math.max(1, Number.isFinite(rawLimit) ? rawLimit : 20)
    );
    const skip = (page - 1) * limit;

    const db = await getDb();
    const userId = new ObjectId(session.user.id);

    const [orders, total] = await Promise.all([
      db
        .collection("orders")
        .find({ user_id: userId })
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      db.collection("orders").countDocuments({ user_id: userId }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      orders,
      total,
      page,
      totalPages,
    });
  } catch (error) {
    console.error("GET /api/user/orders error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders", code: "ORDERS_FETCH_ERROR" },
      { status: 500 }
    );
  }
}

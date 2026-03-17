import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";
import { sendOrderNotification } from "@/lib/resend";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * POST /api/admin/orders/[id]/resend
 * Admin only — resend email notification for a specific order.
 */
export async function POST(_request: NextRequest, context: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user?.email || !isAdmin(session.user.email)) {
      return NextResponse.json(
        { error: "Unauthorized", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid order ID", code: "INVALID_ID" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const order = await db
      .collection("orders")
      .findOne({ _id: new ObjectId(id) });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found", code: "NOT_FOUND" },
        { status: 404 }
      );
    }

    // sendOrderNotification never throws — check the returned result directly
    const emailResult = await sendOrderNotification(order as import("@/types").Order);

    const newStatus = emailResult.success ? "sent" : "failed";

    await db.collection("orders").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          notification_status: newStatus,
          updated_at: new Date(),
        },
      }
    );

    if (emailResult.success) {
      return NextResponse.json({ success: true, notification_status: "sent" });
    }

    console.error("Failed to resend notification:", emailResult.error);
    return NextResponse.json(
      {
        error: "Failed to send notification email",
        code: "EMAIL_SEND_ERROR",
        details: { reason: emailResult.error },
      },
      { status: 502 }
    );
  } catch (error) {
    console.error("POST /api/admin/orders/[id]/resend error:", error);
    return NextResponse.json(
      {
        error: "Failed to resend notification",
        code: "RESEND_ERROR",
      },
      { status: 500 }
    );
  }
}

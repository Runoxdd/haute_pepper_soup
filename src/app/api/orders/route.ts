import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { createOrderSchema } from "@/lib/validators";
import { auth } from "@/lib/auth";
import { ensureUniqueReference } from "@/lib/references";
import { sendOrderNotification } from "@/lib/resend";

/**
 * POST /api/orders
 * Public (rate-limited in middleware) — create a new order.
 *
 * Critical path:
 * 1. Validate input with Zod
 * 2. Verify each menu item exists and is active
 * 3. Verify each side is in the menu item's available_sides
 * 4. Server-side price calculation (NEVER trust client)
 * 5. Generate unique reference (HP-XXXXX)
 * 6. Save order with embedded item snapshots
 * 7. Send email notification
 * 8. Return { reference, total_price }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          code: "VALIDATION_ERROR",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const db = await getDb();

    // Collect all unique menu item IDs from the order
    const menuItemIds = [...new Set(data.items.map((item) => item.menu_item_id))];
    const objectIds = menuItemIds.map((id) => new ObjectId(id));

    // Fetch all referenced menu items in a single query
    const menuItems = await db
      .collection("menu_items")
      .find({ _id: { $in: objectIds } })
      .toArray();

    const menuItemMap = new Map(
      menuItems.map((item) => [item._id.toString(), item])
    );

    // Validate each order item and build embedded snapshots
    const orderItems: Array<{
      menu_item_id: ObjectId;
      menu_item_name: string;
      side: string;
      quantity: number;
      unit_price: number;
    }> = [];

    for (const item of data.items) {
      const menuItem = menuItemMap.get(item.menu_item_id);

      if (!menuItem) {
        return NextResponse.json(
          {
            error: `Menu item not found: ${item.menu_item_id}`,
            code: "MENU_ITEM_NOT_FOUND",
          },
          { status: 400 }
        );
      }

      if (!menuItem.is_active) {
        return NextResponse.json(
          {
            error: `Menu item is no longer available: ${menuItem.name}`,
            code: "MENU_ITEM_INACTIVE",
          },
          { status: 400 }
        );
      }

      // Verify the selected side is allowed for this menu item
      const availableSides: string[] = menuItem.available_sides || [];
      if (!availableSides.includes(item.side)) {
        return NextResponse.json(
          {
            error: `Invalid side "${item.side}" for ${menuItem.name}. Available: ${availableSides.join(", ")}`,
            code: "INVALID_SIDE",
          },
          { status: 400 }
        );
      }

      orderItems.push({
        menu_item_id: new ObjectId(item.menu_item_id),
        menu_item_name: menuItem.name,
        side: item.side,
        quantity: item.quantity,
        unit_price: menuItem.price,
      });
    }

    // Server-side price calculation — NEVER trust client-submitted totals
    const totalPrice = orderItems.reduce(
      (sum, item) => sum + item.unit_price * item.quantity,
      0
    );

    // Generate unique order reference (HP-XXXXX)
    const reference = await ensureUniqueReference(db);

    // Attach user_id if authenticated
    let userId: ObjectId | null = null;
    try {
      const session = await auth();
      if (session?.user?.id) {
        userId = new ObjectId(session.user.id);
      }
    } catch {
      // Guest order — no session, that's fine
    }

    const now = new Date();
    const order = {
      reference,
      user_id: userId,
      customer_name: data.customer_name,
      customer_phone: data.customer_phone,
      customer_email: data.customer_email || null,
      address: data.address,
      notes: data.notes || null,
      items: orderItems,
      total_price: totalPrice,
      status: "pending" as const,
      notification_status: "pending" as const,
      party_service_inquiry: data.party_service_inquiry || false,
      location_meta: null,
      created_at: now,
      updated_at: now,
    };

    const result = await db.collection("orders").insertOne(order);

    // Send email notification — sendOrderNotification never throws,
    // it returns { success, error? } so we check the result directly.
    const emailResult = await sendOrderNotification({
      ...order,
      _id: result.insertedId,
    } as import("@/types").Order);

    const notificationStatus: "sent" | "failed" = emailResult.success
      ? "sent"
      : "failed";

    if (!emailResult.success) {
      console.error("Failed to send order notification email:", emailResult.error);
    }

    // Update the notification status on the saved order
    await db.collection("orders").updateOne(
      { _id: result.insertedId },
      { $set: { notification_status: notificationStatus } }
    );

    return NextResponse.json(
      { reference, total_price: totalPrice },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/orders error:", error);
    return NextResponse.json(
      { error: "Failed to create order", code: "ORDER_CREATE_ERROR" },
      { status: 500 }
    );
  }
}

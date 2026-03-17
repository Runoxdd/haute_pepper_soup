import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { updateMenuItemSchema } from "@/lib/validators";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * PATCH /api/menu/[id]
 * Admin only — update an existing menu item.
 */
export async function PATCH(request: NextRequest, context: RouteContext) {
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
        { error: "Invalid menu item ID", code: "INVALID_ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const parsed = updateMenuItemSchema.safeParse(body);

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

    const db = await getDb();
    const result = await db.collection("menu_items").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...parsed.data, updated_at: new Date() } },
      { returnDocument: "after" }
    );

    if (!result) {
      return NextResponse.json(
        { error: "Menu item not found", code: "NOT_FOUND" },
        { status: 404 }
      );
    }

    revalidatePath("/menu");

    return NextResponse.json(result);
  } catch (error) {
    console.error("PATCH /api/menu/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update menu item", code: "MENU_UPDATE_ERROR" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/menu/[id]
 * Admin only — soft-delete (set is_active: false).
 */
export async function DELETE(_request: NextRequest, context: RouteContext) {
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
        { error: "Invalid menu item ID", code: "INVALID_ID" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const result = await db.collection("menu_items").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { is_active: false, updated_at: new Date() } },
      { returnDocument: "after" }
    );

    if (!result) {
      return NextResponse.json(
        { error: "Menu item not found", code: "NOT_FOUND" },
        { status: 404 }
      );
    }

    revalidatePath("/menu");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/menu/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete menu item", code: "MENU_DELETE_ERROR" },
      { status: 500 }
    );
  }
}

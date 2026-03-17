import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/mongodb";
import { createMenuItemSchema } from "@/lib/validators";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";

/**
 * GET /api/menu
 * Public — fetch all active menu items, sorted by category then name.
 */
export async function GET() {
  try {
    const db = await getDb();
    const items = await db
      .collection("menu_items")
      .find({ is_active: true })
      .sort({ category: 1, name: 1 })
      .toArray();

    return NextResponse.json(items);
  } catch (error) {
    console.error("GET /api/menu error:", error);
    return NextResponse.json(
      { error: "Failed to fetch menu items", code: "MENU_FETCH_ERROR" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/menu
 * Admin only — create a new menu item.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email || !isAdmin(session.user.email)) {
      return NextResponse.json(
        { error: "Unauthorized", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = createMenuItemSchema.safeParse(body);

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

    const now = new Date();
    const menuItem = {
      ...parsed.data,
      is_active: true,
      created_at: now,
      updated_at: now,
    };

    const db = await getDb();
    const result = await db.collection("menu_items").insertOne(menuItem);

    revalidatePath("/menu");

    return NextResponse.json(
      { _id: result.insertedId, ...menuItem },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/menu error:", error);
    return NextResponse.json(
      { error: "Failed to create menu item", code: "MENU_CREATE_ERROR" },
      { status: 500 }
    );
  }
}

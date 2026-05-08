import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { contactFormSchema } from "@/lib/validators";
import { sendContactNotification } from "@/lib/resend";

/**
 * POST /api/contact
 * Public — Submit a contact form message.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = contactFormSchema.safeParse(body);

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

    // Save to database
    const message = {
      ...data,
      created_at: new Date(),
      status: "unread",
    };

    await db.collection("contact_messages").insertOne(message);

    // Send email notification
    const emailResult = await sendContactNotification(data);

    if (!emailResult.success) {
      console.error("Failed to send contact notification email:", emailResult.error);
      // We still return 201 because the message was saved to the DB
    }

    return NextResponse.json(
      { message: "Message sent successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/contact error:", error);
    return NextResponse.json(
      { error: "Failed to send message", code: "CONTACT_SEND_ERROR" },
      { status: 500 }
    );
  }
}

import { Resend } from "resend";
import type { Order } from "@/types";
import { formatNGN } from "./format";

// ---------------------------------------------------------------------------
// Lazy-initialised Resend client — allows import without crashing when the
// env var is missing (e.g. during `next build` or in test environments).
// ---------------------------------------------------------------------------
let _resend: Resend | null = null;

function getResendClient(): Resend {
  if (!_resend) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY environment variable is not set");
    }
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

// ---------------------------------------------------------------------------
// Email helpers
// ---------------------------------------------------------------------------

/**
 * Escape HTML special characters to prevent XSS/HTML injection in emails.
 *
 * Customer-submitted fields (name, address, notes) are interpolated into
 * the notification email HTML — without escaping, a malicious customer
 * could inject arbitrary HTML into the admin's inbox.
 */
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildOrderEmailHtml(order: Order): string {
  const itemRows = order.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px;border-bottom:1px solid #eee">${escapeHtml(item.menu_item_name)}</td>
          <td style="padding:8px;border-bottom:1px solid #eee">${escapeHtml(item.side)}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${item.quantity}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${formatNGN(item.unit_price * item.quantity)}</td>
        </tr>`,
    )
    .join("");

  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h2 style="color:#4A6600">New Order: ${escapeHtml(order.reference)}</h2>
      <p><strong>Customer:</strong> ${escapeHtml(order.customer_name)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(order.customer_phone)}</p>
      ${order.customer_email ? `<p><strong>Email:</strong> ${escapeHtml(order.customer_email)}</p>` : ""}
      <p><strong>Address:</strong> ${escapeHtml(order.address)}</p>
      ${order.notes ? `<p><strong>Notes:</strong> ${escapeHtml(order.notes)}</p>` : ""}
      ${order.party_service_inquiry ? `<p style="color:#D1FF00;background:#0A0A0A;padding:8px;border-radius:4px"><strong>⚠ Party/Catering Service Inquiry</strong></p>` : ""}

      <table style="width:100%;border-collapse:collapse;margin:16px 0">
        <thead>
          <tr style="background:#f5f5f5">
            <th style="padding:8px;text-align:left">Item</th>
            <th style="padding:8px;text-align:left">Side</th>
            <th style="padding:8px;text-align:center">Qty</th>
            <th style="padding:8px;text-align:right">Subtotal</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
        <tfoot>
          <tr>
            <td colspan="3" style="padding:8px;text-align:right;font-weight:bold">Total</td>
            <td style="padding:8px;text-align:right;font-weight:bold">${formatNGN(order.total_price)}</td>
          </tr>
        </tfoot>
      </table>

      <p style="color:#666;font-size:12px">
        Placed at ${order.created_at instanceof Date ? order.created_at.toLocaleString("en-NG") : String(order.created_at)}
      </p>
    </div>
  `.trim();
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface SendResult {
  success: boolean;
  error?: string;
}

/**
 * Send an order notification email to all admin addresses.
 *
 * Uses the `RESEND_API_KEY` and `RESEND_FROM_EMAIL` environment variables.
 * Sends to every address listed in `ADMIN_EMAILS` (comma-separated).
 *
 * Returns `{ success: true }` on success, or `{ success: false, error }` on
 * failure — never throws, so callers can safely record `notification_status`.
 */
export async function sendOrderNotification(order: Order): Promise<SendResult> {
  try {
    const fromEmail = process.env.RESEND_FROM_EMAIL;
    if (!fromEmail) {
      return { success: false, error: "RESEND_FROM_EMAIL is not configured" };
    }

    const adminEmails = (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);

    if (adminEmails.length === 0) {
      return { success: false, error: "No ADMIN_EMAILS configured" };
    }

    const resend = getResendClient();

    const { error } = await resend.emails.send({
      from: `Haute Pepper Soup <${fromEmail}>`,
      to: adminEmails,
      subject: `New Order ${order.reference} — ${order.customer_name.replace(/[\r\n]/g, "")}`,
      html: buildOrderEmailHtml(order),
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown email sending error";
    return { success: false, error: message };
  }
}

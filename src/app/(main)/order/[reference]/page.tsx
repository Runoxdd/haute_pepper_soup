import type { Metadata } from "next";
import Link from "next/link";
import { getOrderByReference } from "@/lib/data";
import { formatNGN } from "@/lib/format";
import type { Order } from "@/types";

interface OrderPageProps {
  params: Promise<{ reference: string }>;
  searchParams: Promise<{ phone?: string }>;
}

export async function generateMetadata({
  params,
}: OrderPageProps): Promise<Metadata> {
  const { reference } = await params;
  return {
    title: `Order ${reference.toUpperCase()}`,
    description: `View your Haute Pepper Soup order ${reference.toUpperCase()}.`,
    robots: { index: false, follow: false },
  };
}

const statusLabels: Record<string, { text: string; className: string }> = {
  pending: {
    text: "Pending",
    className: "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30",
  },
  contacted: {
    text: "Contacted",
    className: "bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30",
  },
  completed: {
    text: "Completed",
    className: "bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30",
  },
};

export default async function OrderPage({
  params,
  searchParams,
}: OrderPageProps) {
  const { reference } = await params;
  const { phone } = await searchParams;
  const order = (await getOrderByReference(reference.toUpperCase())) as Order | null;

  // ── Order not found ───────────────────────────────────────────────
  if (!order) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <div className="mx-auto max-w-md">
          <div className="mb-6 text-6xl">
            <span aria-hidden="true">?</span>
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Order Not Found
          </h1>
          <p className="mt-4 text-base text-text-secondary">
            We couldn&rsquo;t find an order with reference{" "}
            <strong className="text-text-primary">
              {reference.toUpperCase()}
            </strong>
            .
            {phone
              ? " Please check both your reference number and phone number."
              : " If you placed a guest order, make sure to include your phone number."}
          </p>

          {/* Guest lookup form hint */}
          {!phone && (
            <p className="mt-3 text-sm text-text-muted">
              Guest orders require phone verification. Add{" "}
              <code className="rounded bg-gray-100 dark:bg-[rgba(255,255,255,0.1)] px-1.5 py-0.5 text-xs">
                ?phone=08012345678
              </code>{" "}
              to the URL.
            </p>
          )}

          <Link
            href="/menu"
            className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-brand-lemon px-8 text-sm font-semibold dark:text-[#0A0A0A] transition-transform hover:scale-[1.03] active:scale-[0.97]"
          >
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  // ── Order found ───────────────────────────────────────────────────
  const status = statusLabels[order.status] ?? statusLabels.pending;
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  const whatsappMessage = encodeURIComponent(
    `Hi, I placed order ${order.reference} on Haute Pepper Soup`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="px-6 pb-24 pt-8 sm:pt-12">
      <div className="mx-auto max-w-lg">
        {/* Success header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand-lemon-dark/10 dark:bg-brand-lemon/10">
            <svg
              className="h-8 w-8 text-brand-lemon-dark dark:text-brand-lemon"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-text-primary">
            Order Confirmed
          </h1>
          <p className="mt-2 text-text-secondary">
            Thank you for your order!
          </p>
        </div>

        {/* Order summary card */}
        <div className="glass-card rounded-2xl p-6 sm:p-8">
          {/* Reference and status */}
          <div className="flex items-center justify-between border-b border-glass-border pb-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
                Reference
              </p>
              <p className="mt-1 font-serif text-2xl font-bold tracking-tight text-text-primary">
                {order.reference}
              </p>
            </div>
            <span
              className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${status.className}`}
            >
              {status.text}
            </span>
          </div>

          {/* Items */}
          <div className="mt-5 space-y-3">
            <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
              Items
            </p>
            {order.items.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between text-sm"
              >
                <div>
                  <span className="font-medium text-text-primary">{item.menu_item_name}</span>
                  {item.side && item.side !== "None" && (
                    <span className="ml-2 text-text-muted">
                      + {item.side}
                    </span>
                  )}
                  {item.quantity > 1 && (
                    <span className="ml-2 text-text-muted">
                      x{item.quantity}
                    </span>
                  )}
                </div>
                <span className="tabular-nums text-text-secondary">
                  {formatNGN(item.unit_price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="mt-5 flex items-center justify-between border-t border-glass-border pt-4">
            <span className="text-sm font-medium text-text-secondary">
              Total
            </span>
            <span className="tabular-nums text-xl font-bold text-brand-lemon-dark dark:text-brand-lemon">
              {formatNGN(order.total_price)}
            </span>
          </div>

          {/* Delivery address */}
          {order.address && (
            <div className="mt-5 border-t border-glass-border pt-4">
              <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
                Delivery Address
              </p>
              <p className="mt-1 text-sm text-text-secondary">
                {order.address}
              </p>
            </div>
          )}

          {/* Notes */}
          {order.notes && (
            <div className="mt-4">
              <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
                Notes
              </p>
              <p className="mt-1 text-sm text-text-secondary">
                {order.notes}
              </p>
            </div>
          )}
        </div>

        {/* WhatsApp CTA */}
        <div className="mt-6 text-center">
          <p className="mb-4 text-sm text-text-secondary">
            We&rsquo;ll contact you shortly to arrange payment and delivery.
            You can also reach us directly:
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 text-sm font-semibold text-white transition-transform hover:scale-[1.03] active:scale-[0.97]"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.75.75 0 00.917.918l4.462-1.494A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.32 0-4.47-.767-6.202-2.065a.75.75 0 00-.653-.132l-3.2 1.071 1.07-3.196a.75.75 0 00-.13-.654A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
            </svg>
            Contact us on WhatsApp
          </a>
        </div>

        {/* Back to menu */}
        <div className="mt-8 text-center">
          <Link
            href="/menu"
            className="text-sm font-medium text-text-muted transition-colors hover:text-text-primary"
          >
            &larr; Back to Menu
          </Link>
        </div>
      </div>
    </div>
  );
}

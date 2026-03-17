"use client";

import { useState, useCallback, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useCartStore } from "@/lib/store";
import { formatNGN } from "@/lib/format";

interface FormErrors {
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  address?: string;
  notes?: string;
  form?: string;
}

interface FormData {
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  address: string;
  notes: string;
  party_service_inquiry: boolean;
}

/**
 * Nigerian phone validation: 11 digits starting with 0 (e.g. 08012345678)
 * or international +234 format (e.g. +2348012345678).
 */
const NIGERIAN_PHONE_REGEX = /^(?:0[7-9][01]\d{8}|\+234[7-9][01]\d{8})$/;

/**
 * Checkout form with client-side validation and server submission.
 *
 * Fields: name (required), phone (required, Nigerian format),
 * email (optional), address (required, max 500), notes (optional, max 500),
 * catering inquiry checkbox.
 *
 * Submits to POST /api/orders, then redirects to /order/[reference] on success.
 */
export { OrderForm };
export default function OrderForm() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);

  const totalPrice = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );

  const [formData, setFormData] = useState<FormData>({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    address: "",
    notes: "",
    party_service_inquiry: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const updateField = useCallback(
    (field: keyof FormData, value: string | boolean) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Clear field error on change
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    },
    [],
  );

  const validate = useCallback((): FormErrors => {
    const errs: FormErrors = {};
    const name = formData.customer_name.trim();
    const phone = formData.customer_phone.trim();
    const email = formData.customer_email.trim();
    const address = formData.address.trim();
    const notes = formData.notes.trim();

    if (!name) {
      errs.customer_name = "Name is required";
    } else if (name.length > 100) {
      errs.customer_name = "Name cannot exceed 100 characters";
    }

    if (!phone) {
      errs.customer_phone = "Phone number is required";
    } else if (!NIGERIAN_PHONE_REGEX.test(phone)) {
      errs.customer_phone =
        "Enter a valid Nigerian phone number (e.g. 08012345678)";
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.customer_email = "Enter a valid email address";
    }

    if (!address) {
      errs.address = "Delivery address is required";
    } else if (address.length > 500) {
      errs.address = "Address cannot exceed 500 characters";
    }

    if (notes.length > 500) {
      errs.notes = "Notes cannot exceed 500 characters";
    }

    if (items.length === 0) {
      errs.form = "Your cart is empty. Add items before placing an order.";
    }

    return errs;
  }, [formData, items.length]);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      const validationErrors = validate();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        // Focus first errored field
        const firstErrorField = Object.keys(validationErrors)[0];
        const el = document.querySelector<HTMLElement>(`[name="${firstErrorField}"]`);
        el?.focus();
        return;
      }

      setLoading(true);
      setErrors({});

      const payload = {
        customer_name: formData.customer_name.trim(),
        customer_phone: formData.customer_phone.trim(),
        ...(formData.customer_email.trim() && {
          customer_email: formData.customer_email.trim(),
        }),
        address: formData.address.trim(),
        ...(formData.notes.trim() && { notes: formData.notes.trim() }),
        party_service_inquiry: formData.party_service_inquiry,
        items: items.map((item) => ({
          menu_item_id: item.menuItemId,
          side: item.side,
          quantity: item.quantity,
        })),
      };

      try {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(
            data?.error || `Order submission failed (${res.status})`,
          );
        }

        const { reference } = await res.json();
        clearCart();
        router.push(`/order/${reference}`);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Something went wrong";

        if (retryCount < 2) {
          setErrors({
            form: `${message}. Tap to retry.`,
          });
          setRetryCount((c) => c + 1);
        } else {
          setErrors({
            form: `${message}. Please try again later or contact us on WhatsApp.`,
          });
        }
      } finally {
        setLoading(false);
      }
    },
    [formData, items, validate, clearCart, router, retryCount],
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <Input
        label="Full Name"
        name="customer_name"
        autoComplete="name"
        required
        value={formData.customer_name}
        onChange={(e) =>
          updateField("customer_name", (e.target as HTMLInputElement).value)
        }
        error={errors.customer_name}
        placeholder="Your full name\u2026"
      />

      <Input
        label="Phone Number"
        name="customer_phone"
        type="tel"
        autoComplete="tel"
        inputMode="tel"
        required
        value={formData.customer_phone}
        onChange={(e) =>
          updateField("customer_phone", (e.target as HTMLInputElement).value)
        }
        error={errors.customer_phone}
        placeholder="08012345678"
      />

      <Input
        label="Email (optional)"
        name="customer_email"
        type="email"
        autoComplete="email"
        inputMode="email"
        spellCheck={false}
        value={formData.customer_email}
        onChange={(e) =>
          updateField("customer_email", (e.target as HTMLInputElement).value)
        }
        error={errors.customer_email}
        placeholder="your@email.com"
      />

      <Input
        label="Delivery Address"
        name="address"
        autoComplete="street-address"
        required
        multiline
        value={formData.address}
        onChange={(e) =>
          updateField("address", (e.target as HTMLTextAreaElement).value)
        }
        error={errors.address}
        placeholder="Full delivery address (include landmarks)\u2026"
      />

      <Input
        label="Notes (optional)"
        name="notes"
        multiline
        value={formData.notes}
        onChange={(e) =>
          updateField("notes", (e.target as HTMLTextAreaElement).value)
        }
        error={errors.notes}
        placeholder="Special requests, delivery instructions\u2026"
      />

      {/* Catering Inquiry */}
      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          type="checkbox"
          checked={formData.party_service_inquiry}
          onChange={(e) =>
            updateField("party_service_inquiry", e.target.checked)
          }
          className="
            mt-0.5 h-5 w-5 rounded border-glass-border
            bg-glass-bg text-brand-lemon-dark dark:text-brand-lemon
            focus-visible:ring-2 focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon
            focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-brand-dark
          "
        />
        <div>
          <span className="text-sm font-medium text-text-primary group-hover:text-brand-lemon-dark dark:group-hover:text-brand-lemon transition-colors duration-200">
            {"I\u2019m interested in catering / party service"}
          </span>
          <p className="text-xs text-text-muted mt-0.5">
            {"We\u2019ll reach out with catering options and pricing"}
          </p>
        </div>
      </label>

      {/* Order Summary */}
      <div className="glass-card rounded-xl p-4 mt-2">
        <div className="flex items-center justify-between">
          <span className="text-text-secondary">
            {items.reduce((s, i) => s + i.quantity, 0)} items
          </span>
          <span className="tabular-nums text-lg font-bold text-brand-lemon-dark dark:text-brand-lemon">
            {formatNGN(totalPrice)}
          </span>
        </div>
      </div>

      {/* Form error */}
      {errors.form && (
        <p className="text-sm text-status-failed text-center" role="alert">
          {errors.form}
        </p>
      )}

      <Button
        type="submit"
        variant="primary"
        loading={loading}
        disabled={items.length === 0}
        className="w-full mt-2"
      >
        {loading ? "Placing order..." : "Place Order"}
      </Button>
    </form>
  );
}

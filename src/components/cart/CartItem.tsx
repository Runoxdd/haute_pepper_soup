"use client";

import { useCartStore } from "@/lib/store";
import { formatNGN } from "@/lib/format";

interface CartItemProps {
  menuItemId: string;
  name: string;
  side: string;
  unitPrice: number;
  quantity: number;
}

/**
 * Cart line item with dish name, selected side, unit price,
 * quantity controls (+/-), and a remove button.
 */
export { CartItem };
export default function CartItem({
  menuItemId,
  name,
  side,
  unitPrice,
  quantity,
}: CartItemProps) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <div className="flex items-start gap-3 py-3 border-b border-glass-border last:border-b-0">
      {/* Item details */}
      <div className="flex-1 min-w-0">
        <p className="font-serif text-sm font-semibold text-text-primary truncate">
          {name}
        </p>
        {side !== "None" && (
          <p className="text-xs text-text-muted mt-0.5">
            Side: {side}
          </p>
        )}
        <p className="tabular-nums text-sm text-text-secondary mt-1">
          {formatNGN(unitPrice)} each
        </p>
      </div>

      {/* Quantity controls */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => updateQuantity(menuItemId, side, quantity - 1)}
          aria-label={`Decrease quantity of ${name}`}
          className="
            flex h-7 w-7 items-center justify-center rounded-lg
            border border-glass-border bg-glass-bg
            text-text-secondary transition-colors duration-200
            hover:bg-glass-hover hover:text-text-primary
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon focus-visible:ring-offset-1
            focus-visible:ring-offset-white dark:focus-visible:ring-offset-brand-dark
            touch-action-manipulation
          "
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
            <path fillRule="evenodd" d="M4 10a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H4.75A.75.75 0 0 1 4 10Z" clipRule="evenodd" />
          </svg>
        </button>

        <span
          className="tabular-nums w-6 text-center text-sm font-medium text-text-primary"
          aria-label={`Quantity: ${quantity}`}
        >
          {quantity}
        </span>

        <button
          type="button"
          onClick={() => updateQuantity(menuItemId, side, quantity + 1)}
          disabled={quantity >= 100}
          aria-label={`Increase quantity of ${name}`}
          className="
            flex h-7 w-7 items-center justify-center rounded-lg
            border border-glass-border bg-glass-bg
            text-text-secondary transition-colors duration-200
            hover:bg-glass-hover hover:text-text-primary
            disabled:opacity-50 disabled:cursor-not-allowed
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon focus-visible:ring-offset-1
            focus-visible:ring-offset-white dark:focus-visible:ring-offset-brand-dark
            touch-action-manipulation
          "
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
            <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
          </svg>
        </button>
      </div>

      {/* Line total + remove */}
      <div className="flex flex-col items-end gap-1 ml-2">
        <span className="tabular-nums text-sm font-semibold text-text-primary">
          {formatNGN(unitPrice * quantity)}
        </span>
        <button
          type="button"
          onClick={() => removeItem(menuItemId, side)}
          aria-label={`Remove ${name} from cart`}
          className="
            text-xs text-status-failed/70 transition-colors duration-200
            hover:text-status-failed
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-status-failed focus-visible:ring-offset-1
            focus-visible:ring-offset-white dark:focus-visible:ring-offset-brand-dark
            rounded
            touch-action-manipulation
          "
        >
          Remove
        </button>
      </div>
    </div>
  );
}

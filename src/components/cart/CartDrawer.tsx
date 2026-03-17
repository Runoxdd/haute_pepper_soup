"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useCartStore } from "@/lib/store";
import { formatNGN } from "@/lib/format";
import CartItemComponent from "@/components/cart/CartItem";
import Button from "@/components/ui/Button";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

/**
 * Slide-out cart panel with AnimatePresence for enter/exit animations.
 *
 * Slides from right on mobile (full width) and renders as a side drawer
 * on desktop. Uses overscroll-behavior: contain to prevent background scroll.
 */
export { CartDrawer };
export default function CartDrawer({
  open,
  onClose,
  onCheckout,
}: CartDrawerProps) {
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            role="dialog"
            aria-label="Shopping cart"
            aria-modal="true"
            className="
              fixed top-0 right-0 z-50
              h-full w-full max-w-md
              flex flex-col
              bg-[#FAFAF9] dark:bg-brand-dark border-l border-glass-border
              overscroll-contain
              safe-bottom
            "
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-glass-border px-5 py-4">
              <h2 className="font-serif text-xl font-semibold text-text-primary">
                Your Order
                {totalItems > 0 && (
                  <span className="ml-2 text-sm font-normal text-text-muted">
                    ({totalItems} {totalItems === 1 ? "item" : "items"})
                  </span>
                )}
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close cart"
                className="
                  flex h-8 w-8 items-center justify-center rounded-lg
                  text-text-secondary transition-colors duration-200
                  hover:text-text-primary hover:bg-glass-hover
                  focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon focus-visible:ring-offset-1
                  focus-visible:ring-offset-white dark:focus-visible:ring-offset-brand-dark
                  touch-action-manipulation
                "
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                  <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                </svg>
              </button>
            </div>

            {/* Cart Content */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-3 scrollbar-thin">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-16 w-16 text-text-muted/50 mb-4" aria-hidden="true">
                    <path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 14.25h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.965A60.864 60.864 0 0 0 5.68 4.509l-.232-.867A1.875 1.875 0 0 0 3.636 2.25H2.25ZM3.75 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM16.5 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" />
                  </svg>
                  <p className="font-serif text-lg text-text-secondary">
                    Your cart is empty
                  </p>
                  <p className="mt-1 text-sm text-text-muted">
                    Browse the menu to add delicious dishes
                  </p>
                </div>
              ) : (
                <div>
                  {items.map((item) => (
                    <CartItemComponent
                      key={`${item.menuItemId}_${item.side}`}
                      menuItemId={item.menuItemId}
                      name={item.name}
                      side={item.side}
                      unitPrice={item.unitPrice}
                      quantity={item.quantity}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Footer with order summary + actions */}
            {items.length > 0 && (
              <div className="border-t border-glass-border px-5 py-4 space-y-3">
                {/* Order Summary Breakdown */}
                <div className="space-y-1.5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                    Order Summary
                  </h3>
                  {items.map((item) => (
                    <div
                      key={`${item.menuItemId}_${item.side}`}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-text-secondary truncate mr-2">
                        {item.name} &times; {item.quantity}
                      </span>
                      <span className="tabular-nums text-text-primary whitespace-nowrap">
                        {formatNGN(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div className="border-t border-glass-border" />

                {/* Total */}
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary font-medium">Total</span>
                  <span className="tabular-nums text-xl font-bold text-brand-lemon-dark dark:text-brand-lemon">
                    {formatNGN(totalPrice)}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <Button
                    variant="primary"
                    onClick={onCheckout}
                    className="w-full"
                  >
                    Place Order
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={clearCart}
                    className="w-full text-xs"
                  >
                    Clear Cart
                  </Button>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

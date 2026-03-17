"use client";

import { AnimatePresence, motion } from "motion/react";
import { useToastStore, type ToastType } from "@/lib/toast";

const typeStyles: Record<ToastType, string> = {
  success:
    "bg-green-50 border-green-200 text-green-800 dark:bg-green-950/80 dark:border-green-800 dark:text-green-200",
  error:
    "bg-red-50 border-red-200 text-red-800 dark:bg-red-950/80 dark:border-red-800 dark:text-red-200",
  info:
    "bg-white border-gray-200 text-gray-800 dark:bg-[#1A1A1A] dark:border-glass-border dark:text-gray-200",
};

/**
 * Toast notification container.
 *
 * Renders stacked toast messages in the top-right corner.
 * Each toast slides in from the right and fades out on dismiss.
 * Rendered once in the root layout.
 */
export default function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const removeToast = useToastStore((s) => s.removeToast);

  return (
    <div
      aria-live="polite"
      aria-label="Notifications"
      className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, x: 80, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`
              pointer-events-auto flex items-center gap-3
              rounded-xl border px-4 py-3 shadow-lg
              text-sm font-medium
              max-w-xs sm:max-w-sm
              ${typeStyles[toast.type]}
            `}
            role="status"
          >
            <span className="flex-1">{toast.message}</span>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              aria-label="Dismiss notification"
              className="
                shrink-0 flex h-5 w-5 items-center justify-center rounded
                opacity-60 transition-opacity hover:opacity-100
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
              </svg>
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

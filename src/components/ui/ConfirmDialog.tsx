"use client";

import { useEffect, useRef, useCallback, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";

interface ConfirmDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string | ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** "destructive" uses a red confirm button; "default" uses the brand style */
  variant?: "default" | "destructive";
  loading?: boolean;
}

/**
 * Reusable confirmation modal with AnimatePresence animation,
 * backdrop click to dismiss, Escape key, and focus trap.
 */
export { ConfirmDialog };
export default function ConfirmDialog({
  open,
  onConfirm,
  onCancel,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  loading = false,
}: ConfirmDialogProps) {
  const confirmRef = useRef<HTMLButtonElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Focus the cancel button when the dialog opens
  useEffect(() => {
    if (open) {
      // Small delay to let AnimatePresence render
      const timer = setTimeout(() => {
        cancelRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Escape key handler
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCancel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onCancel]);

  // Focus trap
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [],
  );

  const isDestructive = variant === "destructive";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/40 dark:bg-black/60"
            onClick={onCancel}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-hidden="true"
          />

          {/* Dialog */}
          <motion.div
            ref={dialogRef}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-message"
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            onKeyDown={handleKeyDown}
            className="relative z-10 w-full max-w-sm rounded-2xl border border-glass-border bg-white dark:bg-brand-dark p-6 shadow-xl dark:shadow-none"
          >
            <h2
              id="confirm-dialog-title"
              className="font-serif text-lg font-semibold text-text-primary"
            >
              {title}
            </h2>
            <div
              id="confirm-dialog-message"
              className="mt-2 text-sm text-text-secondary leading-relaxed"
            >
              {message}
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                ref={cancelRef}
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="rounded-xl border border-glass-border bg-transparent px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-glass-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-brand-dark disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancelLabel}
              </button>
              <button
                ref={confirmRef}
                type="button"
                onClick={onConfirm}
                disabled={loading}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-brand-dark disabled:opacity-50 disabled:cursor-not-allowed ${
                  isDestructive
                    ? "bg-status-failed text-white hover:bg-status-failed/90 focus-visible:ring-status-failed"
                    : "bg-brand-lemon text-brand-dark hover:bg-brand-lemon/90 focus-visible:ring-brand-lemon"
                }`}
              >
                {loading && <span className="spinner" aria-hidden="true" />}
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

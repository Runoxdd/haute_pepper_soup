"use client";

import { type ReactNode } from "react";
import { motion, type HTMLMotionProps } from "motion/react";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: ButtonVariant;
  loading?: boolean;
  children: ReactNode;
  /** aria-label for icon-only buttons */
  "aria-label"?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-lemon text-brand-dark font-semibold hover:bg-brand-lemon/90 focus-visible:ring-brand-lemon",
  secondary:
    "bg-brand-lemon-dark text-white dark:bg-brand-lemon dark:text-brand-dark font-semibold hover:opacity-90 focus-visible:ring-brand-lemon",
  ghost:
    "bg-transparent text-text-secondary border border-glass-border hover:bg-glass-hover hover:text-text-primary focus-visible:ring-glass-border",
};

/**
 * Branded button with motion tap animation and loading state.
 *
 * Renders a native `<button>` element with proper focus-visible styles,
 * disabled state, and an optional loading spinner that replaces content.
 */
export { Button };
export default function Button({
  variant = "primary",
  loading = false,
  disabled,
  children,
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <motion.button
      type={type}
      disabled={isDisabled}
      whileTap={isDisabled ? undefined : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-xl px-6 py-3 text-sm
        transition-colors duration-200
        focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-brand-dark
        focus-visible:outline-none
        disabled:opacity-50 disabled:cursor-not-allowed
        touch-action-manipulation
        ${variantStyles[variant]}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <>
          <span className="spinner" aria-hidden="true" />
          <span className="sr-only">Loading</span>
          {children}
        </>
      ) : (
        children
      )}
    </motion.button>
  );
}

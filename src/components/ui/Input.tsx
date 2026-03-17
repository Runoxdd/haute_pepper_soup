"use client";

import {
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
  forwardRef,
  useId,
} from "react";

interface InputBaseProps {
  /** Visible label text */
  label: string;
  /** Inline error message */
  error?: string;
  /** Show as textarea instead of input */
  multiline?: boolean;
}

type InputElementProps = InputBaseProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, "id"> &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id">;

/**
 * Dark-themed input with glass background, label integration,
 * and inline error state.
 *
 * Supports both `<input>` and `<textarea>` via the `multiline` prop.
 * Proper autocomplete and inputMode attributes are passed through.
 */
const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputElementProps>(
  function Input(
    { label, error, multiline = false, className = "", ...props },
    ref,
  ) {
    const generatedId = useId();
    const inputId = generatedId;
    const errorId = `${inputId}-error`;

    const sharedClassName = `
      w-full rounded-xl px-4 py-3
      bg-glass-bg border
      text-text-primary placeholder:text-text-muted
      transition-colors duration-200
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon
      focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-brand-dark
      ${
        error
          ? "border-status-failed focus-visible:ring-status-failed"
          : "border-glass-border hover:border-glass-hover"
      }
      ${className}
    `;

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-text-secondary"
        >
          {label}
          {props.required && (
            <span className="ml-1 text-status-failed" aria-hidden="true">
              *
            </span>
          )}
        </label>

        {multiline ? (
          <textarea
            id={inputId}
            ref={ref as React.Ref<HTMLTextAreaElement>}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            rows={4}
            className={`${sharedClassName} resize-y min-h-[100px]`}
            {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            id={inputId}
            ref={ref as React.Ref<HTMLInputElement>}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            className={sharedClassName}
            {...(props as InputHTMLAttributes<HTMLInputElement>)}
          />
        )}

        {error && (
          <p id={errorId} className="text-sm text-status-failed" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

export { Input };
export default Input;

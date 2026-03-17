"use client";

import { useState, useCallback, type FormEvent } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  form?: string;
}

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const SUBJECTS = [
  { value: "", label: "Select a subject\u2026" },
  { value: "general", label: "General Inquiry" },
  { value: "order", label: "Order Issue" },
  { value: "catering", label: "Catering" },
  { value: "feedback", label: "Feedback" },
  { value: "other", label: "Other" },
];

/**
 * General contact form with client-side validation.
 *
 * In mock mode, shows a success message on submission.
 */
export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const updateField = useCallback(
    (field: keyof FormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    },
    [],
  );

  const validate = useCallback((): FormErrors => {
    const errs: FormErrors = {};
    const name = formData.name.trim();
    const email = formData.email.trim();
    const message = formData.message.trim();

    if (!name) {
      errs.name = "Name is required";
    } else if (name.length > 100) {
      errs.name = "Name cannot exceed 100 characters";
    }

    if (!email) {
      errs.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = "Enter a valid email address";
    }

    if (!formData.subject) {
      errs.subject = "Please select a subject";
    }

    if (!message) {
      errs.message = "Message is required";
    } else if (message.length > 2000) {
      errs.message = "Message cannot exceed 2000 characters";
    }

    return errs;
  }, [formData]);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      const validationErrors = validate();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        const firstErrorField = Object.keys(validationErrors)[0];
        const el = document.querySelector<HTMLElement>(`[name="${firstErrorField}"]`);
        el?.focus();
        return;
      }

      setLoading(true);
      setErrors({});

      // In mock mode, simulate a short delay then show success
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSubmitted(true);
      setLoading(false);
    },
    [validate],
  );

  if (submitted) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center sm:p-10">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-status-completed/10">
          <svg
            className="h-8 w-8 text-status-completed"
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
        <h3 className="font-serif text-2xl font-bold text-text-primary">
          Message Sent!
        </h3>
        <p className="mx-auto mt-3 max-w-sm text-sm text-text-secondary">
          Thank you for reaching out. We will get back to you as soon as
          possible, usually within 24 hours.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setFormData({ name: "", email: "", subject: "", message: "" });
          }}
          className="mt-6 text-sm font-medium text-brand-lemon-dark dark:text-brand-lemon transition-colors hover:text-brand-lemon-dark/80 dark:hover:text-brand-lemon/80"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card rounded-2xl p-6 sm:p-8"
      noValidate
    >
      <h3 className="mb-6 font-serif text-xl font-bold text-text-primary sm:text-2xl">
        Send Us a Message
      </h3>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Full Name"
            name="name"
            autoComplete="name"
            required
            value={formData.name}
            onChange={(e) =>
              updateField("name", (e.target as HTMLInputElement).value)
            }
            error={errors.name}
            placeholder="Your full name"
          />

          <Input
            label="Email Address"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            spellCheck={false}
            required
            value={formData.email}
            onChange={(e) =>
              updateField("email", (e.target as HTMLInputElement).value)
            }
            error={errors.email}
            placeholder="your@email.com"
          />
        </div>

        {/* Subject Select */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="subject"
            className="text-sm font-medium text-text-secondary"
          >
            Subject
            <span className="ml-1 text-status-failed" aria-hidden="true">
              *
            </span>
          </label>
          <select
            id="subject"
            name="subject"
            required
            value={formData.subject}
            onChange={(e) => updateField("subject", e.target.value)}
            aria-invalid={!!errors.subject}
            className={`
              w-full rounded-xl px-4 py-3
              bg-glass-bg border
              text-text-primary
              transition-colors duration-200
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon
              focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-brand-dark
              ${
                errors.subject
                  ? "border-status-failed focus-visible:ring-status-failed"
                  : "border-glass-border hover:border-glass-hover"
              }
            `}
          >
            {SUBJECTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          {errors.subject && (
            <p className="text-sm text-status-failed" role="alert">
              {errors.subject}
            </p>
          )}
        </div>

        <Input
          label="Message"
          name="message"
          multiline
          required
          value={formData.message}
          onChange={(e) =>
            updateField("message", (e.target as HTMLTextAreaElement).value)
          }
          error={errors.message}
          placeholder="How can we help you?"
        />

        {errors.form && (
          <p className="text-sm text-status-failed text-center" role="alert">
            {errors.form}
          </p>
        )}

        <Button
          type="submit"
          variant="primary"
          loading={loading}
          className="w-full mt-2"
        >
          {loading ? "Sending..." : "Send Message"}
        </Button>
      </div>
    </form>
  );
}

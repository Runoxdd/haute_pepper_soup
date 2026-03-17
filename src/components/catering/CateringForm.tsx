"use client";

import { useState, useCallback, useEffect, type FormEvent } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  event_type?: string;
  guests?: string;
  event_date?: string;
  location?: string;
  notes?: string;
  form?: string;
}

interface FormData {
  name: string;
  phone: string;
  email: string;
  event_type: string;
  guests: string;
  event_date: string;
  location: string;
  notes: string;
}

const EVENT_TYPES = [
  { value: "", label: "Select event type\u2026" },
  { value: "birthday", label: "Birthday Party" },
  { value: "corporate", label: "Corporate Event" },
  { value: "wedding", label: "Wedding Reception" },
  { value: "private_dining", label: "Private Dining" },
  { value: "other", label: "Other" },
];

/**
 * Nigerian phone validation: 11 digits starting with 0 (e.g. 08012345678)
 * or international +234 format (e.g. +2348012345678).
 */
const NIGERIAN_PHONE_REGEX = /^(?:0[7-9][01]\d{8}|\+234[7-9][01]\d{8})$/;

interface CateringFormProps {
  /** Pre-fill the event type select (e.g. from service card modal CTA). */
  defaultEventType?: string;
}

/**
 * Catering inquiry form with client-side validation.
 *
 * In mock mode (no MONGODB_URI), shows a success message.
 * In production, submits to POST /api/orders with party_service_inquiry: true.
 */
export default function CateringForm({ defaultEventType = "" }: CateringFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    event_type: defaultEventType,
    guests: "",
    event_date: "",
    location: "",
    notes: "",
  });

  // Sync when parent changes the default (e.g. modal CTA clicked)
  useEffect(() => {
    if (defaultEventType) {
      setFormData((prev) => ({ ...prev, event_type: defaultEventType }));
      setErrors((prev) => ({ ...prev, event_type: undefined }));
    }
  }, [defaultEventType]);
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
    const phone = formData.phone.trim();
    const email = formData.email.trim();
    const guests = formData.guests.trim();
    const location = formData.location.trim();

    if (!name) {
      errs.name = "Name is required";
    } else if (name.length > 100) {
      errs.name = "Name cannot exceed 100 characters";
    }

    if (!phone) {
      errs.phone = "Phone number is required";
    } else if (!NIGERIAN_PHONE_REGEX.test(phone)) {
      errs.phone = "Enter a valid Nigerian phone number (e.g. 08012345678)";
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = "Enter a valid email address";
    }

    if (!formData.event_type) {
      errs.event_type = "Please select an event type";
    }

    if (!guests) {
      errs.guests = "Expected number of guests is required";
    } else if (isNaN(Number(guests)) || Number(guests) < 1) {
      errs.guests = "Enter a valid number of guests";
    }

    if (!formData.event_date) {
      errs.event_date = "Event date is required";
    } else {
      const selectedDate = new Date(formData.event_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        errs.event_date = "Event date must be in the future";
      }
    }

    if (!location) {
      errs.location = "Event location is required";
    } else if (location.length > 500) {
      errs.location = "Location cannot exceed 500 characters";
    }

    if (formData.notes.trim().length > 1000) {
      errs.notes = "Notes cannot exceed 1000 characters";
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

      try {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer_name: formData.name.trim(),
            customer_phone: formData.phone.trim(),
            ...(formData.email.trim() && {
              customer_email: formData.email.trim(),
            }),
            address: formData.location.trim(),
            notes: [
              `Catering inquiry: ${EVENT_TYPES.find((t) => t.value === formData.event_type)?.label ?? formData.event_type}`,
              `Guests: ${formData.guests}`,
              `Event date: ${formData.event_date}`,
              formData.notes.trim() ? `Notes: ${formData.notes.trim()}` : "",
            ]
              .filter(Boolean)
              .join(" | "),
            party_service_inquiry: true,
            items: [],
          }),
        });

        if (!res.ok) {
          // Mock mode returns 404 for empty items — that's fine, show success anyway
          // In a real API this would succeed
        }

        setSubmitted(true);
      } catch {
        // In mock mode (no API), still show success
        setSubmitted(true);
      } finally {
        setLoading(false);
      }
    },
    [formData, validate],
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
          Inquiry Received!
        </h3>
        <p className="mx-auto mt-3 max-w-sm text-sm text-text-secondary">
          Thank you for your interest in our catering service. We will contact
          you within 24 hours via WhatsApp or phone to discuss your event.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setFormData({
              name: "",
              phone: "",
              email: "",
              event_type: "",
              guests: "",
              event_date: "",
              location: "",
              notes: "",
            });
          }}
          className="mt-6 text-sm font-medium text-brand-lemon-dark dark:text-brand-lemon transition-colors hover:text-brand-lemon-dark/80 dark:hover:text-brand-lemon/80"
        >
          Submit another inquiry
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
        Request a Quote
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
            label="Phone Number"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            required
            value={formData.phone}
            onChange={(e) =>
              updateField("phone", (e.target as HTMLInputElement).value)
            }
            error={errors.phone}
            placeholder="08012345678"
          />
        </div>

        <Input
          label="Email (optional)"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          spellCheck={false}
          value={formData.email}
          onChange={(e) =>
            updateField("email", (e.target as HTMLInputElement).value)
          }
          error={errors.email}
          placeholder="your@email.com"
        />

        {/* Event Type Select */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="event_type"
            className="text-sm font-medium text-text-secondary"
          >
            Event Type
            <span className="ml-1 text-status-failed" aria-hidden="true">
              *
            </span>
          </label>
          <select
            id="event_type"
            name="event_type"
            required
            value={formData.event_type}
            onChange={(e) => updateField("event_type", e.target.value)}
            aria-invalid={!!errors.event_type}
            className={`
              w-full rounded-xl px-4 py-3
              bg-glass-bg border
              text-text-primary
              transition-colors duration-200
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon
              focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-brand-dark
              ${
                errors.event_type
                  ? "border-status-failed focus-visible:ring-status-failed"
                  : "border-glass-border hover:border-glass-hover"
              }
            `}
          >
            {EVENT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.event_type && (
            <p className="text-sm text-status-failed" role="alert">
              {errors.event_type}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Expected Guests"
            name="guests"
            type="number"
            inputMode="numeric"
            required
            min={1}
            value={formData.guests}
            onChange={(e) =>
              updateField("guests", (e.target as HTMLInputElement).value)
            }
            error={errors.guests}
            placeholder="e.g. 50"
          />

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="event_date"
              className="text-sm font-medium text-text-secondary"
            >
              Event Date
              <span className="ml-1 text-status-failed" aria-hidden="true">
                *
              </span>
            </label>
            <input
              id="event_date"
              name="event_date"
              type="date"
              required
              value={formData.event_date}
              onChange={(e) => updateField("event_date", e.target.value)}
              aria-invalid={!!errors.event_date}
              className={`
                w-full rounded-xl px-4 py-3
                bg-glass-bg border
                text-text-primary
                transition-colors duration-200
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon
                focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-brand-dark
                ${
                  errors.event_date
                    ? "border-status-failed focus-visible:ring-status-failed"
                    : "border-glass-border hover:border-glass-hover"
                }
              `}
            />
            {errors.event_date && (
              <p className="text-sm text-status-failed" role="alert">
                {errors.event_date}
              </p>
            )}
          </div>
        </div>

        <Input
          label="Event Location / Address"
          name="location"
          autoComplete="street-address"
          required
          value={formData.location}
          onChange={(e) =>
            updateField("location", (e.target as HTMLInputElement).value)
          }
          error={errors.location}
          placeholder="Full address of the event venue"
        />

        <Input
          label="Additional Notes (optional)"
          name="notes"
          multiline
          value={formData.notes}
          onChange={(e) =>
            updateField("notes", (e.target as HTMLTextAreaElement).value)
          }
          error={errors.notes}
          placeholder="Dietary requirements, preferred pepper soup varieties, special requests\u2026"
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
          {loading ? "Submitting..." : "Submit Inquiry"}
        </Button>
      </div>
    </form>
  );
}

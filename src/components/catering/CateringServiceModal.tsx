"use client";

import { useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { formatNGN } from "@/lib/format";

/* ─── Service detail data ─────────────────────────────────────────── */

export interface ServiceDetail {
  title: string;
  price: number;
  image: string;
  eventTypeValue: string; // maps to CateringForm EVENT_TYPES value
  included: string[];
  highlights: string[];
}

export const SERVICE_DETAILS: Record<string, ServiceDetail> = {
  "Birthday Party": {
    title: "Birthday Party",
    price: 50_000,
    image:
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=900&q=80&fit=crop",
    eventTypeValue: "birthday",
    included: [
      "Full catering setup",
      "Dedicated serving staff",
      "Premium bowls & utensils",
      "Up to 3 pepper soup varieties",
      "Choice of side dishes",
    ],
    highlights: [
      "Perfect for 20\u2013100 guests",
      "Customizable menu options",
      "Setup 2 hours before event",
      "Indoor & outdoor events",
    ],
  },
  "Corporate Event": {
    title: "Corporate Event",
    price: 100_000,
    image:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=900&q=80&fit=crop",
    eventTypeValue: "corporate",
    included: [
      "Professional event coordination",
      "Branded service stations",
      "Full cutlery & crockery",
      "All pepper soup varieties",
      "Extensive side dish selection",
      "Setup & teardown crew",
    ],
    highlights: [
      "Ideal for 50\u2013500 guests",
      "Boardroom lunches to gala dinners",
      "Professional uniformed staff",
      "Corporate branding options",
    ],
  },
  "Wedding Reception": {
    title: "Wedding Reception",
    price: 200_000,
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=80&fit=crop",
    eventTypeValue: "wedding",
    included: [
      "Dedicated event manager",
      "Elegant service setup",
      "Premium tableware",
      "Full menu with all varieties",
      "Complete side dish buffet",
      "Pre-event tasting session",
    ],
    highlights: [
      "Perfect for 100\u20131,000+ guests",
      "Tasting session included",
      "Elegant presentation",
      "Coordinated with your wedding planner",
    ],
  },
  "Private Dining": {
    title: "Private Dining",
    price: 30_000,
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80&fit=crop",
    eventTypeValue: "private_dining",
    included: [
      "Personal chef experience",
      "Intimate table setup",
      "Premium utensils",
      "Choice of 2 pepper soup varieties",
      "Selected sides",
      "Personalized service",
    ],
    highlights: [
      "Ideal for 2\u201320 guests",
      "Chef prepares at your location",
      "Wine pairing available",
      "Perfect for date nights & family gatherings",
    ],
  },
};

/* ─── Modal component ─────────────────────────────────────────────── */

interface CateringServiceModalProps {
  serviceTitle: string | null;
  onClose: () => void;
  onRequestQuote: (eventTypeValue: string) => void;
}

export default function CateringServiceModal({
  serviceTitle,
  onClose,
  onRequestQuote,
}: CateringServiceModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const detail = serviceTitle ? SERVICE_DETAILS[serviceTitle] ?? null : null;
  const isOpen = detail !== null;

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (!isOpen) return;

    // Focus the close button on open
    requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

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
    };

    document.addEventListener("keydown", handleTab);
    return () => document.removeEventListener("keydown", handleTab);
  }, [isOpen]);

  const handleRequestQuote = useCallback(() => {
    if (detail) {
      onRequestQuote(detail.eventTypeValue);
      onClose();
    }
  }, [detail, onRequestQuote, onClose]);

  return (
    <AnimatePresence>
      {isOpen && detail && (
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

          {/* Modal panel */}
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            onClick={onClose}
          >
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label={`${detail.title} details`}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
                duration: 0.3,
              }}
              onClick={(e) => e.stopPropagation()}
              className="
                relative w-full max-w-lg overflow-hidden rounded-2xl
                max-h-[90vh] overflow-y-auto overscroll-contain
                scrollbar-thin
                bg-[#FAFAF9] dark:bg-[#111111] border border-gray-200 dark:border-white/10
                shadow-2xl
              "
            >
              {/* Close button */}
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="
                  absolute top-3 right-3 z-10
                  flex h-9 w-9 items-center justify-center rounded-full
                  bg-black/40 text-white backdrop-blur-sm
                  transition-colors hover:bg-black/60
                  focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon
                  focus-visible:ring-offset-2 focus-visible:ring-offset-transparent
                "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                </svg>
              </button>

              {/* Hero image */}
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image
                  src={detail.image}
                  alt={detail.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 512px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0A0A0A] via-transparent to-transparent" />
              </div>

              {/* Content */}
              <div className="p-5 sm:p-6">
                {/* Title & price */}
                <h3 className="font-serif text-2xl font-bold text-text-primary">
                  {detail.title}
                </h3>
                <p className="mt-1 text-lg font-semibold text-brand-lemon-dark dark:text-brand-lemon">
                  Starting from {formatNGN(detail.price)}
                </p>

                {/* What's Included */}
                <div className="mt-6">
                  <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted">
                    What&rsquo;s Included
                  </h4>
                  <ul className="space-y-2">
                    {detail.included.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-sm text-text-secondary"
                      >
                        <svg
                          className="mt-0.5 h-4 w-4 shrink-0 text-brand-lemon-dark dark:text-brand-lemon"
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
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Highlights */}
                <div className="mt-6">
                  <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted">
                    Key Highlights
                  </h4>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {detail.highlights.map((item) => (
                      <div
                        key={item}
                        className="flex items-start gap-2.5 rounded-xl bg-brand-lemon-dark/5 px-3 py-2 dark:bg-brand-lemon/5"
                      >
                        <svg
                          className="mt-0.5 h-4 w-4 shrink-0 text-brand-lemon-dark dark:text-brand-lemon"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                          />
                        </svg>
                        <span className="text-sm text-text-secondary">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <button
                  type="button"
                  onClick={handleRequestQuote}
                  className="
                    mt-8 w-full inline-flex h-14 items-center justify-center
                    rounded-full bg-brand-lemon px-10
                    text-base font-semibold dark:text-[#0A0A0A]
                    transition-transform hover:scale-[1.03] active:scale-[0.97]
                    focus-visible:outline-none focus-visible:ring-2
                    focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon
                    focus-visible:ring-offset-2
                    focus-visible:ring-offset-white dark:focus-visible:ring-offset-brand-dark
                  "
                >
                  Request a Quote
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useState, useCallback, type ReactNode } from "react";
import Image from "next/image";
import { formatNGN } from "@/lib/format";
import CateringServiceModal from "@/components/catering/CateringServiceModal";
import CateringForm from "@/components/catering/CateringForm";

/* ─── Service card data (serialisable — no JSX icons) ─────────────── */

interface ServiceCard {
  title: string;
  price: number;
  description: string;
  image: string;
  /** SVG path data for the icon */
  iconPath: string;
}

const SERVICES: ServiceCard[] = [
  {
    title: "Birthday Party",
    price: 50_000,
    description:
      "Make your birthday celebration unforgettable with a spread of premium pepper soups, sides, and drinks for your guests.",
    image:
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80&fit=crop",
    iconPath:
      "M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.379a48.474 48.474 0 00-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12M12 12.75h.008v.008H12v-.008z",
  },
  {
    title: "Corporate Event",
    price: 100_000,
    description:
      "Impress clients and colleagues with our premium catering. Perfect for office launches, team celebrations, and business dinners.",
    image:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&q=80&fit=crop",
    iconPath:
      "M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z",
  },
  {
    title: "Wedding Reception",
    price: 200_000,
    description:
      "Let us bring the warmth and joy of premium pepper soup to your special day. Full-service catering for your wedding reception.",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80&fit=crop",
    iconPath:
      "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z",
  },
  {
    title: "Private Dining",
    price: 30_000,
    description:
      "An intimate pepper soup experience for small groups. Our chef prepares a bespoke menu in the comfort of your home.",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80&fit=crop",
    iconPath:
      "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z",
  },
];

/* ─── Component ───────────────────────────────────────────────────── */

interface CateringServiceCardsProps {
  /** Content rendered between the service cards section and the inquiry form. */
  children?: ReactNode;
}

/**
 * Interactive service cards grid + modal + catering form.
 *
 * Clicking a card opens a detail modal. The modal's "Request a Quote"
 * CTA closes the modal, scrolls to the inquiry form, and pre-fills
 * the event type select.
 *
 * Accepts `children` to slot server-rendered sections (What's Included,
 * How It Works) between the cards grid and the inquiry form.
 */
export default function CateringServiceCards({ children }: CateringServiceCardsProps) {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [defaultEventType, setDefaultEventType] = useState("");

  const handleRequestQuote = useCallback((eventTypeValue: string) => {
    setDefaultEventType(eventTypeValue);

    // Scroll to inquiry form after a short delay to let the modal close
    requestAnimationFrame(() => {
      const formSection = document.getElementById("inquiry");
      if (formSection) {
        formSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }, []);

  return (
    <>
      {/* ── Service Cards Section ─────────────────────────────── */}
      <section className="border-t border-gray-200 dark:border-[rgba(255,255,255,0.06)] px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center sm:mb-16">
            <h2 className="font-serif text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
              Our Services
            </h2>
            <p className="mx-auto mt-4 max-w-md text-base text-text-secondary">
              Tailored catering packages for every occasion, starting from the
              prices below.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
            {SERVICES.map((service) => (
              <button
                key={service.title}
                type="button"
                onClick={() => setSelectedService(service.title)}
                className="
                  glass-card glass-card-hover overflow-hidden rounded-2xl
                  text-left transition-transform duration-200
                  hover:scale-[1.02] active:scale-[0.98]
                  focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon
                  focus-visible:ring-offset-2
                  focus-visible:ring-offset-white dark:focus-visible:ring-offset-brand-dark
                  cursor-pointer
                "
                aria-label={`View details for ${service.title} catering, starting from ${formatNGN(service.price)}`}
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0A0A0A] via-transparent to-transparent" />
                </div>
                <div className="p-5 sm:p-6">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-lemon-dark/10 text-brand-lemon-dark dark:bg-brand-lemon/10 dark:text-brand-lemon">
                      <svg
                        className="h-7 w-7"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d={service.iconPath}
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-semibold text-text-primary">
                        {service.title}
                      </h3>
                      <p className="text-sm font-semibold text-brand-lemon-dark dark:text-brand-lemon">
                        From {formatNGN(service.price)}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-text-secondary">
                    {service.description}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-text-muted">
                    View details
                    <svg
                      className="h-3.5 w-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Detail Modal ────────────────────────────────────────── */}
      <CateringServiceModal
        serviceTitle={selectedService}
        onClose={() => setSelectedService(null)}
        onRequestQuote={handleRequestQuote}
      />

      {/* ── Slotted content (What's Included, How It Works, etc.) ── */}
      {children}

      {/* ── Inquiry Form (rendered here so defaultEventType is reactive) ── */}
      <section className="px-6 py-20 sm:py-28" id="inquiry">
        <div className="mx-auto max-w-2xl">
          <div className="mb-10 text-center">
            <h2 className="font-serif text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
              Get a Quote
            </h2>
            <p className="mx-auto mt-4 max-w-md text-base text-text-secondary">
              Tell us about your event and we will put together a custom
              catering proposal within 24 hours.
            </p>
          </div>
          <CateringForm defaultEventType={defaultEventType} />
        </div>
      </section>
    </>
  );
}

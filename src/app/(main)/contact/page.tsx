import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Haute Pepper Soup. Reach us by phone, WhatsApp, email, or visit our kitchen in Lekki, Lagos.",
  openGraph: {
    title: "Contact Us | Haute Pepper Soup",
    description:
      "Get in touch with Haute Pepper Soup. Reach us by phone, WhatsApp, email, or visit our kitchen in Lekki, Lagos.",
  },
};

const CONTACT_CARDS = [
  {
    title: "Phone",
    value: "+234 801 234 5678",
    href: "tel:+2348012345678",
    description: "Give us a call during business hours",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
        />
      </svg>
    ),
  },
  {
    title: "WhatsApp",
    value: "Chat with us",
    href: "https://wa.me/2348012345678",
    description: "Quick responses, usually within minutes",
    external: true,
    icon: (
      <svg
        className="h-6 w-6"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
  {
    title: "Email",
    value: "hello@hautepeppersoup.com",
    href: "mailto:hello@hautepeppersoup.com",
    description: "We respond within 24 hours",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
        />
      </svg>
    ),
  },
  {
    title: "Location",
    value: "12 Admiralty Way, Lekki Phase 1",
    href: "#location",
    description: "Visit our kitchen in Lagos",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
        />
      </svg>
    ),
  },
];

const SOCIAL_LINKS = [
  {
    name: "Instagram",
    href: "https://instagram.com/hautepeppersoup",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    name: "X (Twitter)",
    href: "https://x.com/hautepeppersoup",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "https://facebook.com/hautepeppersoup",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
];

export default function ContactPage() {
  return (
    <>
      {/* ── Hero Section ─────────────────────────────────────────── */}
      <section className="relative px-6 pb-20 pt-16 sm:pb-28 sm:pt-24">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
        >
          <div className="absolute inset-0 opacity-30 dark:opacity-100 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(123,44,191,0.15),transparent)]" />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-text-muted">
            Get In Touch
          </p>
          <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight text-text-primary sm:text-5xl md:text-6xl">
            Contact{" "}
            <span className="bg-gradient-to-r from-[#4A6600] to-[#6B8E00] dark:from-[#D1FF00] dark:to-[#a8cc00] bg-clip-text text-transparent">
              Us
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-text-secondary sm:text-lg">
            Have a question, want to place a bulk order, or need help with your
            delivery? We are here to help. Reach out through any of the channels
            below.
          </p>
        </div>
      </section>

      {/* ── Contact Cards ────────────────────────────────────────── */}
      <section className="border-t border-gray-200 dark:border-[rgba(255,255,255,0.06)] px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
            {CONTACT_CARDS.map((card) => (
              <a
                key={card.title}
                href={card.href}
                {...(card.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="glass-card glass-card-hover group flex items-start gap-4 rounded-2xl p-6 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-brand-dark"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-lemon-dark/10 text-brand-lemon-dark dark:bg-brand-lemon/10 dark:text-brand-lemon transition-colors group-hover:bg-brand-lemon-dark/20 dark:group-hover:bg-brand-lemon/20">
                  {card.icon}
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-text-primary">
                    {card.title}
                  </h3>
                  <p className="text-sm font-medium text-brand-lemon-dark dark:text-brand-lemon">
                    {card.value}
                  </p>
                  <p className="mt-1 text-sm text-text-secondary">
                    {card.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Operating Hours ──────────────────────────────────────── */}
      <section className="px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-2xl">
          <div className="glass-card rounded-2xl p-6 sm:p-8">
            <h2 className="mb-6 text-center font-serif text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
              Operating Hours
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-[rgba(255,255,255,0.06)] pb-4">
                <span className="text-sm font-medium text-text-primary">
                  Monday &ndash; Friday
                </span>
                <span className="text-sm tabular-nums text-text-secondary">
                  10:00 AM &ndash; 9:00 PM
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-[rgba(255,255,255,0.06)] pb-4">
                <span className="text-sm font-medium text-text-primary">
                  Saturday &ndash; Sunday
                </span>
                <span className="text-sm tabular-nums text-text-secondary">
                  11:00 AM &ndash; 10:00 PM
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-text-primary">
                  Public Holidays
                </span>
                <span className="text-sm text-text-secondary">
                  Hours may vary
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact Form ─────────────────────────────────────────── */}
      <section className="border-t border-gray-200 dark:border-[rgba(255,255,255,0.06)] px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-2xl">
          <div className="mb-10 text-center">
            <h2 className="font-serif text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
              Send Us a Message
            </h2>
            <p className="mx-auto mt-4 max-w-md text-base text-text-secondary">
              Fill out the form below and we will get back to you as soon as
              possible.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>

      {/* ── Location ─────────────────────────────────────────────── */}
      <section className="px-6 py-20 sm:py-28" id="location">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Text */}
            <div>
              <h2 className="font-serif text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
                Find Us
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">
                Our kitchen is located in the heart of Lekki Phase 1, one of
                Lagos&rsquo; most vibrant neighbourhoods. Stop by to pick up an
                order or say hello to the team.
              </p>
              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3">
                  <svg
                    className="mt-0.5 h-5 w-5 shrink-0 text-brand-lemon-dark dark:text-brand-lemon"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                    />
                  </svg>
                  <p className="text-sm text-text-primary">
                    12 Admiralty Way, Lekki Phase 1, Lagos, Nigeria
                  </p>
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="glass-card relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-[#4A6600]/5 to-[#6B8E00]/5 dark:from-[#D1FF00]/5 dark:to-[#a8cc00]/5" />
              <div className="relative z-10 px-6 text-center">
                <svg
                  className="mx-auto mb-3 h-10 w-10 text-text-muted"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1}
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                  />
                </svg>
                <p className="text-sm font-medium text-text-primary">
                  12 Admiralty Way
                </p>
                <p className="text-sm text-text-secondary">
                  Lekki Phase 1, Lagos
                </p>
                <p className="mt-2 text-xs text-text-muted">
                  Lekki - Epe Expressway
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Social Links ─────────────────────────────────────────── */}
      <section className="border-t border-gray-200 dark:border-[rgba(255,255,255,0.06)] px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="font-serif text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Follow Us
          </h2>
          <p className="mx-auto mt-4 max-w-sm text-base text-text-secondary">
            Stay updated with our latest dishes, events, and promotions on
            social media.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Follow us on ${social.name}`}
                className="flex h-12 w-12 items-center justify-center rounded-xl text-text-secondary transition-colors duration-200 hover:bg-brand-lemon-dark/10 hover:text-brand-lemon-dark dark:hover:bg-brand-lemon/10 dark:hover:text-brand-lemon focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-brand-dark"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

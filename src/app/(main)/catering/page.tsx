import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import CateringServiceCards from "@/components/catering/CateringServiceCards";

export const metadata: Metadata = {
  title: "Catering & Events",
  description:
    "Premium Nigerian pepper soup catering for birthdays, corporate events, weddings, and private dining in Lagos.",
  openGraph: {
    title: "Catering & Events | Haute Pepper Soup",
    description:
      "Premium Nigerian pepper soup catering for birthdays, corporate events, weddings, and private dining in Lagos.",
  },
};

const INCLUSIONS = [
  {
    title: "Full Setup",
    description: "Tables, serving stations, and decor arranged before your guests arrive.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.1-5.1m0 0L3.75 7.5m2.57 2.57L3.75 12.66m7.67 2.51l5.1-5.1m0 0l2.57-2.57m-2.57 2.57l2.57 2.57M3.75 21h16.5M3.75 3h16.5" />
      </svg>
    ),
  },
  {
    title: "Professional Staff",
    description: "Trained servers and kitchen staff to ensure flawless service throughout.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
  },
  {
    title: "Premium Utensils",
    description: "Quality serving bowls, plates, cutlery, and napkins provided for all guests.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
  },
  {
    title: "Variety of Soups",
    description: "Choose from our full menu: goat, catfish, chicken, assorted, and more.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
      </svg>
    ),
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Haute Pepper Soup catered our office Christmas party and the response was incredible. Every bowl was perfect, and their team was professional from start to finish.",
    name: "Folake Adeyemi",
    role: "HR Director, TechBridge Nigeria",
  },
  {
    quote:
      "We had them for our traditional wedding reception and our guests could not stop talking about the pepper soup. Authentic, flavourful, and beautifully presented.",
    name: "Chidera & Obiora Nwankwo",
    role: "Wedding, December 2024",
  },
  {
    quote:
      "The private dining experience was intimate and memorable. Chef Adaora prepared a custom five-course pepper soup tasting menu that blew us away.",
    name: "Ade Ogunbiyi",
    role: "Birthday Celebration",
  },
];

const GALLERY = [
  {
    src: "https://images.unsplash.com/photo-1555244162-803834f70033?w=600&q=80&fit=crop",
    alt: "Beautifully plated pepper soup bowls at a catered event",
  },
  {
    src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80&fit=crop",
    alt: "Professional catering setup with aromatic Nigerian dishes",
  },
  {
    src: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80&fit=crop",
    alt: "Guests enjoying pepper soup at a private dining experience",
  },
  {
    src: "https://images.unsplash.com/photo-1547573854-74d2a71d0826?w=600&q=80&fit=crop",
    alt: "Elegant table setting for a catered event in Lagos",
  },
];

export default function CateringPage() {
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
            Premium Catering
          </p>
          <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight text-text-primary sm:text-5xl md:text-6xl">
            Catering &{" "}
            <span className="bg-gradient-to-r from-[#4A6600] to-[#6B8E00] dark:from-[#D1FF00] dark:to-[#a8cc00] bg-clip-text text-transparent">
              Events
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-text-secondary sm:text-lg">
            Bring the bold flavours of Haute Pepper Soup to your next
            celebration. From intimate private dining to grand wedding
            receptions, we deliver an unforgettable culinary experience.
          </p>
          <a
            href="#inquiry"
            className="mt-8 inline-flex h-14 items-center justify-center rounded-full bg-brand-lemon-dark dark:bg-brand-lemon px-10 text-base font-semibold text-white dark:text-[#0A0A0A] transition-transform hover:scale-[1.03] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-brand-dark shadow-lg"
          >
            Request a Quote
          </a>
        </div>
      </section>

      {/* ── Service Cards + Modal + Inquiry Form (client) ────── */}
      {/* children slot: What's Included + How It Works between cards & form */}
      <CateringServiceCards>
        {/* ── What's Included ──────────────────────────────────── */}
        <section className="px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center sm:mb-16">
              <h2 className="font-serif text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
                What&rsquo;s Included
              </h2>
              <p className="mx-auto mt-4 max-w-md text-base text-text-secondary">
                Every catering package comes with everything you need for a
                seamless event.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:gap-8">
              {INCLUSIONS.map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-4 rounded-2xl p-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-lemon-dark/10 text-brand-lemon-dark dark:bg-brand-lemon/10 dark:text-brand-lemon">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How It Works ───────────────────────────────────────── */}
        <section className="border-t border-gray-200 dark:border-[rgba(255,255,255,0.06)] px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-12 text-center font-serif text-3xl font-bold tracking-tight text-text-primary sm:mb-16 sm:text-4xl">
              How It Works
            </h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6">
              {/* Step 01 — Tell Us About Your Event */}
              <div className="glass-card glass-card-hover p-8 text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-lemon-dark/10 dark:bg-brand-lemon/10">
                  {/* Calendar icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    className="h-8 w-8 text-brand-lemon-dark dark:text-brand-lemon"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                    />
                  </svg>
                </div>
                <span className="mb-2 inline-block font-serif text-sm font-bold text-brand-lemon-dark dark:text-brand-lemon uppercase tracking-widest">
                  Step 01
                </span>
                <h3 className="mb-2 text-xl font-semibold text-text-primary">
                  Tell Us About Your Event
                </h3>
                <p className="text-sm leading-relaxed text-text-secondary">
                  Fill out the inquiry form below with your event details, guest
                  count, and preferences. We will get back to you within 24 hours.
                </p>
              </div>

              {/* Step 02 — Get a Custom Quote */}
              <div className="glass-card glass-card-hover p-8 text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-lemon-dark/10 dark:bg-brand-lemon/10">
                  {/* Menu / document icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    className="h-8 w-8 text-brand-lemon-dark dark:text-brand-lemon"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5"
                    />
                  </svg>
                </div>
                <span className="mb-2 inline-block font-serif text-sm font-bold text-brand-lemon-dark dark:text-brand-lemon uppercase tracking-widest">
                  Step 02
                </span>
                <h3 className="mb-2 text-xl font-semibold text-text-primary">
                  Get a Custom Quote
                </h3>
                <p className="text-sm leading-relaxed text-text-secondary">
                  We will craft a personalised menu and quote tailored to your
                  event, budget, and dietary requirements.
                </p>
              </div>

              {/* Step 03 — We Handle the Rest */}
              <div className="glass-card glass-card-hover p-8 text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-lemon-dark/10 dark:bg-brand-lemon/10">
                  {/* Clipboard check icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    className="h-8 w-8 text-brand-lemon-dark dark:text-brand-lemon"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15a2.25 2.25 0 0 1 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3"
                    />
                  </svg>
                </div>
                <span className="mb-2 inline-block font-serif text-sm font-bold text-brand-lemon-dark dark:text-brand-lemon uppercase tracking-widest">
                  Step 03
                </span>
                <h3 className="mb-2 text-xl font-semibold text-text-primary">
                  We Handle the Rest
                </h3>
              </div>
            </div>
          </div>
        </section>
      </CateringServiceCards>

      {/* ── Testimonials ─────────────────────────────────────────── */}
      <section className="border-t border-gray-200 dark:border-[rgba(255,255,255,0.06)] px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center sm:mb-16">
            <h2 className="font-serif text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
              What Our Clients Say
            </h2>
            <p className="mx-auto mt-4 max-w-md text-base text-text-secondary">
              Hear from some of the events we have had the honour of catering.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {TESTIMONIALS.map((testimonial) => (
              <div
                key={testimonial.name}
                className="glass-card glass-card-hover rounded-2xl p-6 sm:p-8"
              >
                <blockquote className="text-sm italic leading-relaxed text-text-secondary">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <div className="mt-5 flex items-center gap-3">
                  <div className="h-px flex-1 bg-gray-200 dark:bg-[rgba(255,255,255,0.1)]" />
                </div>
                <div className="mt-4">
                  <p className="text-sm font-semibold text-text-primary">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-text-muted">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Gallery ──────────────────────────────────────────────── */}
      <section className="px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center sm:mb-16">
            <h2 className="font-serif text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
              From Our Events
            </h2>
            <p className="mx-auto mt-4 max-w-md text-base text-text-secondary">
              A glimpse into the culinary experiences we have created for our
              clients across Lagos.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
            {GALLERY.map((image) => (
              <div
                key={image.src}
                className="group relative aspect-square overflow-hidden rounded-2xl"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5 dark:ring-white/10" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────── */}
      <section className="border-t border-gray-200 dark:border-[rgba(255,255,255,0.06)] px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="font-serif text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Explore Our Menu
          </h2>
          <p className="mx-auto mt-4 max-w-sm text-base text-text-secondary">
            Curious about what we serve? Browse our full menu to see the pepper
            soup varieties available for your event.
          </p>
          <Link
            href="/menu"
            className="mt-8 inline-flex h-14 items-center justify-center rounded-full bg-brand-lemon px-10 text-base font-semibold dark:text-[#0A0A0A] transition-transform hover:scale-[1.03] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-brand-dark"
          >
            View Menu
          </Link>
        </div>
      </section>
    </>
  );
}

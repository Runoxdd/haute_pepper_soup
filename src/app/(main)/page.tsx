import Link from "next/link";
import Image from "next/image";
import { getActiveMenuItems } from "@/lib/data";
import { formatNGN } from "@/lib/format";

async function getFeaturedDishes() {
  const dishes = await getActiveMenuItems();
  return dishes.slice(0, 3);
}

export default async function HomePage() {
  const featuredDishes = await getFeaturedDishes();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: "Haute Pepper Soup",
    description:
      "Premium Nigerian pepper soup, delivered to your door. Handcrafted with the finest ingredients for an unforgettable taste of Lagos.",
    servesCuisine: "Nigerian",
    url: process.env.NEXT_PUBLIC_APP_URL ?? "https://hautepeppersoup.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Lagos",
      addressCountry: "NG",
    },
    ...(featuredDishes.length > 0 && {
      menu: {
        "@type": "Menu",
        hasMenuSection: [
          {
            "@type": "MenuSection",
            name: "Pepper Soup",
            hasMenuItem: featuredDishes.map((dish) => ({
              "@type": "MenuItem",
              name: dish.name,
              description: dish.description,
              offers: {
                "@type": "Offer",
                price: dish.price,
                priceCurrency: "NGN",
              },
            })),
          },
        ],
      },
    }),
  };

  return (
    <>
      {/* Structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero Section with Background Image ──────────────────────── */}
      <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 text-center">
        {/* Background image */}
        <Image
          src="https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=1920&q=80"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          aria-hidden="true"
        />
        {/* Dark overlay for text legibility */}
        <div className="absolute inset-0 bg-black/40 dark:bg-black/60" aria-hidden="true" />
        {/* Bottom gradient fade into page background */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#FAFAF9] dark:from-[#0A0A0A] to-transparent" aria-hidden="true" />

        <div className="relative z-10 mx-auto max-w-3xl">
          {/* Overline */}
          <p className="mb-6 text-xs font-medium uppercase tracking-[0.3em] text-white/70">
            Premium Nigerian Pepper Soup
          </p>

          {/* Main heading — always white on hero image */}
          <h1 className="font-serif text-5xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl drop-shadow-lg">
            Haute Pepper
            <br />
            <span className="bg-gradient-to-r from-[#D1FF00] to-[#a8cc00] bg-clip-text text-transparent">
              Soup
            </span>
          </h1>

          {/* Tagline */}
          <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-white/80 sm:mt-8 sm:text-lg md:max-w-lg md:text-xl drop-shadow">
            Handcrafted with the finest ingredients. Bold, aromatic, and
            unforgettable — delivered straight to your&nbsp;door.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-center gap-4 sm:mt-12 sm:flex-row sm:justify-center">
            <Link
              href="/menu"
              className="inline-flex h-14 items-center justify-center rounded-full bg-[#D1FF00] px-10 text-base font-semibold text-[#0A0A0A] transition-transform hover:scale-[1.03] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D1FF00] focus-visible:ring-offset-2 focus-visible:ring-offset-black/50 shadow-lg"
            >
              View Menu
            </Link>
            <Link
              href="/catering"
              className="inline-flex h-14 items-center justify-center rounded-full border-2 border-white/30 px-10 text-base font-semibold text-white transition-colors hover:border-white/60 hover:bg-white/10 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/50"
            >
              Catering &amp; Events
            </Link>
          </div>

          {/* Scroll indicator */}
          {featuredDishes.length > 0 && (
            <div className="mt-16 flex flex-col items-center gap-2 sm:mt-20">
              <span className="text-xs uppercase tracking-widest text-white/50">
                Scroll to explore
              </span>
              <div className="h-8 w-px bg-gradient-to-b from-white/40 to-transparent" />
            </div>
          )}
        </div>
      </section>

      {/* ── Featured Dishes Section ──────────────────────────────────── */}
      {featuredDishes.length > 0 && (
        <section className="relative px-6 pb-24 pt-12 sm:pb-32 sm:pt-16">
          <div className="mx-auto max-w-6xl">
            {/* Section heading */}
            <div className="mb-12 text-center sm:mb-16">
              <h2 className="font-serif text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
                Our Signature Dishes
              </h2>
              <p className="mx-auto mt-4 max-w-md text-base text-text-secondary">
                Every bowl is a celebration of bold Nigerian flavours, prepared
                fresh and delivered with care.
              </p>
            </div>

            {/* Dishes grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {featuredDishes.map((dish) => (
                <Link
                  key={dish._id.toString()}
                  href="/menu"
                  className="group glass-card relative overflow-hidden rounded-2xl transition-transform duration-300 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-brand-dark"
                >
                  {/* Dish image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={dish.image_url}
                      alt={dish.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Gradient overlay for text legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0A0A0A] via-transparent to-transparent" />
                  </div>

                  {/* Dish info */}
                  <div className="relative p-5 sm:p-6">
                    <h3 className="font-serif text-xl font-semibold tracking-tight text-text-primary sm:text-2xl">
                      {dish.name}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-text-secondary">
                      {dish.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="tabular-nums text-lg font-semibold text-brand-lemon-dark dark:text-brand-lemon">
                        {formatNGN(dish.price)}
                      </span>
                      <span className="text-xs font-medium uppercase tracking-wider text-text-muted transition-colors group-hover:text-brand-lemon-dark dark:group-hover:text-brand-lemon">
                        Order Now &rarr;
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* View full menu CTA */}
            <div className="mt-12 text-center sm:mt-16">
              <Link
                href="/menu"
                className="inline-flex h-12 items-center justify-center rounded-full border border-gray-300 dark:border-[rgba(255,255,255,0.15)] px-8 text-sm font-medium text-gray-700 dark:text-[rgba(255,255,255,0.7)] transition-colors hover:border-brand-lemon-dark hover:text-brand-lemon-dark dark:hover:border-brand-lemon dark:hover:text-brand-lemon focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-brand-dark"
              >
                View Full Menu
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Social Proof / Brand Statement ───────────────────────────── */}
      <section className="border-t border-gray-200 dark:border-[rgba(255,255,255,0.06)] px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <blockquote className="font-serif text-2xl font-medium italic leading-relaxed text-gray-600 dark:text-[rgba(255,255,255,0.7)] sm:text-3xl">
            &ldquo;The best pepper soup in Lagos, now at your
            doorstep.&rdquo;
          </blockquote>
          <div className="mt-8 flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-gray-300 dark:bg-[rgba(255,255,255,0.15)]" />
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-text-muted">
              Haute Pepper Soup
            </span>
            <div className="h-px w-12 bg-gray-300 dark:bg-[rgba(255,255,255,0.15)]" />
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────── */}
      <section className="px-6 pb-24 sm:pb-32">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-center font-serif text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            How It Works
          </h2>
          <p className="mx-auto mb-12 max-w-md text-center text-text-secondary sm:mb-16">
            Three simple steps to the best pepper soup in Lagos.
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8">
            {/* Step 1: Choose */}
            <div className="glass-card glass-card-hover p-8 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-lemon-dark/10 dark:bg-brand-lemon/10">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-8 w-8 text-brand-lemon-dark dark:text-brand-lemon" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75-1.5.75a3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0L3 16.5m18-12.75-1.5.75a3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0L3 3.75" />
                </svg>
              </div>
              <span className="mb-2 inline-block font-serif text-sm font-bold text-brand-lemon-dark dark:text-brand-lemon uppercase tracking-widest">Step 01</span>
              <h3 className="mb-2 text-xl font-semibold text-text-primary">Choose Your Bowl</h3>
              <p className="text-sm leading-relaxed text-text-secondary">
                Browse our curated menu of premium pepper soups and select your favourite.
              </p>
            </div>

            {/* Step 2: Order */}
            <div className="glass-card glass-card-hover p-8 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-lemon-dark/10 dark:bg-brand-lemon/10">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-8 w-8 text-brand-lemon-dark dark:text-brand-lemon" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-6 18.75h6" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 1.5 1.5 3-3" />
                </svg>
              </div>
              <span className="mb-2 inline-block font-serif text-sm font-bold text-brand-lemon-dark dark:text-brand-lemon uppercase tracking-widest">Step 02</span>
              <h3 className="mb-2 text-xl font-semibold text-text-primary">Place Your Order</h3>
              <p className="text-sm leading-relaxed text-text-secondary">
                Add your delivery details and place your order. No account required.
              </p>
            </div>

            {/* Step 3: Delivery */}
            <div className="glass-card glass-card-hover p-8 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-lemon-dark/10 dark:bg-brand-lemon/10">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-8 w-8 text-brand-lemon-dark dark:text-brand-lemon" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
              </div>
              <span className="mb-2 inline-block font-serif text-sm font-bold text-brand-lemon-dark dark:text-brand-lemon uppercase tracking-widest">Step 03</span>
              <h3 className="mb-2 text-xl font-semibold text-text-primary">We Come To You</h3>
              <p className="text-sm leading-relaxed text-text-secondary">
                We&rsquo;ll reach out on WhatsApp to confirm and deliver straight to your door.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA with Background Image ──────────────────────────── */}
      <section className="relative overflow-hidden px-6 py-24 sm:py-32">
        {/* Background image */}
        <Image
          src="https://images.unsplash.com/photo-1547592166-23ac45744acd?w=1920&q=80"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          aria-hidden="true"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/60" aria-hidden="true" />

        <div className="relative z-10 mx-auto max-w-xl text-center">
          <h2 className="font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl drop-shadow-lg">
            Ready to Order?
          </h2>
          <p className="mx-auto mt-4 max-w-sm text-base text-white/80">
            Experience the finest pepper soup Lagos has to offer. Your next
            favourite meal is just a tap away.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/menu"
              className="inline-flex h-14 items-center justify-center rounded-full bg-[#D1FF00] px-10 text-base font-semibold text-[#0A0A0A] transition-transform hover:scale-[1.03] active:scale-[0.97] shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D1FF00] focus-visible:ring-offset-2 focus-visible:ring-offset-black/50"
            >
              View Menu
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-14 items-center justify-center rounded-full border-2 border-white/30 px-10 text-base font-semibold text-white transition-colors hover:border-white/60 hover:bg-white/10 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/50"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

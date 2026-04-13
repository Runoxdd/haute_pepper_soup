import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Haute Pepper Soup — our story, values, and the team behind Lagos' finest pepper soup delivery.",
  openGraph: {
    title: "About Us | Haute Pepper Soup",
    description:
      "Learn about Haute Pepper Soup — our story, values, and the team behind Lagos' finest pepper soup delivery.",
  },
};

const VALUES = [
  {
    title: "Fresh Ingredients",
    description:
      "We source the freshest meats, fish, and spices from trusted local suppliers every single morning. No shortcuts, no compromise.",
    icon: (
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
          d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
        />
      </svg>
    ),
  },
  {
    title: "Authentic Recipes",
    description:
      "Our recipes are rooted in generations of Nigerian culinary tradition — from the aromatic spice blends to the slow-simmered broths.",
    icon: (
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
          d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
        />
      </svg>
    ),
  },
  {
    title: "Fast Delivery",
    description:
      "From our kitchen to your door in record time. We believe great pepper soup deserves to arrive hot, fresh, and full of flavour.",
    icon: (
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
          d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H18.75m-7.5-2.25h5.25c.621 0 1.125-.504 1.125-1.125v-3c0-.621-.504-1.125-1.125-1.125h-1.5a1.125 1.125 0 00-.956.537l-1.378 2.297a1.125 1.125 0 01-.956.536H11.25m0 0H8.625m2.625 0V7.5m0 0h-2.25A1.125 1.125 0 007.5 8.625v2.625"
        />
      </svg>
    ),
  },
];

const TEAM = [
  {
    name: "Chef Adaora Nwosu",
    role: "Head Chef & Founder",
    bio: "With over 15 years of culinary experience across Lagos and London, Chef Adaora brings world-class technique to traditional Nigerian recipes.",
    image:
      "https://images.unsplash.com/photo-1595257841889-eca2678571fa?w=400&h=400&q=80&fit=crop",
  },
  {
    name: "Emeka Okonkwo",
    role: "Operations Manager",
    bio: "Emeka ensures every order is prepared and delivered to the highest standard. He is the engine behind our seamless delivery operations.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&q=80&fit=crop",
  },
  {
    name: "Ngozi Eze",
    role: "Customer Experience Lead",
    bio: "Ngozi is dedicated to making every customer interaction exceptional. She leads our WhatsApp support and catering consultations.",
    image:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&q=80&fit=crop",
  },
];

export default function AboutPage() {
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
            Our Story
          </p>
          <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight text-text-primary sm:text-5xl md:text-6xl">
            A Passion for{" "}
            <span className="bg-gradient-to-r from-[#4A6600] to-[#6B8E00] dark:from-[#D1FF00] dark:to-[#a8cc00] bg-clip-text text-transparent">
              Pepper Soup
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-text-secondary sm:text-lg">
            Born in the heart of Lagos, Haute Pepper Soup is on a mission to
            elevate Nigeria&rsquo;s most beloved comfort food into a premium
            dining experience — delivered straight to your door.
          </p>
        </div>
      </section>

      {/* ── Our Story Section ────────────────────────────────────── */}
      <section className="border-t border-gray-200 dark:border-[rgba(255,255,255,0.06)] px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/images/pepper-soup-recipe-500x500.webp"
                alt="A bowl of traditional Nigerian pepper soup with aromatic spices"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5 dark:ring-white/10" />
            </div>

            {/* Text */}
            <div>
              <h2 className="font-serif text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
                From Lagos Kitchen to Your Table
              </h2>
              <div className="mt-6 space-y-4 text-sm leading-relaxed text-text-secondary sm:text-base">
                <p>
                  Pepper soup is more than a dish in Nigeria — it is a
                  gathering, a celebration, a remedy, and a tradition passed
                  down through generations. At Haute Pepper Soup, we honour that
                  heritage by preparing every bowl with the same care and
                  authenticity you would find in a Lagos family kitchen.
                </p>
                <p>
                  Founded in 2024, we set out with a simple belief: that premium
                  ingredients, traditional recipes, and modern presentation can
                  come together to create something extraordinary. We source our
                  goat meat from trusted farms, our catfish from local markets
                  at dawn, and our spice blends from recipes perfected over
                  decades.
                </p>
                <p>
                  Every bowl is slow-simmered with uziza leaves, scent leaf,
                  calabash nutmeg, and a proprietary blend of peppers that
                  delivers warmth without overwhelming heat. The result is a
                  pepper soup that is bold, aromatic, and deeply satisfying.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Our Values Section ───────────────────────────────────── */}
      <section className="px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center sm:mb-16">
            <h2 className="font-serif text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
              Our Values
            </h2>
            <p className="mx-auto mt-4 max-w-md text-base text-text-secondary">
              The principles that guide every bowl we prepare and every delivery
              we make.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8">
            {VALUES.map((value) => (
              <div
                key={value.title}
                className="glass-card glass-card-hover rounded-2xl p-6 text-center sm:p-8"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-lemon-dark/10 text-brand-lemon-dark dark:bg-brand-lemon/10 dark:text-brand-lemon">
                  {value.icon}
                </div>
                <h3 className="font-serif text-lg font-semibold text-text-primary">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* ── CTA Section ──────────────────────────────────────────── */}
      <section className="border-t border-gray-200 dark:border-[rgba(255,255,255,0.06)] px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="font-serif text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Ready to Taste the Difference?
          </h2>
          <p className="mx-auto mt-4 max-w-sm text-base text-text-secondary">
            Discover what makes Haute Pepper Soup the finest pepper soup
            experience in Lagos. Browse our menu and order today.
          </p>
          <Link
            href="/menu"
            className="mt-8 inline-flex h-14 items-center justify-center rounded-full bg-brand-lemon px-10 text-base font-semibold dark:text-[#0A0A0A] transition-transform hover:scale-[1.03] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-brand-dark"
          >
            View Our Menu
          </Link>
        </div>
      </section>
    </>
  );
}

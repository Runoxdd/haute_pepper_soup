"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "motion/react";
import { useRecentlyViewedStore } from "@/lib/recently-viewed";

/**
 * Horizontal scrollable row of recently viewed dishes.
 *
 * Renders below the menu gallery. Only shown when there are
 * recently viewed items in localStorage. Each card is a small
 * thumbnail with the dish name overlaid.
 */
export { RecentlyViewed };
export default function RecentlyViewed() {
  const dishes = useRecentlyViewedStore((s) => s.dishes);

  if (dishes.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      aria-label="Recently viewed dishes"
      className="mt-12"
    >
      <h2 className="font-serif text-xl font-semibold text-text-primary mb-4">
        Recently Viewed
      </h2>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {dishes.map((dish) => (
          <RecentCard key={dish.id} id={dish.id} name={dish.name} imageUrl={dish.imageUrl} />
        ))}
      </div>
    </motion.section>
  );
}

function RecentCard({
  id,
  name,
  imageUrl,
}: {
  id: string;
  name: string;
  imageUrl: string;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <a
      href={`#dish-${id}`}
      className="
        group relative flex-shrink-0 w-32 h-32 rounded-xl overflow-hidden
        border border-glass-border
        transition-all duration-200
        hover:border-brand-lemon-dark/30 dark:hover:border-brand-lemon/30
        hover:shadow-md
        focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon
        focus-visible:ring-offset-2
        focus-visible:ring-offset-white dark:focus-visible:ring-offset-brand-dark
      "
      aria-label={`Scroll to ${name}`}
    >
      {imgError ? (
        <div className="absolute inset-0 flex items-center justify-center bg-brand-lemon-dark/20">
          <span
            className="text-2xl font-serif font-bold text-brand-lemon-dark/60"
            aria-hidden="true"
          >
            {name.charAt(0)}
          </span>
        </div>
      ) : (
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="128px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          onError={() => setImgError(true)}
        />
      )}
      {/* Name overlay */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-2 pb-2 pt-6">
        <p className="text-xs font-medium text-white truncate">{name}</p>
      </div>
    </a>
  );
}

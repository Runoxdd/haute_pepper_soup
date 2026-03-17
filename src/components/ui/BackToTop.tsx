"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";

/**
 * Floating back-to-top button.
 *
 * Appears after scrolling down 400px. Positioned bottom-right,
 * above the WhatsApp button. Smooth scrolls to top on click.
 * Fades in/out with AnimatePresence.
 */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          aria-label="Scroll to top"
          className="
            fixed bottom-24 right-6 z-40
            flex h-12 w-12 items-center justify-center
            rounded-full shadow-lg
            bg-white dark:bg-[#1A1A1A]
            border border-gray-200 dark:border-glass-border
            text-text-secondary
            transition-colors duration-200
            hover:text-text-primary hover:bg-gray-50 dark:hover:bg-[#222222]
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon
            focus-visible:ring-offset-2
            focus-visible:ring-offset-white dark:focus-visible:ring-offset-brand-dark
            touch-action-manipulation
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M9.47 6.47a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 1 1-1.06 1.06L10 8.06l-3.72 3.72a.75.75 0 0 1-1.06-1.06l4.25-4.25Z"
              clipRule="evenodd"
            />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

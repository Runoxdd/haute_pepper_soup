"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";

interface ImageZoomProps {
  src: string;
  alt: string;
  open: boolean;
  onClose: () => void;
}

/**
 * Fullscreen image zoom overlay with AnimatePresence enter/exit.
 *
 * Opens on click/tap, closes on backdrop click or Escape key.
 * Supports pinch-to-zoom on mobile via touch-action: pinch-zoom.
 */
export { ImageZoom };
export default function ImageZoom({ src, alt, open, onClose }: ImageZoomProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`Zoomed image: ${alt}`}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close image"
            className="
              absolute top-4 right-4 z-[70]
              flex h-10 w-10 items-center justify-center rounded-full
              bg-white/10 text-white backdrop-blur-sm
              transition-colors duration-200
              hover:bg-white/20
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-white focus-visible:ring-offset-2
              focus-visible:ring-offset-black
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

          {/* Zoomable image container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative h-[80vh] w-[90vw] max-w-3xl"
            style={{ touchAction: "pinch-zoom" }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={src}
              alt={alt}
              fill
              sizes="90vw"
              className="object-contain"
              priority
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import SideSelector from "@/components/menu/SideSelector";
import ImageZoom from "@/components/menu/ImageZoom";
import { useCartStore } from "@/lib/store";
import { useToastStore } from "@/lib/toast";
import { formatNGN } from "@/lib/format";

interface DishCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  availableSides: string[];
}

/**
 * Animated dish card with scroll-reveal, hover effects, and cart integration.
 *
 * Renders a glass card with the dish image, name (serif), price (formatted NGN),
 * description, side selector, and "Add to Order" button. Uses Motion for
 * scroll-triggered entrance animation and image hover zoom.
 */
export { DishCard };
export default function DishCard({
  id,
  name,
  description,
  price,
  imageUrl,
  availableSides,
}: DishCardProps) {
  const [selectedSide, setSelectedSide] = useState(
    availableSides[0] ?? "None",
  );
  const [imageError, setImageError] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const addToast = useToastStore((s) => s.addToast);

  const handleAddToOrder = () => {
    addItem({
      menuItemId: id,
      name,
      side: selectedSide,
      unitPrice: price,
    });
    addToast("Added to cart!", "success");
  };

  const siteUrl = typeof window !== "undefined" ? window.location.origin : "";
  const whatsAppMessage = encodeURIComponent(
    `Check out ${name} at Haute Pepper Soup! ${formatNGN(price)} — ${siteUrl}/menu`,
  );
  const whatsAppUrl = `https://wa.me/?text=${whatsAppMessage}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="will-change-transform"
    >
      <GlassCard hover className="overflow-hidden flex flex-col h-full">
        {/* Dish Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {imageError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-brand-lemon-dark/20">
              <span
                className="text-5xl font-serif font-bold text-brand-lemon-dark/60"
                aria-hidden="true"
              >
                {name.charAt(0)}
              </span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setZoomOpen(true)}
              aria-label={`View ${name} fullscreen`}
              className="h-full w-full cursor-zoom-in"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="h-full w-full will-change-transform"
              >
                <Image
                  src={imageUrl}
                  alt={`${name} — Nigerian pepper soup dish`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                  onError={() => setImageError(true)}
                />
              </motion.div>
            </button>
          )}
        </div>

        {/* Fullscreen Image Zoom */}
        <ImageZoom
          src={imageUrl}
          alt={`${name} — Nigerian pepper soup dish`}
          open={zoomOpen}
          onClose={() => setZoomOpen(false)}
        />

        {/* Card Content */}
        <div className="flex flex-col flex-1 gap-3 p-5">
          {/* Name + Price */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-serif text-xl font-semibold text-text-primary">
              {name}
            </h3>
            <span className="tabular-nums text-lg font-semibold text-brand-lemon-dark dark:text-brand-lemon whitespace-nowrap">
              {formatNGN(price)}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-text-secondary leading-relaxed line-clamp-3">
            {description}
          </p>

          {/* Side Selector */}
          {availableSides.length > 0 && (
            <SideSelector
              sides={availableSides}
              value={selectedSide}
              onChange={setSelectedSide}
            />
          )}

          {/* Add to Order + Share */}
          <div className="mt-auto pt-3 flex items-center gap-2">
            <Button
              variant="primary"
              onClick={handleAddToOrder}
              className="flex-1"
              aria-label={`Add ${name} with ${selectedSide} to order`}
            >
              Add to Order
            </Button>
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Share ${name} on WhatsApp`}
              className="
                flex h-10 w-10 shrink-0 items-center justify-center rounded-xl
                border border-glass-border bg-glass-bg
                text-text-secondary transition-colors duration-200
                hover:bg-[#25D366]/10 hover:text-[#25D366] hover:border-[#25D366]/30
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon
                focus-visible:ring-offset-1
                focus-visible:ring-offset-white dark:focus-visible:ring-offset-brand-dark
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
          </div>
        </div>
      </GlassCard>
    </motion.article>
  );
}

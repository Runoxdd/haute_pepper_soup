"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import SideSelector from "@/components/menu/SideSelector";
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
          )}
        </div>

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

          {/* Add to Order */}
          <div className="mt-auto pt-3">
            <Button
              variant="primary"
              onClick={handleAddToOrder}
              className="w-full"
              aria-label={`Add ${name} with ${selectedSide} to order`}
            >
              Add to Order
            </Button>
          </div>
        </div>
      </GlassCard>
    </motion.article>
  );
}

"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, CartStore } from "@/types";

/**
 * Zustand cart store with localStorage persistence.
 *
 * Cart survives page refresh and browser close — critical for
 * flaky Nigerian mobile connections where users may lose signal
 * mid-order.
 *
 * Merge key: `${menuItemId}_${side.toLowerCase().trim()}`
 * If the same dish + side combination is added again, quantity increments.
 */
export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const mergeKey = `${item.menuItemId}_${item.side.toLowerCase().trim()}`;
          const existingIndex = state.items.findIndex(
            (i) =>
              `${i.menuItemId}_${i.side.toLowerCase().trim()}` === mergeKey,
          );

          if (existingIndex !== -1) {
            const updated = [...state.items];
            updated[existingIndex] = {
              ...updated[existingIndex],
              quantity: updated[existingIndex].quantity + 1,
            };
            return { items: updated };
          }

          return { items: [...state.items, { ...item, quantity: 1 }] };
        }),

      removeItem: (menuItemId, side) =>
        set((state) => ({
          items: state.items.filter(
            (i) =>
              !(
                i.menuItemId === menuItemId &&
                i.side.toLowerCase().trim() === side.toLowerCase().trim()
              ),
          ),
        })),

      updateQuantity: (menuItemId, side, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter(
                (i) =>
                  !(
                    i.menuItemId === menuItemId &&
                    i.side.toLowerCase().trim() === side.toLowerCase().trim()
                  ),
              ),
            };
          }

          return {
            items: state.items.map((i) =>
              i.menuItemId === menuItemId &&
              i.side.toLowerCase().trim() === side.toLowerCase().trim()
                ? { ...i, quantity: Math.min(quantity, 100) }
                : i,
            ),
          };
        }),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: "haute-pepper-cart",
    },
  ),
);

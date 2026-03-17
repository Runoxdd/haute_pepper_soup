"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RecentlyViewedDish {
  id: string;
  name: string;
  imageUrl: string;
}

interface RecentlyViewedStore {
  dishes: RecentlyViewedDish[];
  addViewed: (dish: RecentlyViewedDish) => void;
}

const MAX_RECENT = 6;

/**
 * Zustand store for recently viewed dishes with localStorage persistence.
 *
 * Stores the last 6 viewed dishes (by "Add to Order" interaction).
 * New entries go to the front; duplicates are removed before re-inserting.
 */
export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
  persist(
    (set) => ({
      dishes: [],

      addViewed: (dish) =>
        set((state) => {
          // Remove duplicate if it exists
          const filtered = state.dishes.filter((d) => d.id !== dish.id);
          // Add to front, cap at MAX_RECENT
          return { dishes: [dish, ...filtered].slice(0, MAX_RECENT) };
        }),
    }),
    {
      name: "haute-recently-viewed",
    },
  ),
);

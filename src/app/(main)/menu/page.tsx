import type { Metadata } from "next";
import { getActiveMenuItems } from "@/lib/data";
import { MenuGallery } from "@/components/menu/MenuGallery";
import { RecentlyViewed } from "@/components/menu/RecentlyViewed";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Browse our premium Nigerian pepper soup menu. Goat, catfish, chicken and more — handcrafted and delivered fresh in Lagos.",
  openGraph: {
    title: "Menu | Haute Pepper Soup",
    description:
      "Browse our premium Nigerian pepper soup menu. Handcrafted and delivered fresh in Lagos.",
  },
};

export default async function MenuPage() {
  const dishes = await getActiveMenuItems();

  return (
    <div className="px-6 pb-24 pt-8 sm:pt-12">
      <div className="mx-auto max-w-6xl">
        {/* Page heading */}
        <div className="mb-10 text-center sm:mb-14">
          <h1 className="font-serif text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
            Our Menu
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base text-text-secondary">
            Premium pepper soups, handcrafted with the boldest ingredients.
            Pick your bowl and we&rsquo;ll bring it to you.
          </p>
        </div>

        {/* Menu gallery — client component handles cards, animations, add-to-cart */}
        {dishes.length > 0 ? (
          <MenuGallery
            dishes={JSON.parse(JSON.stringify(dishes))}
          />
        ) : (
          <div className="py-20 text-center">
            <p className="text-lg text-text-secondary">
              Our menu is being prepared. Check back soon!
            </p>
          </div>
        )}

        {/* Recently viewed dishes — client component, renders from localStorage */}
        <RecentlyViewed />
      </div>
    </div>
  );
}

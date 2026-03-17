import DishCard from "@/components/menu/DishCard";

interface DishData {
  _id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  available_sides: string[];
}

interface MenuGalleryProps {
  dishes: DishData[];
}

/**
 * Server component wrapper for the menu grid layout.
 *
 * Receives dishes as props (fetched server-side) and renders them
 * in a responsive grid: 1 column on mobile, 2 on tablet, 3 on desktop.
 * Shows an empty state message when no dishes are available.
 */
export { MenuGallery };
export default function MenuGallery({ dishes }: MenuGalleryProps) {
  if (dishes.length === 0) {
    return (
      <section
        className="flex flex-col items-center justify-center py-20 text-center"
        aria-label="Empty menu"
      >
        <p className="font-serif text-2xl text-text-secondary">
          No dishes available yet.
        </p>
        <p className="mt-2 text-text-muted">
          Check back soon!
        </p>
      </section>
    );
  }

  return (
    <section aria-label="Menu dishes">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {dishes.map((dish) => (
          <DishCard
            key={dish._id}
            id={dish._id}
            name={dish.name}
            description={dish.description}
            price={dish.price}
            imageUrl={dish.image_url}
            availableSides={dish.available_sides}
          />
        ))}
      </div>
    </section>
  );
}

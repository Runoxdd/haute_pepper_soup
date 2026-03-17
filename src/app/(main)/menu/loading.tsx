export default function MenuLoading() {
  return (
    <div className="px-6 pb-24 pt-8 sm:pt-12">
      <div className="mx-auto max-w-6xl">
        {/* Page heading skeleton */}
        <div className="mb-10 text-center sm:mb-14">
          <div className="mx-auto h-10 w-48 animate-pulse rounded-lg bg-gray-200 dark:bg-[rgba(255,255,255,0.08)] sm:h-12 sm:w-56" />
          <div className="mx-auto mt-4 h-5 w-72 animate-pulse rounded bg-gray-100 dark:bg-[rgba(255,255,255,0.05)]" />
        </div>

        {/* Dish card skeletons */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="glass-card overflow-hidden rounded-2xl"
            >
              {/* Image skeleton */}
              <div className="aspect-[4/3] animate-pulse bg-gray-100 dark:bg-[rgba(255,255,255,0.06)]" />
              {/* Content skeleton */}
              <div className="p-5 sm:p-6">
                <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-[rgba(255,255,255,0.08)]" />
                <div className="mt-3 h-4 w-full animate-pulse rounded bg-gray-100 dark:bg-[rgba(255,255,255,0.05)]" />
                <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-gray-100 dark:bg-[rgba(255,255,255,0.05)]" />
                <div className="mt-4 flex items-center justify-between">
                  <div className="h-6 w-20 animate-pulse rounded bg-gray-200 dark:bg-[rgba(255,255,255,0.08)]" />
                  <div className="h-8 w-24 animate-pulse rounded-full bg-gray-100 dark:bg-[rgba(255,255,255,0.06)]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

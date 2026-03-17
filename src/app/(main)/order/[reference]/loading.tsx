export default function OrderLoading() {
  return (
    <div className="px-6 pb-24 pt-8 sm:pt-12">
      <div className="mx-auto max-w-lg">
        {/* Header skeleton */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-pulse rounded-full bg-gray-100 dark:bg-[rgba(255,255,255,0.06)]" />
          <div className="mx-auto h-8 w-48 animate-pulse rounded-lg bg-gray-200 dark:bg-[rgba(255,255,255,0.08)]" />
          <div className="mx-auto mt-2 h-4 w-40 animate-pulse rounded bg-gray-100 dark:bg-[rgba(255,255,255,0.05)]" />
        </div>

        {/* Order card skeleton */}
        <div className="glass-card rounded-2xl p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-[rgba(255,255,255,0.08)] pb-4">
            <div>
              <div className="h-3 w-16 animate-pulse rounded bg-gray-100 dark:bg-[rgba(255,255,255,0.05)]" />
              <div className="mt-2 h-7 w-28 animate-pulse rounded bg-gray-200 dark:bg-[rgba(255,255,255,0.08)]" />
            </div>
            <div className="h-6 w-20 animate-pulse rounded-full bg-gray-100 dark:bg-[rgba(255,255,255,0.06)]" />
          </div>

          <div className="mt-5 space-y-3">
            <div className="h-3 w-12 animate-pulse rounded bg-gray-100 dark:bg-[rgba(255,255,255,0.05)]" />
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="h-4 w-40 animate-pulse rounded bg-gray-100 dark:bg-[rgba(255,255,255,0.06)]" />
                <div className="h-4 w-16 animate-pulse rounded bg-gray-100 dark:bg-[rgba(255,255,255,0.06)]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

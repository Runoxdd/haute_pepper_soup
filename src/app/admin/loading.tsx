export default function AdminLoading() {
  return (
    <div>
      <div className="mb-8">
        <div className="h-8 w-40 animate-pulse rounded-lg bg-gray-200 dark:bg-[rgba(255,255,255,0.08)]" />
        <div className="mt-2 h-4 w-64 animate-pulse rounded bg-gray-100 dark:bg-[rgba(255,255,255,0.05)]" />
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="glass-card rounded-xl p-5">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 animate-pulse rounded-lg bg-gray-100 dark:bg-[rgba(255,255,255,0.06)]" />
              <div className="flex-1">
                <div className="h-4 w-20 animate-pulse rounded bg-gray-100 dark:bg-[rgba(255,255,255,0.05)]" />
                <div className="mt-2 h-7 w-16 animate-pulse rounded bg-gray-200 dark:bg-[rgba(255,255,255,0.08)]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

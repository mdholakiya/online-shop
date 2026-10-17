// Grey placeholder cards shown while products load
export default function ProductGridSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading products"
      className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3"
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-2xl bg-paper p-2 ring-1 ring-line/60">
          <div className="aspect-[3/4] animate-pulse rounded-xl bg-line" />
          <div className="space-y-2 px-2 pt-3 pb-2">
            <div className="h-4 w-2/3 animate-pulse rounded bg-line" />
            <div className="h-4 w-16 animate-pulse rounded bg-line" />
          </div>
        </div>
      ))}
      <span className="sr-only">Loading products…</span>
    </div>
  );
}

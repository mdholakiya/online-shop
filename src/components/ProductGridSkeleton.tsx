// Grey placeholder cards shown while products load
const shapes = ["aspect-[3/4]", "aspect-[2/3]", "aspect-[4/5]"];

export default function ProductGridSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading products"
      className="columns-2 gap-3 sm:gap-5 lg:columns-3"
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="mb-3 break-inside-avoid sm:mb-5">
          <div
            className={`animate-pulse rounded-lg bg-line ${shapes[i % shapes.length]}`}
          />
          <div className="mt-3 flex justify-between gap-3">
            <div className="h-4 w-2/3 animate-pulse rounded bg-line" />
            <div className="h-4 w-12 animate-pulse rounded bg-line" />
          </div>
        </div>
      ))}
      <span className="sr-only">Loading products…</span>
    </div>
  );
}

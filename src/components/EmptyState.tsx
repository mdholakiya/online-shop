// Friendly message when there are no products yet
export default function EmptyState() {
  return (
    <div className="mx-auto max-w-sm py-12 text-center">
      {/* Simple hanger icon */}
      <svg
        aria-hidden="true"
        viewBox="0 0 48 48"
        className="mx-auto size-14 text-accent"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M24 14a4 4 0 1 1 4-4c0 2-4 3-4 6v2" />
        <path d="M24 18 6 32a2 2 0 0 0 1.2 3.6h33.6A2 2 0 0 0 42 32Z" />
      </svg>
      <h2 className="mt-6 font-serif text-3xl">The rails are empty</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        New dresses are on their way. Please check back soon.
      </p>
    </div>
  );
}

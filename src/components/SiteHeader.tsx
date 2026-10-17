import Link from "next/link";

// Announcement bar + sticky top navigation for the public shop
export default function SiteHeader() {
  return (
    <>
      <div className="bg-ink px-4 py-2 text-center text-[11px] tracking-[0.2em] text-paper uppercase sm:text-xs">
        Call or email us to order any dress
      </div>

      <nav
        aria-label="Main"
        className="sticky top-0 z-30 border-b border-line bg-cream/85 backdrop-blur-md"
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="font-serif text-2xl font-semibold tracking-tight">
            Maison <span className="text-accent">Lookbook</span>
          </Link>
          <a
            href="#collection"
            className="rounded-full px-3 py-2 text-sm transition hover:bg-blush hover:text-accent"
          >
            Collection
          </a>
        </div>
      </nav>
    </>
  );
}

import { Suspense } from "react";
import { getProducts } from "@/lib/products";
import SiteHeader from "@/components/SiteHeader";
import ProductGrid from "@/components/ProductGrid";
import ProductGridSkeleton from "@/components/ProductGridSkeleton";
import EmptyState from "@/components/EmptyState";
import ContactSection from "@/components/ContactSection";

// Public home page: header + product grid + contact
export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <header className="relative overflow-hidden bg-linear-to-b from-blush via-blush/60 to-cream px-5 pt-16 pb-14 text-center sm:pt-24 sm:pb-20">
          {/* Soft decorative circles */}
          <div aria-hidden="true" className="absolute -top-24 -left-24 size-72 rounded-full bg-accent/10 blur-3xl" />
          <div aria-hidden="true" className="absolute -right-20 -bottom-24 size-72 rounded-full bg-accent/10 blur-3xl" />

          <p className="relative inline-block rounded-full bg-paper px-4 py-1.5 text-xs font-medium tracking-[0.3em] text-accent uppercase shadow-sm">
            New Collection
          </p>
          <h1 className="relative mt-5 font-serif text-5xl leading-[1.05] font-medium sm:text-7xl">
            Dresses made to <em className="font-normal text-accent">be loved</em>
          </h1>
          <p className="relative mx-auto mt-5 max-w-md text-sm leading-relaxed text-muted sm:text-base">
            Handpicked styles for every occasion. Tap any dress to see details,
            then call or email us to order.
          </p>
          <a
            href="#collection"
            className="relative mt-8 inline-block rounded-full bg-ink px-7 py-3 text-sm font-medium text-paper shadow-lg shadow-ink/10 transition hover:bg-accent"
          >
            Shop the collection
          </a>
        </header>

        <section
          id="collection"
          aria-labelledby="collection-heading"
          className="mx-auto max-w-6xl scroll-mt-20 px-4 pt-12 pb-20 sm:px-6 sm:pt-16"
        >
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 id="collection-heading" className="font-serif text-3xl sm:text-4xl">
              The Collection
            </h2>
            <span className="hidden h-px flex-1 bg-line sm:block" />
          </div>

          {/* Skeleton shows while products load */}
          <Suspense fallback={<ProductGridSkeleton />}>
            <Products />
          </Suspense>
        </section>
      </main>

      <footer className="border-t border-line bg-paper py-8 text-center text-xs text-muted">
        Maison Lookbook · Made with care
      </footer>
    </>
  );
}

// Server component that fetches products from Supabase
async function Products() {
  const products = await getProducts();

  if (products.length === 0) {
    return <EmptyState />;
  }
  return (
    <>
      <ProductGrid products={products} />
      {/* Contact details from the most recently added product */}
      <ContactSection contact={products[0]} />
    </>
  );
}

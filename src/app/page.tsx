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
        {/* Hero: just the shop name */}
        <header className="relative overflow-hidden bg-linear-to-b from-blush via-blush/60 to-cream px-5 py-8 text-center sm:py-10">
          {/* Soft decorative circles */}
          <div aria-hidden="true" className="absolute -top-24 -left-24 size-72 rounded-full bg-accent/10 blur-3xl" />
          <div aria-hidden="true" className="absolute -right-20 -bottom-24 size-72 rounded-full bg-accent/10 blur-3xl" />

          <h1 className="relative font-serif text-5xl leading-none font-medium sm:text-7xl">
            Rutu <em className="font-normal text-accent">Fashion</em>
          </h1>
        </header>

        <section
          id="collection"
          aria-labelledby="collection-heading"
          className="mx-auto max-w-6xl scroll-mt-20 px-4 pt-6 pb-20 sm:px-6 sm:pt-8"
        >
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 id="collection-heading" className="font-serif text-3xl sm:text-4xl">
              The Collection
            </h2>
            <span className="hidden h-px flex-1 bg-line sm:block" />
          </div>

          {/* Skeleton shows while products load */}
          <Suspense fallback={<ProductGridSkeleton />}>
            <Products />
          </Suspense>

          <ContactSection />
        </section>
      </main>

      <footer className="border-t border-line bg-paper py-8 text-center text-xs text-muted">
        Rutu Fashion
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
  return <ProductGrid products={products} />;
}

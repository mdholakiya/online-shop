import { Suspense } from "react";
import { getProducts } from "@/lib/products";
import ProductGrid from "@/components/ProductGrid";
import ProductGridSkeleton from "@/components/ProductGridSkeleton";
import EmptyState from "@/components/EmptyState";

// Public home page: header + product grid
export default function HomePage() {
  return (
    <main className="flex-1">
      <header className="mx-auto max-w-6xl px-5 pt-14 pb-10 text-center sm:pt-20 sm:pb-14">
        <p className="text-xs tracking-[0.3em] text-accent uppercase">
          The Collection
        </p>
        <h1 className="mt-4 font-serif text-5xl leading-[1.05] font-medium sm:text-7xl">
          Maison <em className="font-normal">Lookbook</em>
        </h1>
        <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-muted sm:text-base">
          Dresses chosen with care. Tap any piece to see the details and how to
          reach us.
        </p>
      </header>

      <section
        aria-label="Products"
        className="mx-auto max-w-6xl px-4 pb-24 sm:px-6"
      >
        {/* Skeleton shows while products load */}
        <Suspense fallback={<ProductGridSkeleton />}>
          <Products />
        </Suspense>
      </section>

      <footer className="border-t border-line py-8 text-center text-xs text-muted">
        Maison Lookbook · Made with care
      </footer>
    </main>
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

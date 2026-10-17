"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";

// Masonry grid (CSS columns) + the popup for the clicked product
export default function ProductGrid({ products }: { products: Product[] }) {
  const [selected, setSelected] = useState<Product | null>(null);

  return (
    <>
      <ul className="columns-2 gap-3 sm:gap-5 lg:columns-3">
        {products.map((product, index) => (
          <li key={product.id} className="mb-3 break-inside-avoid sm:mb-5">
            <ProductCard
              product={product}
              index={index}
              onOpen={() => setSelected(product)}
            />
          </li>
        ))}
      </ul>

      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </>
  );
}

"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";

// Even grid (all images the same size) + the popup for the clicked product
export default function ProductGrid({ products }: { products: Product[] }) {
  const [selected, setSelected] = useState<Product | null>(null);

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
        {products.map((product, index) => (
          <li key={product.id}>
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

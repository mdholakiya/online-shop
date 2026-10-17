import Image from "next/image";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";

// Cycle through tall portrait shapes for a lookbook "masonry" rhythm
const shapes = ["aspect-[3/4]", "aspect-[2/3]", "aspect-[4/5]"];

type Props = {
  product: Product;
  index: number;
  onOpen: () => void;
};

export default function ProductCard({ product, index, onOpen }: Props) {
  const soldOut = product.quantity === 0;

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      aria-label={`View details for ${product.name}`}
      className="group animate-fade-up block w-full cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      <div
        className={`relative overflow-hidden rounded-lg bg-line ${shapes[index % shapes.length]}`}
      >
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          // Grid is 2 columns on mobile, 3 on large screens (max ~1150px wide)
          sizes="(min-width: 1152px) 370px, (min-width: 1024px) 33vw, 50vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          preload={index < 2} // load the first images early
        />
        {soldOut && (
          <span className="absolute top-3 left-3 rounded-full bg-paper/90 px-3 py-1 text-[11px] tracking-wider uppercase">
            Sold out
          </span>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-3 px-0.5">
        <h2 className="font-serif text-lg leading-tight sm:text-xl">
          {product.name}
        </h2>
        <p className="shrink-0 text-sm text-muted">
          {formatPrice(product.price)}
        </p>
      </div>
    </button>
  );
}

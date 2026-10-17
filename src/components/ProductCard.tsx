import Image from "next/image";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";

type Props = {
  product: Product;
  index: number;
  onOpen: () => void;
};

export default function ProductCard({ product, index, onOpen }: Props) {
  const soldOut = product.quantity === 0;
  const lowStock = !soldOut && product.quantity <= 3;

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      aria-label={`View details for ${product.name}`}
      className="group animate-fade-up block h-full w-full cursor-pointer rounded-2xl bg-paper p-2 text-left shadow-sm ring-1 ring-line/60 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      <div
        className="relative aspect-[3/4] overflow-hidden rounded-xl bg-blush" // same portrait size for every card
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

        {/* Stock badges (text, not just color) */}
        {soldOut && (
          <span className="absolute top-3 left-3 rounded-full bg-ink/85 px-3 py-1 text-[11px] font-medium tracking-wider text-paper uppercase">
            Sold out
          </span>
        )}
        {lowStock && (
          <span className="absolute top-3 left-3 rounded-full bg-accent px-3 py-1 text-[11px] font-medium tracking-wider text-paper uppercase">
            Only {product.quantity} left
          </span>
        )}

        {/* "View details" pill slides up on hover */}
        <span className="absolute inset-x-3 bottom-3 translate-y-2 rounded-full bg-paper/95 py-2 text-center text-xs font-medium tracking-wide opacity-0 shadow transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          View details
        </span>
      </div>

      <div className="px-2 pt-3 pb-2">
        <h3 className="font-serif text-lg leading-tight sm:text-xl">
          {product.name}
        </h3>
        <p className="mt-1 text-sm font-semibold text-accent">
          {formatPrice(product.price)}
        </p>
      </div>
    </button>
  );
}

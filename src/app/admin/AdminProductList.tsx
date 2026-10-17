import Image from "next/image";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";

const dateFormatter = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" });

// Grid of existing products for the admin
export default function AdminProductList({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <p className="mt-4 rounded-2xl border-2 border-dashed border-line bg-paper p-10 text-center text-sm text-muted">
        No products yet. Add your first dress above.
      </p>
    );
  }

  return (
    <ul className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <li key={p.id} className="overflow-hidden rounded-2xl bg-paper shadow-sm ring-1 ring-line">
          <div className="relative aspect-[4/5] bg-blush">
            <Image
              src={p.image_url}
              alt={p.name}
              fill
              sizes="(min-width: 1024px) 270px, (min-width: 768px) 33vw, 50vw"
              className="object-cover"
            />
            <StockBadge quantity={p.quantity} />
          </div>
          <div className="p-3 sm:p-4">
            <p className="truncate font-serif text-lg leading-tight">{p.name}</p>
            <p className="mt-0.5 text-sm font-semibold text-accent">
              {formatPrice(p.price)}
            </p>
            <p className="mt-2 text-xs text-muted">
              Added {dateFormatter.format(new Date(p.created_at))}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

// Text label + color so meaning doesn't rely on color alone
function StockBadge({ quantity }: { quantity: number }) {
  const style =
    quantity === 0
      ? "bg-ink/85 text-paper"
      : quantity <= 3
        ? "bg-amber-100 text-amber-900"
        : "bg-emerald-100 text-emerald-900";
  const label = quantity === 0 ? "Sold out" : `${quantity} in stock`;

  return (
    <span className={`absolute top-2 left-2 rounded-full px-2.5 py-1 text-[11px] font-medium ${style}`}>
      {label}
    </span>
  );
}

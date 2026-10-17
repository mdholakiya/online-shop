import Image from "next/image";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";

const dateFormatter = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });

// Simple list of existing products for the admin
export default function AdminProductList({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <p className="mt-4 rounded-lg border border-dashed border-line p-8 text-center text-sm text-muted">
        No products yet. Add your first dress above.
      </p>
    );
  }

  return (
    <ul className="mt-4 divide-y divide-line rounded-lg border border-line bg-paper">
      {products.map((p) => (
        <li key={p.id} className="flex items-center gap-4 p-3 sm:p-4">
          <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded bg-line">
            <Image
              src={p.image_url}
              alt={p.name}
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-serif text-lg">{p.name}</p>
            <p className="text-sm text-muted">
              {formatPrice(p.price)} · {p.quantity} in stock
            </p>
          </div>
          <p className="hidden text-xs text-muted sm:block">
            {dateFormatter.format(new Date(p.created_at))}
          </p>
        </li>
      ))}
    </ul>
  );
}

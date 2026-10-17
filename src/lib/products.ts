import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";
import type { Product } from "@/lib/types";

// Tag used to refresh the cached list after the admin adds a product
export const PRODUCTS_TAG = "products";

// Public product list, cached so the shop page loads fast.
export async function getProducts(): Promise<Product[]> {
  "use cache";
  cacheTag(PRODUCTS_TAG);
  cacheLife("hours");

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    // Throwing (instead of returning []) means errors are never cached
    throw new Error(`Could not load products: ${error.message}`);
  }

  // Postgres "numeric" can arrive as a string, so convert to number
  return (data ?? []).map((p) => ({ ...p, price: Number(p.price) }));
}

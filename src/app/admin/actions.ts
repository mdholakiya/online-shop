"use server";

import { updateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { PRODUCTS_TAG } from "@/lib/products";
import { validateProduct, type FieldErrors, type ProductInput } from "@/lib/validation";

type Result = { ok: true } | { ok: false; message: string; errors?: FieldErrors };

// Saves a new product. The image is already uploaded by the browser;
// we only receive its public URL here.
export async function createProduct(
  input: ProductInput & { image_url: string }
): Promise<Result> {
  const supabase = await createClient();

  // 1) Re-check who is calling (never trust the browser)
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Please log in again." };

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) return { ok: false, message: "Only the admin can add products." };

  // 2) Validate again on the server
  const errors = validateProduct(input);
  const imagePrefix = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/`;
  if (!input.image_url?.startsWith(imagePrefix)) errors.image = "Invalid image.";
  if (Object.keys(errors).length > 0) {
    return { ok: false, message: "Please fix the highlighted fields.", errors };
  }

  // 3) Insert (RLS also blocks non-admins at the database level)
  const { error } = await supabase.from("products").insert({
    name: input.name.trim(),
    description: input.description.trim(),
    price: Number(input.price),
    quantity: Number(input.quantity),
    image_url: input.image_url,
    phone: input.phone.trim(),
    email: input.email.trim(),
    address: input.address.trim(),
  });

  if (error) return { ok: false, message: `Could not save: ${error.message}` };

  // 4) Refresh the cached public product list
  updateTag(PRODUCTS_TAG);
  return { ok: true };
}

// Deletes a product and its image from Storage.
export async function deleteProduct(id: string): Promise<Result> {
  const supabase = await createClient();

  // 1) Re-check who is calling (never trust the browser)
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Please log in again." };

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) return { ok: false, message: "Only the admin can delete products." };

  // 2) Delete the row (RLS also blocks non-admins) and get its image URL back
  const { data, error } = await supabase
    .from("products")
    .delete()
    .eq("id", id)
    .select("image_url");

  if (error) return { ok: false, message: `Could not delete: ${error.message}` };
  if (!data || data.length === 0) return { ok: false, message: "Product not found." };

  // 3) Remove the image file too (not fatal if this fails)
  const marker = "/storage/v1/object/public/product-images/";
  const imageUrl: string = data[0].image_url ?? "";
  const path = imageUrl.includes(marker) ? imageUrl.split(marker)[1] : "";
  if (path) {
    await supabase.storage.from("product-images").remove([decodeURIComponent(path)]);
  }

  // 4) Refresh the cached public product list
  updateTag(PRODUCTS_TAG);
  return { ok: true };
}

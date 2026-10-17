import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/types";
import AddProductForm from "./AddProductForm";
import AdminProductList from "./AdminProductList";
import SignOutButton from "./SignOutButton";

export const metadata: Metadata = { title: "Admin" };

export default function AdminPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-10 sm:py-14">
      <Link
        href="/"
        className="text-xs tracking-[0.25em] text-muted uppercase hover:text-accent"
      >
        ← View shop
      </Link>

      {/* Reading the login cookie must happen inside Suspense */}
      <Suspense fallback={<p className="mt-10 text-sm text-muted">Loading…</p>}>
        <AdminContent />
      </Suspense>
    </main>
  );
}

async function AdminContent() {
  const supabase = await createClient();

  // Double-check login on the server (proxy.ts already redirects)
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  // Logged in, but not the admin email set in the SQL
  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) {
    return (
      <div className="mt-10">
        <h1 className="font-serif text-4xl">Not authorized</h1>
        <p className="mt-3 text-sm text-muted">
          {user.email} is not the admin account.
        </p>
        <div className="mt-6">
          <SignOutButton />
        </div>
      </div>
    );
  }

  // Fresh (uncached) list for the admin
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  const products = (data ?? []).map((p) => ({
    ...p,
    price: Number(p.price),
  })) as Product[];

  return (
    <>
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl font-medium sm:text-5xl">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted">Signed in as {user.email}</p>
        </div>
        <SignOutButton />
      </div>

      <section aria-labelledby="add-heading" className="mt-10">
        <h2 id="add-heading" className="font-serif text-2xl">
          Add a product
        </h2>
        <AddProductForm />
      </section>

      <section aria-labelledby="list-heading" className="mt-14">
        <h2 id="list-heading" className="font-serif text-2xl">
          Products ({products.length})
        </h2>
        {error ? (
          <p role="alert" className="mt-4 text-sm text-accent">
            Could not load products: {error.message}
          </p>
        ) : (
          <AdminProductList products={products} />
        )}
      </section>
    </>
  );
}

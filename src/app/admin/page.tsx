import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/types";
import { AlertIcon, BoxIcon, TagIcon } from "@/components/icons";
import AddProductForm from "./AddProductForm";
import AdminProductList from "./AdminProductList";
import SignOutButton from "./SignOutButton";

export const metadata: Metadata = { title: "Admin" };

export default function AdminPage() {
  return (
    <div className="min-h-full flex-1 bg-[#faf6f7]">
      {/* Reading the login cookie must happen inside Suspense */}
      <Suspense
        fallback={<p className="p-10 text-center text-sm text-muted">Loading dashboard…</p>}
      >
        <AdminContent />
      </Suspense>
    </div>
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
      <main className="mx-auto max-w-md px-5 py-24 text-center">
        <div className="rounded-3xl bg-paper p-10 shadow-sm ring-1 ring-line">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-blush text-accent">
            <AlertIcon />
          </span>
          <h1 className="mt-5 font-serif text-3xl">Not authorized</h1>
          <p className="mt-3 text-sm text-muted">
            {user.email} is not the admin account.
          </p>
          <div className="mt-6">
            <SignOutButton />
          </div>
        </div>
      </main>
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

  // Quick numbers for the stat cards
  const totalStock = products.reduce((sum, p) => sum + p.quantity, 0);
  const soldOut = products.filter((p) => p.quantity === 0).length;
  const latest = products[0];

  const stats = [
    { label: "Products", value: products.length, note: "in your shop", icon: <TagIcon />, tone: "bg-blush text-accent" },
    { label: "Units in stock", value: totalStock, note: "across all dresses", icon: <BoxIcon />, tone: "bg-emerald-50 text-emerald-700" },
    { label: "Sold out", value: soldOut, note: soldOut ? "need restocking" : "all in stock", icon: <AlertIcon />, tone: "bg-amber-50 text-amber-700" },
  ];

  return (
    <>
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-line bg-paper/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="font-serif text-xl font-semibold sm:text-2xl">
              Maison <span className="text-accent">Lookbook</span>
            </span>
            <span className="rounded-full bg-ink px-2.5 py-0.5 text-[10px] font-medium tracking-widest text-paper uppercase">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="hidden rounded-full px-4 py-2 text-sm transition hover:bg-blush hover:text-accent sm:block"
            >
              View shop ↗
            </Link>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <div>
          <p className="text-sm text-muted">Signed in as {user.email}</p>
          <h1 className="mt-1 font-serif text-4xl font-medium sm:text-5xl">
            Dashboard
          </h1>
        </div>

        {/* Stat cards */}
        <ul className="mt-8 grid gap-4 sm:grid-cols-3">
          {stats.map((s) => (
            <li key={s.label} className="flex items-center gap-4 rounded-2xl bg-paper p-5 shadow-sm ring-1 ring-line">
              <span className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${s.tone}`}>
                {s.icon}
              </span>
              <div>
                <p className="text-xs font-medium tracking-wider text-muted uppercase">{s.label}</p>
                <p className="font-serif text-3xl leading-tight font-semibold">{s.value}</p>
                <p className="text-xs text-muted">{s.note}</p>
              </div>
            </li>
          ))}
        </ul>

        <section aria-labelledby="add-heading" className="mt-10">
          <h2 id="add-heading" className="font-serif text-3xl">
            Add a new dress
          </h2>
          <p className="mt-1 text-sm text-muted">
            Fields marked * are required. Contact details are pre-filled from your last product.
          </p>
          <AddProductForm
            defaultContact={
              latest
                ? { phone: latest.phone, email: latest.email, address: latest.address }
                : undefined
            }
          />
        </section>

        <section aria-labelledby="list-heading" className="mt-14">
          <div className="flex items-baseline justify-between">
            <h2 id="list-heading" className="font-serif text-3xl">
              Your products
            </h2>
            <span className="text-sm text-muted">{products.length} total</span>
          </div>
          {error ? (
            <p role="alert" className="mt-4 rounded-xl bg-blush p-4 text-sm text-accent">
              Could not load products: {error.message}
            </p>
          ) : (
            <AdminProductList products={products} />
          )}
        </section>
      </main>
    </>
  );
}

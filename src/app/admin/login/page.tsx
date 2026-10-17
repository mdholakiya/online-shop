import type { Metadata } from "next";
import Link from "next/link";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Admin login" };

export default function AdminLoginPage() {
  return (
    <main className="grid flex-1 lg:grid-cols-2">
      {/* Left: brand panel (desktop only) */}
      <div className="relative hidden overflow-hidden bg-linear-to-br from-accent via-accent-dark to-ink p-12 text-paper lg:flex lg:flex-col lg:justify-between">
        <div aria-hidden="true" className="absolute -top-32 -right-32 size-96 rounded-full bg-paper/10 blur-3xl" />
        <Link href="/" className="relative font-serif text-3xl font-semibold">
          Rutu Fashion
        </Link>
        <div className="relative">
          <h2 className="font-serif text-5xl leading-tight">
            Manage your <em>collection</em> with ease.
          </h2>
          <p className="mt-4 max-w-sm text-paper/75">
            Add new dresses, set prices and stock, and keep your shop fresh.
          </p>
        </div>
        <p className="relative text-xs text-paper/60">Admin area · Authorized staff only</p>
      </div>

      {/* Right: login form */}
      <div className="flex items-center justify-center bg-cream px-5 py-16">
        <div className="w-full max-w-sm rounded-3xl bg-paper p-8 shadow-xl shadow-accent/5 ring-1 ring-line sm:p-10">
          <Link
            href="/"
            className="text-xs tracking-[0.2em] text-muted uppercase hover:text-accent"
          >
            ← Back to shop
          </Link>
          <h1 className="mt-6 font-serif text-4xl font-medium">Welcome back</h1>
          <p className="mt-2 text-sm text-muted">
            Sign in to manage your products.
          </p>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}

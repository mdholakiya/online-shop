import type { Metadata } from "next";
import Link from "next/link";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Admin login" };

export default function AdminLoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="text-xs tracking-[0.25em] text-muted uppercase hover:text-accent"
        >
          ← Back to shop
        </Link>
        <h1 className="mt-6 font-serif text-4xl font-medium">Admin login</h1>
        <p className="mt-2 text-sm text-muted">
          Sign in to add new dresses to the shop.
        </p>
        <LoginForm />
      </div>
    </main>
  );
}

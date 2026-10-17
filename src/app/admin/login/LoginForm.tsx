"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: String(form.get("email")).trim(),
      password: String(form.get("password")),
    });

    if (error) {
      setError("Wrong email or password. Please try again.");
      setLoading(false);
      return;
    }

    // Logged in → go to the dashboard
    router.replace("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="mt-1.5 w-full rounded-xl border border-line bg-cream/50 px-3.5 py-2.5 transition outline-none focus:border-accent focus:bg-paper focus:ring-4 focus:ring-accent/10"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-1.5 w-full rounded-xl border border-line bg-cream/50 px-3.5 py-2.5 transition outline-none focus:border-accent focus:bg-paper focus:ring-4 focus:ring-accent/10"
        />
      </div>

      {error && (
        <p role="alert" className="rounded-lg bg-blush px-3 py-2 text-sm text-accent">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full cursor-pointer rounded-full bg-accent px-4 py-3.5 shadow-md shadow-accent/20 text-sm font-medium tracking-wide text-paper transition hover:bg-accent-dark disabled:opacity-60"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignOutButton() {
  const router = useRouter();

  async function signOut() {
    await createClient().auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={signOut}
      className="cursor-pointer rounded-md border border-line px-4 py-2 text-sm transition hover:border-accent hover:text-accent"
    >
      Sign out
    </button>
  );
}

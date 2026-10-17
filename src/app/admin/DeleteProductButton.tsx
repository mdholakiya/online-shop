"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteProduct } from "./actions";

// Delete button with a two-step confirm ("Delete" → "Yes, delete" / "Cancel")
export default function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    setError("");
    startTransition(async () => {
      const result = await deleteProduct(id);
      if (!result.ok) {
        setError(result.message);
        setConfirming(false);
        return;
      }
      router.refresh();
    });
  }

  if (!confirming) {
    return (
      <div className="mt-3">
        <button
          type="button"
          onClick={() => setConfirming(true)}
          aria-label={`Delete ${name}`}
          className="w-full cursor-pointer rounded-full border border-line px-3 py-1.5 text-xs font-medium text-muted transition hover:border-accent hover:bg-blush hover:text-accent"
        >
          Delete
        </button>
        {error && (
          <p role="alert" className="mt-2 text-xs text-accent">
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="mt-3 rounded-xl bg-blush p-2.5" role="group" aria-label={`Confirm delete ${name}`}>
      <p className="text-center text-xs font-medium text-accent">Delete this product?</p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setConfirming(false)}
          disabled={pending}
          className="cursor-pointer rounded-full bg-paper px-2 py-1.5 text-xs font-medium ring-1 ring-line transition hover:ring-ink/30 disabled:opacity-60"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={pending}
          autoFocus
          className="cursor-pointer rounded-full bg-accent px-2 py-1.5 text-xs font-semibold text-paper transition hover:bg-accent-dark disabled:opacity-60"
        >
          {pending ? "Deleting…" : "Yes, delete"}
        </button>
      </div>
    </div>
  );
}

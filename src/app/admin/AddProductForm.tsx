"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  ALLOWED_IMAGE_TYPES,
  validateImage,
  validateProduct,
  type FieldErrors,
  type ProductInput,
} from "@/lib/validation";
import { createProduct } from "./actions";

const BUCKET = "product-images";

export default function AddProductForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  // Free the preview URL when it changes or the form unmounts
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // Show a preview as soon as an image is picked
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    const imageError = validateImage(file);
    setErrors((prev) => ({ ...prev, image: imageError }));
    setPreview(file && !imageError ? URL.createObjectURL(file) : null);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    // 1) Read and validate all fields
    const form = new FormData(e.currentTarget);
    const input: ProductInput = {
      name: String(form.get("name") ?? ""),
      description: String(form.get("description") ?? ""),
      price: String(form.get("price") ?? ""),
      quantity: String(form.get("quantity") ?? ""),
      phone: String(form.get("phone") ?? ""),
      email: String(form.get("email") ?? ""),
      address: String(form.get("address") ?? ""),
    };
    const file = form.get("image") as File | null;

    const newErrors = validateProduct(input);
    const imageError = validateImage(file);
    if (imageError) newErrors.image = imageError;

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setStatus("error");
      setMessage("Please fix the highlighted fields.");
      return;
    }

    setStatus("saving");
    const supabase = createClient();

    // 2) Upload the image straight to Supabase Storage
    const ext = file!.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `products/${crypto.randomUUID()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, file!, { contentType: file!.type, cacheControl: "31536000" });

    if (uploadError) {
      setStatus("error");
      setMessage(`Image upload failed: ${uploadError.message}`);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET).getPublicUrl(path);

    // 3) Save the product row on the server
    const result = await createProduct({ ...input, image_url: publicUrl });

    if (!result.ok) {
      // Clean up the uploaded image so it isn't left orphaned
      await supabase.storage.from(BUCKET).remove([path]);
      setErrors(result.errors ?? {});
      setStatus("error");
      setMessage(result.message);
      return;
    }

    // 4) Success: clear the form and refresh the list below
    formRef.current?.reset();
    setPreview(null);
    setErrors({});
    setStatus("success");
    setMessage(`"${input.name.trim()}" was added.`);
    router.refresh();
  }

  const saving = status === "saving";

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      className="mt-5 grid gap-5 rounded-lg border border-line bg-paper p-5 sm:grid-cols-2 sm:p-7"
    >
      <Field label="Name" name="name" error={errors.name} className="sm:col-span-2">
        <input id="name" name="name" type="text" maxLength={120} {...aria("name", errors.name)} className={inputClass(errors.name)} />
      </Field>

      <Field label="Description" name="description" error={errors.description} className="sm:col-span-2">
        <textarea id="description" name="description" rows={4} maxLength={2000} {...aria("description", errors.description)} className={inputClass(errors.description)} />
      </Field>

      <Field label="Price" name="price" error={errors.price}>
        <input id="price" name="price" type="number" inputMode="decimal" min="0" step="0.01" {...aria("price", errors.price)} className={inputClass(errors.price)} />
      </Field>

      <Field label="Quantity" name="quantity" error={errors.quantity}>
        <input id="quantity" name="quantity" type="number" inputMode="numeric" min="0" step="1" {...aria("quantity", errors.quantity)} className={inputClass(errors.quantity)} />
      </Field>

      <Field label="Phone" name="phone" error={errors.phone}>
        <input id="phone" name="phone" type="tel" autoComplete="tel" {...aria("phone", errors.phone)} className={inputClass(errors.phone)} />
      </Field>

      <Field label="Email" name="email" error={errors.email}>
        <input id="email" name="email" type="email" autoComplete="email" {...aria("email", errors.email)} className={inputClass(errors.email)} />
      </Field>

      <Field label="Address" name="address" error={errors.address} className="sm:col-span-2">
        <textarea id="address" name="address" rows={2} {...aria("address", errors.address)} className={inputClass(errors.address)} />
      </Field>

      {/* Image picker + preview */}
      <Field label="Image (max 2 MB)" name="image" error={errors.image} className="sm:col-span-2">
        <div className="flex items-start gap-4">
          <div className="flex h-32 w-24 shrink-0 items-center justify-center overflow-hidden rounded-md border border-dashed border-line bg-cream">
            {preview ? (
              // Local blob preview, so a plain <img> is fine here
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Selected image preview" className="h-full w-full object-cover" />
            ) : (
              <span className="px-2 text-center text-xs text-muted">No image</span>
            )}
          </div>
          <input
            id="image"
            name="image"
            type="file"
            accept={ALLOWED_IMAGE_TYPES.join(",")}
            onChange={handleImageChange}
            {...aria("image", errors.image)}
            className="block w-full text-sm text-muted file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-ink file:px-4 file:py-2 file:text-sm file:text-paper hover:file:bg-accent"
          />
        </div>
      </Field>

      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <button
          type="submit"
          disabled={saving}
          className="cursor-pointer rounded-md bg-accent px-6 py-3 text-sm font-medium tracking-wide text-paper transition hover:bg-accent-dark disabled:opacity-60"
        >
          {saving ? "Saving…" : "Add product"}
        </button>
        {message && (
          <p
            role={status === "error" ? "alert" : "status"}
            className={`text-sm ${status === "error" ? "text-accent" : "text-green-800"}`}
          >
            {message}
          </p>
        )}
      </div>
    </form>
  );
}

/* ---------- Small helpers ---------- */

function Field({
  label,
  name,
  error,
  className = "",
  children,
}: {
  label: string;
  name: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-medium">
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
      {error && (
        <p id={`${name}-error`} className="mt-1 text-xs text-accent">
          {error}
        </p>
      )}
    </div>
  );
}

// Links an input to its error message for screen readers
function aria(name: string, error?: string) {
  return {
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${name}-error` : undefined,
  };
}

function inputClass(error?: string) {
  return `w-full rounded-md border bg-cream/40 px-3 py-2.5 outline-none focus:ring-2 focus:ring-accent/20 ${
    error ? "border-accent" : "border-line focus:border-accent"
  }`;
}

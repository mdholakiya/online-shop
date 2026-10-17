"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { UploadIcon } from "@/components/icons";
import {
  ALLOWED_IMAGE_TYPES,
  validateImage,
  validateProduct,
  type FieldErrors,
  type ProductInput,
} from "@/lib/validation";
import { createProduct } from "./actions";

const BUCKET = "product-images";

type Props = {
  // Pre-fill contact fields with the last product's details
  defaultContact?: { phone: string; email: string; address: string };
};

// Reads the text fields out of the form
function readInput(form: HTMLFormElement): ProductInput {
  const data = new FormData(form);
  const get = (key: string) => String(data.get(key) ?? "");
  return {
    name: get("name"),
    description: get("description"),
    price: get("price"),
    quantity: get("quantity"),
    phone: get("phone"),
    email: get("email"),
    address: get("address"),
  };
}

export default function AddProductForm({ defaultContact }: Props) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");

  // Free the preview URL when it changes or the form unmounts
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // Check a single field when the admin leaves it
  function handleBlur(e: React.FocusEvent<HTMLFormElement>) {
    const name = (e.target as unknown as HTMLInputElement).name;
    if (!name || name === "image" || !formRef.current) return;
    const fieldError = validateProduct(readInput(formRef.current))[name as keyof ProductInput];
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  }

  // Show a preview as soon as an image is picked
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    const imageError = validateImage(file);
    setErrors((prev) => ({ ...prev, image: imageError }));
    setFileName(file?.name ?? "");
    setPreview(file && !imageError ? URL.createObjectURL(file) : null);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    // 1) Read and validate all fields
    const input = readInput(e.currentTarget);
    const file = new FormData(e.currentTarget).get("image") as File | null;

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
    setFileName("");
    setErrors({});
    setStatus("success");
    setMessage(`"${input.name.trim()}" was added to your shop.`);
    router.refresh();
  }

  const saving = status === "saving";

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      onBlur={handleBlur}
      noValidate
      className="mt-5 grid gap-6 lg:grid-cols-[1fr_320px]"
    >
      {/* Left column: text fields */}
      <div className="space-y-6">
        <Card step="1" title="Product details">
          <Field label="Name *" name="name" error={errors.name}>
            <input id="name" name="name" type="text" maxLength={120} placeholder="e.g. Floral Anarkali Dress" {...aria("name", errors.name)} className={inputClass(errors.name)} />
          </Field>
          <Field label="Description *" name="description" error={errors.description}>
            <textarea id="description" name="description" rows={4} maxLength={2000} placeholder="Fabric, fit, sizes, occasion…" {...aria("description", errors.description)} className={inputClass(errors.description)} />
          </Field>
        </Card>

        <Card step="2" title="Price & stock">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Price (₹) *" name="price" error={errors.price}>
              <div className="relative">
                <span aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted">₹</span>
                <input id="price" name="price" type="number" inputMode="decimal" min="0" step="0.01" placeholder="1499" {...aria("price", errors.price)} className={`${inputClass(errors.price)} pl-8`} />
              </div>
            </Field>
            <Field label="Quantity *" name="quantity" error={errors.quantity}>
              <input id="quantity" name="quantity" type="number" inputMode="numeric" min="0" step="1" placeholder="10" {...aria("quantity", errors.quantity)} className={inputClass(errors.quantity)} />
            </Field>
          </div>
        </Card>

        <Card step="3" title="Contact details" hint="Shown to customers on the product popup.">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Phone *" name="phone" error={errors.phone}>
              <input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+91 98765 43210" defaultValue={defaultContact?.phone} {...aria("phone", errors.phone)} className={inputClass(errors.phone)} />
            </Field>
            <Field label="Email *" name="email" error={errors.email}>
              <input id="email" name="email" type="email" autoComplete="email" placeholder="shop@example.com" defaultValue={defaultContact?.email} {...aria("email", errors.email)} className={inputClass(errors.email)} />
            </Field>
          </div>
          <Field label="Address *" name="address" error={errors.address}>
            <textarea id="address" name="address" rows={2} placeholder="Shop address" defaultValue={defaultContact?.address} {...aria("address", errors.address)} className={inputClass(errors.address)} />
          </Field>
        </Card>
      </div>

      {/* Right column: photo + save (sticky on desktop) */}
      <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
        <Card step="4" title="Photo *">
          {/* The whole box is the file picker's label */}
          <label
            htmlFor="image"
            className={`relative flex aspect-[4/5] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed text-center transition focus-within:ring-2 focus-within:ring-accent/30 hover:border-accent hover:bg-blush/40 ${
              errors.image ? "border-accent bg-blush/30" : "border-line bg-cream"
            }`}
          >
            {preview ? (
              <>
                {/* Local blob preview, so a plain <img> is fine here */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="Selected image preview" className="absolute inset-0 h-full w-full object-cover" />
                <span className="absolute inset-x-3 bottom-3 rounded-full bg-paper/95 py-2 text-xs font-medium shadow">
                  Change photo
                </span>
              </>
            ) : (
              <span className="px-6">
                <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-paper text-accent shadow-sm">
                  <UploadIcon />
                </span>
                <span className="mt-3 block text-sm font-medium">Click to upload</span>
                <span className="mt-1 block text-xs text-muted">JPG, PNG, WEBP · max 2 MB</span>
              </span>
            )}
            <input
              id="image"
              name="image"
              type="file"
              accept={ALLOWED_IMAGE_TYPES.join(",")}
              onChange={handleImageChange}
              {...aria("image", errors.image)}
              className="sr-only"
            />
          </label>
          {fileName && !errors.image && (
            <p className="truncate text-xs text-muted">{fileName}</p>
          )}
          {errors.image && (
            <p id="image-error" className="text-xs font-medium text-accent">
              {errors.image}
            </p>
          )}
        </Card>

        <div className="rounded-2xl bg-paper p-5 shadow-sm ring-1 ring-line">
          <button
            type="submit"
            disabled={saving}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold tracking-wide text-paper shadow-md shadow-accent/20 transition hover:bg-accent-dark disabled:opacity-60"
          >
            {saving && (
              <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-paper/40 border-t-paper" />
            )}
            {saving ? "Saving…" : "Add product"}
          </button>
          {message && (
            <p
              role={status === "error" ? "alert" : "status"}
              className={`mt-3 rounded-lg px-3 py-2 text-center text-sm ${
                status === "error" ? "bg-blush text-accent" : "bg-emerald-50 text-emerald-800"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </form>
  );
}

/* ---------- Small helpers ---------- */

function Card({
  step,
  title,
  hint,
  children,
}: {
  step: string;
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="space-y-5 rounded-2xl bg-paper p-5 shadow-sm ring-1 ring-line sm:p-6">
      <legend className="sr-only">{title}</legend>
      <div className="flex items-center gap-3">
        <span aria-hidden="true" className="flex size-7 items-center justify-center rounded-full bg-blush text-xs font-semibold text-accent">
          {step}
        </span>
        <div>
          <p className="font-medium">{title}</p>
          {hint && <p className="text-xs text-muted">{hint}</p>}
        </div>
      </div>
      {children}
    </fieldset>
  );
}

function Field({
  label,
  name,
  error,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium">
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-xs font-medium text-accent">
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
  return `w-full rounded-xl border bg-cream/50 px-3.5 py-2.5 transition outline-none placeholder:text-muted/60 focus:bg-paper focus:ring-4 focus:ring-accent/10 ${
    error ? "border-accent" : "border-line focus:border-accent"
  }`;
}

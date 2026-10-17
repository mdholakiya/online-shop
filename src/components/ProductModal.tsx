"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { MailIcon, PhoneIcon, PinIcon } from "./icons";

type Props = {
  product: Product | null; // null = closed
  onClose: () => void;
};

// Product popup built on the native <dialog> element.
// showModal() gives us: focus kept inside, rest of page inert, Esc to close.
export default function ProductModal({ product, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Keep showing the last product while the close animation plays
  const [shown, setShown] = useState<Product | null>(product);
  if (product && product !== shown) {
    setShown(product);
  }

  // Open/close the dialog and lock page scroll while open
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (product) {
      if (!dialog.open) dialog.showModal();
      document.body.style.overflow = "hidden";
    } else if (dialog.open) {
      dialog.close();
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [product]);

  // Close when clicking the dark backdrop (outside the card)
  function handleClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === dialogRef.current) onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      className="product-modal"
      aria-labelledby="product-modal-title"
      aria-describedby="product-modal-description"
      onClose={onClose} // fires on Esc and on dialog.close()
      onClick={handleClick}
    >
      {shown && (
        <div className="relative max-h-[92dvh] overflow-y-auto md:grid md:max-h-none md:grid-cols-2 md:overflow-hidden">
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close product details"
            autoFocus
            className="absolute top-3 right-3 z-10 flex size-10 cursor-pointer items-center justify-center rounded-full bg-paper/90 text-ink shadow-sm backdrop-blur transition hover:bg-paper focus-visible:outline-2 focus-visible:outline-accent"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>

          {/* Mobile grab handle (decorative) */}
          <div
            aria-hidden="true"
            className="absolute top-2 left-1/2 z-10 h-1 w-10 -translate-x-1/2 rounded-full bg-paper/80 md:hidden"
          />

          {/* Image */}
          <div className="relative h-[52dvh] bg-blush md:h-[min(88vh,44rem)]">
            <Image
              src={shown.image_url}
              alt={shown.name}
              fill
              sizes="(min-width: 768px) 480px, 100vw"
              className="object-cover"
            />
          </div>

          {/* Details */}
          <div className="p-6 sm:p-8 md:h-[min(88vh,44rem)] md:overflow-y-auto md:p-10">
            <h2
              id="product-modal-title"
              className="font-serif text-3xl leading-tight font-medium sm:text-4xl"
            >
              {shown.name}
            </h2>
            <p className="mt-2 text-2xl font-semibold text-accent">
              {formatPrice(shown.price)}
            </p>

            {/* Stock badge (dot + text) */}
            <p
              className={`mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
                shown.quantity > 0
                  ? "bg-emerald-50 text-emerald-800"
                  : "bg-ink/5 text-muted"
              }`}
            >
              <span
                aria-hidden="true"
                className={`size-1.5 rounded-full ${shown.quantity > 0 ? "bg-emerald-600" : "bg-muted"}`}
              />
              {shown.quantity > 0
                ? `In stock · ${shown.quantity} available`
                : "Currently out of stock"}
            </p>

            <p
              id="product-modal-description"
              className="mt-6 text-[15px] leading-relaxed whitespace-pre-line text-ink/85"
            >
              {shown.description || "No description yet."}
            </p>

            {/* Contact: big tap-friendly buttons */}
            <div className="mt-8 rounded-2xl bg-cream p-5 ring-1 ring-line">
              <h3 className="text-xs font-medium tracking-[0.25em] text-muted uppercase">
                Order this dress
              </h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <a
                  href={`tel:${shown.phone.replace(/\s+/g, "")}`}
                  className="flex items-center justify-center gap-2 rounded-full bg-accent px-4 py-3 text-sm font-medium text-paper shadow-sm transition hover:bg-accent-dark"
                >
                  <PhoneIcon className="size-4" />
                  Call {shown.phone}
                </a>
                <a
                  href={`mailto:${shown.email}?subject=${encodeURIComponent(`Enquiry: ${shown.name}`)}`}
                  className="flex items-center justify-center gap-2 rounded-full border border-ink/15 bg-paper px-4 py-3 text-sm font-medium transition hover:border-accent hover:text-accent"
                >
                  <MailIcon className="size-4" />
                  Email us
                </a>
              </div>
              <dl className="mt-5 space-y-2 text-sm">
                <div className="flex gap-2">
                  <dt className="text-muted"><MailIcon className="mt-0.5 size-4" /><span className="sr-only">Email</span></dt>
                  <dd className="min-w-0 break-words">{shown.email}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="text-muted"><PinIcon className="mt-0.5 size-4" /><span className="sr-only">Address</span></dt>
                  <dd className="whitespace-pre-line">{shown.address}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}

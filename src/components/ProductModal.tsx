"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";

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
          <div className="flex flex-col p-6 sm:p-8 md:h-[min(88vh,44rem)] md:overflow-y-auto md:p-10">
            <p className="text-xs font-medium tracking-[0.25em] text-accent uppercase">
              Rutu Fashion
            </p>
            <h2
              id="product-modal-title"
              className="mt-2 font-serif text-3xl leading-tight font-medium sm:text-4xl"
            >
              {shown.name}
            </h2>

            {/* All details as labelled rows */}
            <dl className="mt-6 divide-y divide-line overflow-hidden rounded-2xl bg-cream ring-1 ring-line">
              <DetailRow label="Price">
                <span className="text-xl font-semibold text-accent">
                  {formatPrice(shown.price)}
                </span>
              </DetailRow>

              <DetailRow label="Availability">
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
                    shown.quantity > 0
                      ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200"
                      : "bg-ink/5 text-muted ring-1 ring-line"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`size-1.5 rounded-full ${shown.quantity > 0 ? "bg-emerald-600" : "bg-muted"}`}
                  />
                  {shown.quantity > 0 ? "In stock" : "Out of stock"}
                </span>
              </DetailRow>

              <DetailRow label="Quantity">
                <span className="font-medium">
                  {shown.quantity} {shown.quantity === 1 ? "piece" : "pieces"}
                </span>
              </DetailRow>
            </dl>

            {/* Description */}
            <div className="mt-6">
              <span className="inline-block rounded-full bg-blush px-3 py-1 text-[11px] font-semibold tracking-wider text-accent uppercase">
                Description
              </span>
              <p
                id="product-modal-description"
                className="mt-3 text-[15px] leading-relaxed whitespace-pre-line text-ink/85"
              >
                {shown.description || "No description yet."}
              </p>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}

// One labelled row: tag-style label on the left, value on the right
function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3.5">
      <dt>
        <span className="inline-block rounded-full bg-paper px-3 py-1 text-[11px] font-semibold tracking-wider text-muted uppercase ring-1 ring-line">
          {label}
        </span>
      </dt>
      <dd className="text-right">{children}</dd>
    </div>
  );
}

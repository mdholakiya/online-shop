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
          <div className="relative h-[52dvh] bg-line md:h-[min(88vh,44rem)]">
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
            <p className="mt-2 text-xl text-accent">
              {formatPrice(shown.price)}
            </p>

            <p className="mt-3 text-sm text-muted">
              {shown.quantity > 0
                ? `${shown.quantity} available`
                : "Currently out of stock"}
            </p>

            <p
              id="product-modal-description"
              className="mt-6 text-[15px] leading-relaxed whitespace-pre-line"
            >
              {shown.description || "No description yet."}
            </p>

            {/* Contact details */}
            <div className="mt-8 border-t border-line pt-6">
              <h3 className="text-xs tracking-[0.25em] text-muted uppercase">
                Contact us
              </h3>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex gap-3">
                  <dt className="w-16 shrink-0 text-muted">Phone</dt>
                  <dd>
                    <a
                      href={`tel:${shown.phone.replace(/\s+/g, "")}`}
                      className="underline decoration-line underline-offset-4 hover:decoration-accent"
                    >
                      {shown.phone}
                    </a>
                  </dd>
                </div>
                <div className="flex gap-3">
                  <dt className="w-16 shrink-0 text-muted">Email</dt>
                  <dd className="min-w-0 break-words">
                    <a
                      href={`mailto:${shown.email}`}
                      className="underline decoration-line underline-offset-4 hover:decoration-accent"
                    >
                      {shown.email}
                    </a>
                  </dd>
                </div>
                <div className="flex gap-3">
                  <dt className="w-16 shrink-0 text-muted">Address</dt>
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

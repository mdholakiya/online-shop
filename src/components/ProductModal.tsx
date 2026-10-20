"use client";

import { useEffect, useRef, useState } from "react";
import FitImage from "./FitImage";
import ImageLightbox from "./ImageLightbox";
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
  const [zoomed, setZoomed] = useState(false); // full-screen photo open?

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
    <>
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

          {/* Image: whole photo; click to open full screen */}
          <button
            type="button"
            onClick={() => setZoomed(true)}
            aria-label={`View full image of ${shown.name}`}
            className="group relative block h-[52dvh] w-full cursor-zoom-in overflow-hidden bg-blush md:h-[min(88vh,44rem)]"
          >
            <FitImage
              src={shown.image_url}
              alt={shown.name}
              sizes="(min-width: 768px) 480px, 100vw"
            />
            <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-paper/90 px-3 py-1.5 text-xs font-medium text-ink shadow transition group-hover:bg-paper">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <circle cx="11" cy="11" r="6" />
                <path d="m20 20-4.5-4.5M11 8v6M8 11h6" />
              </svg>
              Tap to zoom
            </span>
          </button>

          {/* Details (min-w-0 lets long text wrap instead of overflowing) */}
          <div className="flex min-w-0 flex-col overflow-x-hidden p-6 sm:p-8 md:h-[min(88vh,44rem)] md:overflow-y-auto md:p-10">
            <p className="text-xs font-medium tracking-[0.25em] text-accent uppercase">
              Rutu Fashion
            </p>
            <h2
              id="product-modal-title"
              className="mt-2 pr-10 font-serif text-3xl leading-tight font-medium [overflow-wrap:anywhere] sm:text-4xl"
            >
              {shown.name}
            </h2>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-accent">
              {formatPrice(shown.price)}
            </p>

            {/* Availability + quantity side by side */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-cream p-4 ring-1 ring-line">
                <p className="text-[11px] font-medium tracking-wider text-muted uppercase">
                  Availability
                </p>
                <p className="mt-1.5 flex items-center gap-2 font-medium">
                  <span
                    aria-hidden="true"
                    className={`size-2 rounded-full ${shown.quantity > 0 ? "bg-emerald-500" : "bg-muted"}`}
                  />
                  <span className={shown.quantity > 0 ? "text-emerald-700" : "text-muted"}>
                    {shown.quantity > 0 ? "In stock" : "Out of stock"}
                  </span>
                </p>
              </div>
              <div className="rounded-xl bg-cream p-4 ring-1 ring-line">
                <p className="text-[11px] font-medium tracking-wider text-muted uppercase">
                  Quantity
                </p>
                <p className="mt-1.5 font-medium">
                  {shown.quantity} {shown.quantity === 1 ? "piece" : "pieces"}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="mt-8 border-t border-line pt-6">
              <h3 className="text-sm font-semibold tracking-wider uppercase">
                Product details
              </h3>
              <p
                id="product-modal-description"
                className="mt-3 text-[15px] leading-relaxed whitespace-pre-line text-ink/80 [overflow-wrap:anywhere]"
              >
                {shown.description || "No description yet."}
              </p>
            </div>
          </div>
        </div>
      )}
    </dialog>

    {/* Full-screen photo viewer */}
    {shown && (
      <ImageLightbox
        src={shown.image_url}
        alt={shown.name}
        open={zoomed && product !== null}
        onClose={() => setZoomed(false)}
      />
    )}
    </>
  );
}

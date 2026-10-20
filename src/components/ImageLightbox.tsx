"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  open: boolean;
  onClose: () => void;
};

// Full-screen photo viewer. Closes on Esc, the ✕ button, or a click anywhere.
export default function ImageLightbox({ src, alt, open, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-label={`${alt} — full image`}
      onClose={onClose} // Esc
      onClick={onClose} // click anywhere
      className="m-0 h-dvh max-h-none w-screen max-w-none cursor-zoom-out bg-ink/95 p-0 backdrop:bg-ink/80"
    >
      {open && (
        <>
          <div className="relative h-full w-full">
            <Image src={src} alt={alt} fill sizes="100vw" className="object-contain p-4 sm:p-10" />
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close full image"
            autoFocus
            className="absolute top-4 right-4 flex size-11 cursor-pointer items-center justify-center rounded-full bg-paper/90 text-ink shadow transition hover:bg-paper focus-visible:outline-2 focus-visible:outline-blush"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </>
      )}
    </dialog>
  );
}

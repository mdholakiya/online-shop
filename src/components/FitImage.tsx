import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  sizes: string;
  preload?: boolean;
  className?: string; // extra classes for the main (sharp) image
};

// Shows the WHOLE photo (never cropped) inside its box.
// Any empty space is filled with a soft blurred copy of the same photo.
// Use inside a parent that has `relative` and a fixed size/aspect ratio.
export default function FitImage({ src, alt, sizes, preload, className = "" }: Props) {
  return (
    <>
      {/* Blurred background (same file, so it's only downloaded once) */}
      <Image
        src={src}
        alt=""
        aria-hidden="true"
        fill
        sizes={sizes}
        className="scale-110 object-cover opacity-60 blur-2xl"
      />
      {/* The full, sharp photo */}
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        preload={preload}
        className={`object-contain ${className}`}
      />
    </>
  );
}

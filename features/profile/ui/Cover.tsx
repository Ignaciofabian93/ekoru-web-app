"use client";
import Image from "next/image";
import { ImageUploadButton } from "./ImageUploadButton";

// Sellers without a custom cover get the profile wallpaper so the header still
// reads as a finished hero (never the brand logo stretched as a cover).
const DEFAULT_COVER = "/wallpapers/wallpaper-2.jpg";

interface CoverProps {
  /** The seller's own cover. Omit to fall back to the default wallpaper. */
  image?: string;
  altText: string;
  uploading?: boolean;
  onUpload: (file: File) => void;
  changeCoverAriaLabel: string;
}

export function Cover({
  image,
  altText,
  uploading,
  onUpload,
  changeCoverAriaLabel,
}: CoverProps) {
  return (
    <div className="relative h-[40vh] min-h-60 w-full overflow-hidden sm:h-56">
      {image ? (
        <>
          {/* A user cover is any aspect ratio, so it's shown whole over a
              blurred copy of itself rather than cropped to the band. */}
          <Image
            src={image}
            fill
            sizes="100vw"
            alt=""
            aria-hidden
            className="scale-110 object-cover blur-2xl"
          />
          <div className="absolute inset-0 bg-black/10" />
          <Image
            src={image}
            fill
            sizes="100vw"
            alt={altText}
            className="object-contain"
            priority
          />
        </>
      ) : (
        // The default wallpaper is authored for this band, so it crops cleanly.
        <Image
          src={DEFAULT_COVER}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      )}

      {/* Bottom fade grounds the avatar and adds depth */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/25 to-transparent" />

      <ImageUploadButton
        variant="scrim"
        className="top-3 right-3"
        uploading={uploading}
        onSelect={onUpload}
        ariaLabel={changeCoverAriaLabel}
      />
    </div>
  );
}

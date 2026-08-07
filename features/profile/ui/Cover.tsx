"use client";
import Image from "next/image";
import { ImageUploadButton } from "./ImageUploadButton";

// Sellers without a custom cover get the profile wallpaper so the header still
// reads as a finished hero (never the brand logo stretched as a cover).
const DEFAULT_COVER = "/wallpapers/wallpaper-2.jpg";

// The band is capped by the profile's content column (`default` width), not the
// viewport, so a plain `100vw` hint would have Next serve an oversized file.
const COVER_SIZES = "(max-width: 1152px) 100vw, 1152px";

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
    // Fixed height and rounded, matching the seller hero's banner — it is pinned
    // to the content column rather than bleeding to the viewport edges.
    <div className="relative h-50 w-full overflow-hidden rounded-2xl">
      {image ? (
        <>
          {/* A user cover is any aspect ratio, so it's shown whole over a
              blurred copy of itself rather than cropped to the band. */}
          <Image
            src={image}
            fill
            sizes={COVER_SIZES}
            alt=""
            aria-hidden
            className="scale-110 object-cover blur-2xl"
          />
          <div className="absolute inset-0 bg-black/10" />
          <Image
            src={image}
            fill
            sizes={COVER_SIZES}
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
          sizes={COVER_SIZES}
          className="object-cover"
        />
      )}

      {/* Bottom fade grounds the avatar and adds depth. Shallow on purpose —
          a deeper one would wash out most of a 200px band. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-linear-to-t from-black/25 to-transparent" />

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

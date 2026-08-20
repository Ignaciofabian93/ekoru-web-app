"use client";
import { CoverBanner } from "@/components/Patterns/CoverBanner";
import { ImageUploadButton } from "./ImageUploadButton";

interface CoverProps {
  /** The seller's own cover. Omit to fall back to the default wallpaper. */
  image?: string;
  altText: string;
  uploading?: boolean;
  onUpload: (file: File) => void;
  changeCoverAriaLabel: string;
}

/**
 * The shared cover band plus the one thing only the owner sees: the control to
 * replace it. The band itself lives in `CoverBanner`, so the public seller hero
 * renders the same header.
 */
export function Cover({
  image,
  altText,
  uploading,
  onUpload,
  changeCoverAriaLabel,
}: CoverProps) {
  return (
    <CoverBanner
      image={image}
      altText={altText}
      action={
        <ImageUploadButton
          variant="scrim"
          className="top-3 right-3"
          uploading={uploading}
          onSelect={onUpload}
          ariaLabel={changeCoverAriaLabel}
        />
      }
    />
  );
}

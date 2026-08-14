"use client";
import clsx from "clsx";
import { Camera, Loader2 } from "lucide-react";
import { useRef } from "react";

/**
 * `scrim` is a translucent puck for sitting directly on a photo (the cover);
 * `badge` is a solid ringed circle for overlapping another element (the avatar).
 */
export type ImageUploadVariant = "scrim" | "badge";

interface ImageUploadButtonProps {
  onSelect: (file: File) => void;
  uploading?: boolean;
  /** Accessible name — the control is icon-only. */
  ariaLabel: string;
  variant?: ImageUploadVariant;
  /** Positioning classes; the host decides where the control sits. */
  className?: string;
}

const VARIANT_CLASS: Record<ImageUploadVariant, string> = {
  scrim: "bg-black/55 text-white hover:bg-black/75",
  badge:
    "border border-white bg-linear-120 from-primary to-primary-light/80 text-white hover:brightness-110 backdrop-blur-md",
};

/**
 * Opens the file picker and hands the chosen file back. Shared by the profile
 * cover and avatar, which differ only in where the control sits and how it is
 * filled.
 */
export function ImageUploadButton({
  onSelect,
  uploading = false,
  ariaLabel,
  variant = "scrim",
  className,
}: ImageUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        aria-label={ariaLabel}
        className={clsx(
          "absolute flex size-9 cursor-pointer items-center justify-center rounded-full",
          "shadow-md transition-all outline-none focus-visible:ring-2 focus-visible:ring-white",
          "disabled:cursor-not-allowed disabled:opacity-70",
          VARIANT_CLASS[variant],
          className,
        )}
      >
        {uploading ? (
          <Loader2 size={16} className="animate-spin" aria-hidden />
        ) : (
          <Camera size={16} aria-hidden />
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onSelect(file);
          // Reset so picking the same file twice still fires a change.
          e.target.value = "";
        }}
      />
    </>
  );
}

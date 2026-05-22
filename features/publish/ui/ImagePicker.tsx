"use client";
import { Text } from "@/components/Text/Text";
import clsx from "clsx";
import { ImagePlus, X } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";

export function ImagePicker({
  images,
  onAdd,
  onRemove,
  max,
  label,
  hint,
  addLabel,
  error,
}: {
  images: File[];
  onAdd: (file: File) => void;
  onRemove: (index: number) => void;
  max: number;
  label: string;
  hint: string;
  addLabel: string;
  error?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Derive preview URLs from the files, and revoke them when the set changes
  // or the component unmounts so the object URLs don't leak.
  const previews = useMemo(() => images.map((file) => URL.createObjectURL(file)), [images]);

  useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [previews]);

  const canAddMore = images.length < max;

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files)
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, max - images.length)
      .forEach(onAdd);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-2">
        <Text variant="span" weight="medium" color="secondary">
          {label}
        </Text>
        <Text variant="small" color="tertiary">
          {images.length}/{max}
        </Text>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {previews.map((src, i) => (
          <div
            key={src}
            className="relative aspect-square overflow-hidden rounded-xl border border-border-light bg-background-secondary"
          >
            {/* Local object-URL preview — next/image is unnecessary for a blob. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onRemove(i)}
              aria-label={addLabel}
              className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/55 text-white transition-colors hover:bg-black/75"
            >
              <X size={14} color="currentColor" strokeWidth={2.5} />
            </button>
          </div>
        ))}

        {canAddMore && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className={clsx(
              "flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed transition-colors",
              error
                ? "border-danger text-danger"
                : "border-input-border text-foreground-tertiary hover:border-primary hover:text-primary",
            )}
          >
            <ImagePlus size={22} color="currentColor" strokeWidth={2} />
            <Text variant="small" color={error ? "error" : "tertiary"}>
              {addLabel}
            </Text>
          </button>
        )}
      </div>

      {error ? (
        <Text variant="small" color="error">
          {error}
        </Text>
      ) : (
        <Text variant="small" color="tertiary">
          {hint}
        </Text>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          handleFiles(e.target.files);
          // Reset so selecting the same file again still fires onChange.
          e.target.value = "";
        }}
      />
    </div>
  );
}

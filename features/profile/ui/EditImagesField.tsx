"use client";
import { Text } from "@/components/Primitives/Text";
import { resolveImageUrl } from "@/utils/resolveImage";
import clsx from "clsx";
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef } from "react";

/**
 * One slot in the editor. A listing being edited holds a mix: images already
 * stored as R2 keys, and files just picked that have not been uploaded yet.
 * Keeping them in one ordered list is what lets the seller reorder or remove
 * across both without the two kinds drifting apart.
 */
export type EditableImage =
  | { kind: "stored"; key: string }
  | { kind: "new"; file: File };

interface EditImagesFieldProps {
  images: EditableImage[];
  onAdd: (file: File) => void;
  onRemove: (index: number) => void;
  /** Moves the image at `index` one slot toward the front. */
  onMoveBackward: (index: number) => void;
  max: number;
  label: string;
  hint: string;
  addLabel: string;
  removeLabel: string;
  coverLabel: string;
  makeCoverLabel: string;
  error?: string;
}

export function EditImagesField({
  images,
  onAdd,
  onRemove,
  onMoveBackward,
  max,
  label,
  hint,
  addLabel,
  removeLabel,
  coverLabel,
  makeCoverLabel,
  error,
}: EditImagesFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Object URLs only for the newly picked files; stored images already resolve
  // to a CDN URL. Revoked when the set changes so they don't leak.
  const previews = useMemo(
    () =>
      images.map((image) =>
        image.kind === "new"
          ? { src: URL.createObjectURL(image.file), isBlob: true }
          : { src: resolveImageUrl(image.key) ?? "", isBlob: false },
      ),
    [images],
  );

  useEffect(() => {
    return () => {
      previews.forEach((p) => p.isBlob && URL.revokeObjectURL(p.src));
    };
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
        {previews.map((preview, i) => (
          <div
            key={preview.src}
            className="relative aspect-square overflow-hidden rounded-xl border border-border-light bg-background-secondary"
          >
            {preview.isBlob ? (
              // A local object URL has no configured remote host, so next/image
              // can't optimize it.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview.src} alt="" className="h-full w-full object-cover" />
            ) : (
              <Image
                src={preview.src}
                alt=""
                fill
                sizes="120px"
                className="object-cover"
              />
            )}

            <button
              type="button"
              onClick={() => onRemove(i)}
              aria-label={removeLabel}
              className="absolute top-1.5 right-1.5 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-black/55 text-white transition-colors hover:bg-black/75"
            >
              <X size={14} color="currentColor" strokeWidth={2.5} />
            </button>

            {/* The first image is the card cover, so the order is meaningful.
                One "move earlier" control is enough to promote any image to the
                front without a full drag-and-drop surface. */}
            {i === 0 ? (
              <span className="absolute bottom-1.5 left-1.5 z-10 rounded-md bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-white">
                {coverLabel}
              </span>
            ) : (
              <button
                type="button"
                onClick={() => onMoveBackward(i)}
                className="absolute bottom-1.5 left-1.5 z-10 rounded-md bg-black/55 px-1.5 py-0.5 text-[10px] font-semibold text-white transition-colors hover:bg-black/75"
              >
                {makeCoverLabel}
              </button>
            )}
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
          // Reset so picking the same file again still fires onChange.
          e.target.value = "";
        }}
      />
    </div>
  );
}

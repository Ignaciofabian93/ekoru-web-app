"use client";

import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { resolveImageUrl } from "@/utils/resolveImage";

/**
 * Text for the gallery. Shared components never read a feature namespace, so
 * the host screen passes its own translations in. The index-dependent labels
 * are functions because the indices only exist inside the component.
 */
export interface ProductGalleryLabels {
  /** `index` and `total` are 1-based. */
  imageAlt: (index: number, total: number) => string;
  noImage: string;
  previous: string;
  next: string;
  /** `index` is 1-based. */
  thumbnailAlt: (index: number) => string;
  /** `index` is 1-based. */
  goToImage: (index: number) => string;
}

export interface ProductGalleryProps {
  images: string[];
  labels: ProductGalleryLabels;
}

export function ProductGallery({ images, labels }: ProductGalleryProps) {
  const [index, setIndex] = useState(0);

  const urls = images.map((img) => resolveImageUrl(img)).filter(Boolean) as string[];
  const total = urls.length;
  const current = urls[index];

  function go(delta: number) {
    if (total === 0) return;
    setIndex((prev) => (prev + delta + total) % total);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="bg-background-secondary relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border border-border-light">
        {current ? (
          <Image
            src={current}
            alt={labels.imageAlt(index + 1, total)}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
            className="object-cover"
            priority={index === 0}
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-foreground-muted">
            <ImageOff size={48} strokeWidth={1.5} aria-hidden />
            <span className="text-sm">{labels.noImage}</span>
          </div>
        )}

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label={labels.previous}
              className="absolute top-1/2 left-3 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-foreground shadow-sm transition hover:bg-white"
            >
              <ChevronLeft size={20} strokeWidth={2} aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label={labels.next}
              className="absolute top-1/2 right-3 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-foreground shadow-sm transition hover:bg-white"
            >
              <ChevronRight size={20} strokeWidth={2} aria-hidden />
            </button>
            <div className="absolute right-3 bottom-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white">
              {index + 1} / {total}
            </div>
          </>
        )}
      </div>

      {total > 1 && (
        <div className="scrollbar-none flex gap-2 overflow-x-auto pb-1">
          {urls.map((url, i) => (
            <button
              key={url + i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={labels.goToImage(i + 1)}
              aria-current={i === index}
              className={`bg-background-secondary relative size-16 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                i === index ? "border-primary" : "border-transparent hover:border-border"
              }`}
            >
              <Image
                src={url}
                alt={labels.thumbnailAlt(i + 1)}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

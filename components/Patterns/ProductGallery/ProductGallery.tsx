"use client";

import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import {
  productGalleryCounterClass,
  productGalleryEmptyClass,
  productGalleryEmptyIconSize,
  productGalleryEmptyTextClass,
  productGalleryFrameClass,
  productGalleryImageClass,
  productGalleryNavClass,
  productGalleryNavIconSize,
  productGalleryRootClass,
  productGalleryThumbClass,
  productGalleryThumbRailClass,
} from "@/design/product-gallery";
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
    <div className={productGalleryRootClass}>
      <div className={productGalleryFrameClass}>
        {current ? (
          <Image
            src={current}
            alt={labels.imageAlt(index + 1, total)}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
            className={productGalleryImageClass}
            priority={index === 0}
          />
        ) : (
          <div className={productGalleryEmptyClass}>
            <ImageOff size={productGalleryEmptyIconSize} strokeWidth={1.5} aria-hidden />
            <span className={productGalleryEmptyTextClass}>{labels.noImage}</span>
          </div>
        )}

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label={labels.previous}
              className={productGalleryNavClass.previous}
            >
              <ChevronLeft size={productGalleryNavIconSize} strokeWidth={2} aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label={labels.next}
              className={productGalleryNavClass.next}
            >
              <ChevronRight
                size={productGalleryNavIconSize}
                strokeWidth={2}
                aria-hidden
              />
            </button>
            <div className={productGalleryCounterClass}>
              {index + 1} / {total}
            </div>
          </>
        )}
      </div>

      {total > 1 && (
        <div className={productGalleryThumbRailClass}>
          {urls.map((url, i) => (
            <button
              key={url + i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={labels.goToImage(i + 1)}
              aria-current={i === index}
              className={productGalleryThumbClass[i === index ? "current" : "idle"]}
            >
              <Image
                src={url}
                alt={labels.thumbnailAlt(i + 1)}
                fill
                sizes="64px"
                className={productGalleryImageClass}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

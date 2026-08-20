"use client";

import type { ReactNode } from "react";
import clsx from "clsx";
import Image from "next/image";
import {
  coverBannerBackdropClass,
  coverBannerClass,
  coverBannerFadeClass,
  coverBannerFallbackClass,
  coverBannerImageClass,
  coverBannerScrimClass,
} from "@/design/cover-banner";

/**
 * Anyone without a custom cover gets the shared wallpaper, so the header still
 * reads as a finished hero (never the brand logo stretched as a cover).
 */
const DEFAULT_COVER = "/wallpapers/wallpaper-2.jpg";

/**
 * The band is capped by the page's content column (`default` width), not the
 * viewport, so a plain `100vw` hint would have Next serve an oversized file.
 */
const COVER_SIZES = "(max-width: 1152px) 100vw, 1152px";

export interface CoverBannerProps {
  /** The seller's own cover. Omit to fall back to the default wallpaper. */
  image?: string | null;
  /** Empty whenever the heading beside the band already names the owner. */
  altText?: string;
  /**
   * Control overlaid on the band — the profile's change-cover button. Position
   * it from the caller (`className="top-3 right-3"`); the band only frames it.
   */
  action?: ReactNode;
  className?: string;
}

/**
 * The cover band shared by the profile header and the public seller hero, so
 * a seller sees the same header the visitor does.
 */
export function CoverBanner({ image, altText = "", action, className }: CoverBannerProps) {
  return (
    <div className={clsx(coverBannerClass, className)}>
      {image ? (
        <>
          <Image
            src={image}
            fill
            sizes={COVER_SIZES}
            alt=""
            aria-hidden
            className={coverBannerBackdropClass}
          />
          <div className={coverBannerScrimClass} />
          <Image
            src={image}
            fill
            sizes={COVER_SIZES}
            alt={altText}
            className={coverBannerImageClass}
            priority
          />
        </>
      ) : (
        <Image
          src={DEFAULT_COVER}
          alt=""
          fill
          priority
          sizes={COVER_SIZES}
          className={coverBannerFallbackClass}
        />
      )}

      <div className={coverBannerFadeClass} />

      {action}
    </div>
  );
}

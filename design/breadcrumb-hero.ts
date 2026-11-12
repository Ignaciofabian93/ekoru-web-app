/**
 *
 * Usage:  className={breadcrumbHeroSectionClass}
 * ─────────────────────────────────────────────────────────────────
 */

import clsx from "clsx";
import { heroFrameClass, heroHeightClass } from "./hero";

export const breadcrumbHeroSectionClass = clsx(
  heroFrameClass,
  heroHeightClass,
  "relative bg-cover bg-center",
);

/** Scrim that keeps white type legible over an arbitrary wallpaper. */
export const breadcrumbHeroOverlayClass = "absolute inset-0 bg-black/70";

export const breadcrumbHeroContentClass = clsx(
  "relative z-10 mx-auto max-w-4xl h-full px-2 py-4",
  "flex flex-col gap-2 items-start justify-start",
  "text-white",
);

export const breadcrumbHeroHeadingClass = clsx(
  "flex flex-col gap-1 w-full h-full",
  "items-center justify-center mb-12",
);

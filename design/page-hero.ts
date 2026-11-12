/**
 *
 * Usage:  className={pageHeroSectionClass}
 * ─────────────────────────────────────────────────────────────────
 */

import clsx from "clsx";
import { heroFrameClass, heroHeightClass } from "./hero";

export const pageHeroSectionClass = clsx(
  heroFrameClass,
  heroHeightClass,
  "relative bg-cover bg-center",
);

/** Scrim that keeps white type legible over an arbitrary wallpaper. */
export const pageHeroOverlayClass = "absolute inset-0 bg-black/70";

export const pageHeroContentClass = clsx(
  "relative z-10 mx-auto max-w-5xl h-full px-4",
  "flex flex-col gap-2 items-center justify-center",
  "text-white",
);

export const pageHeroSubtitleClass = "opacity-90 text-center";

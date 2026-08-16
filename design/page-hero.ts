/**
 *
 * Usage:  className={pageHeroSectionClass}
 * ─────────────────────────────────────────────────────────────────
 */

import clsx from "clsx";

export const pageHeroSectionClass =
  "w-full mx-auto h-[40vh] min-h-60 bg-cover bg-center relative";

/** Scrim that keeps white type legible over an arbitrary wallpaper. */
export const pageHeroOverlayClass = "absolute inset-0 bg-black/70";

export const pageHeroContentClass = clsx(
  "relative z-10 mx-auto max-w-5xl h-full px-4",
  "flex flex-col gap-2 items-center justify-center",
  "text-white",
);

export const pageHeroSubtitleClass = "opacity-90 text-center";

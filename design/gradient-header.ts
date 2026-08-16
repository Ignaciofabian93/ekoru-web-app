/**
 *
 * Usage:  className={gradientHeaderClass}
 * ─────────────────────────────────────────────────────────────────
 */

import clsx from "clsx";

export const gradientHeaderClass = clsx(
  "w-full min-h-60 max-w-4xl mx-auto",
  "relative overflow-hidden flex flex-col gap-2",
  "pt-6 pb-11 px-5",
  "bg-linear-to-br from-nature-teal-dark via-nature-teal-dark to-nature-teal-light",
);

export const gradientHeaderDecorTopClass =
  "absolute rounded-full bg-white/7 w-55 h-55 -top-15 -right-12.5";

export const gradientHeaderDecorBottomClass =
  "absolute rounded-full bg-white/7 w-30 h-30 -bottom-7.5 -left-7.5";

export const gradientHeaderEyebrowClass = "flex items-center gap-2 mb-2";

export const gradientHeaderIconChipClass = clsx(
  "w-9 h-9 rounded-md bg-white/18",
  "flex items-center justify-center shrink-0",
);

export const gradientHeaderIconSize = 18;

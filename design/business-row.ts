/**
 *
 * Usage:  className={businessRowItemClass}
 * ─────────────────────────────────────────────────────────────────
 */

import clsx from "clsx";

export const businessRowClass = "flex flex-col gap-3";

/** One business: a fixed-width column so names wrap instead of widening it. */
export const businessRowItemClass = clsx(
  "group flex w-28 shrink-0 snap-start flex-col items-center gap-1.5 rounded-xl p-2",
  "outline-none transition-colors hover:bg-background-secondary",
  "focus-visible:ring-2 focus-visible:ring-primary",
);

export const businessRowAvatarClass = clsx(
  "mb-1 ring-1 ring-border-light transition",
  "group-hover:ring-primary/40",
);

export const businessRowSkeletonClass =
  "flex w-28 shrink-0 snap-start flex-col items-center gap-2 p-2";

export const businessRowSkeletonAvatarClass =
  "size-16 animate-pulse rounded-full bg-background-secondary";

export const businessRowSkeletonLineClass =
  "h-3 w-20 animate-pulse rounded bg-background-secondary";

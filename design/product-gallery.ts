/**
 *
 * Usage:  className={productGalleryThumbClass[state]}
 * ─────────────────────────────────────────────────────────────────
 */

import clsx from "clsx";
import { single } from "@/design/variants";

export const productGalleryRootClass = "flex flex-col gap-3";

export const productGalleryFrameClass = clsx(
  "bg-background-secondary relative flex aspect-square w-full",
  "items-center justify-center overflow-hidden rounded-2xl border border-border-light",
);

export const productGalleryImageClass = "object-cover";

export const productGalleryEmptyClass =
  "flex flex-col items-center gap-2 text-foreground-muted";

export const productGalleryEmptyTextClass = "text-sm";

const productGalleryNavBaseClass = clsx(
  "absolute top-1/2 flex size-10 -translate-y-1/2 items-center justify-center",
  "rounded-full bg-white/80 text-foreground shadow-sm transition hover:bg-white",
);

export const productGalleryNavClass = single(productGalleryNavBaseClass, {
  previous: "left-3",
  next: "right-3",
});

export const productGalleryCounterClass = clsx(
  "absolute right-3 bottom-3 rounded-full bg-black/60 px-2.5 py-1",
  "text-xs font-medium text-white",
);

export const productGalleryThumbRailClass =
  "scrollbar-none flex gap-2 overflow-x-auto pb-1";

const productGalleryThumbBaseClass = clsx(
  "bg-background-secondary relative size-16 shrink-0 overflow-hidden",
  "rounded-lg border-2 transition",
);

/** Thumbnail per state: `productGalleryThumbClass[isCurrent ? "current" : "idle"]`. */
export const productGalleryThumbClass = single(productGalleryThumbBaseClass, {
  current: "border-primary",
  idle: "border-transparent hover:border-border",
});

export const productGalleryEmptyIconSize = 48;

export const productGalleryNavIconSize = 20;

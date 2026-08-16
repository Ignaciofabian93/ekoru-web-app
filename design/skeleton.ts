/**
 *
 * Usage:  className={skeletonClass[radius]}
 * ─────────────────────────────────────────────────────────────────
 */

import clsx from "clsx";
import type { SkeletonRadius } from "@/components/Primitives/Skeleton/Skeleton";

const skeletonBaseClass = "animate-pulse bg-background-secondary";

const skeletonRadiusClass: Record<SkeletonRadius, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  full: "rounded-full",
};

/** Radius is Skeleton's only axis, so the lookup is one level: `skeletonClass[radius]`. */
export const skeletonClass = Object.fromEntries(
  (Object.keys(skeletonRadiusClass) as SkeletonRadius[]).map((radius) => [
    radius,
    clsx(skeletonBaseClass, skeletonRadiusClass[radius]),
  ]),
) as Record<SkeletonRadius, string>;

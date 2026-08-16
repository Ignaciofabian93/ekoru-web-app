import clsx from "clsx";
import { skeletonClass } from "@/design/skeleton";

export type SkeletonRadius = "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";

export interface SkeletonProps {
  /** Tailwind sizing/aspect utilities for this placeholder, e.g. "h-4 w-2/3". */
  className?: string;
  radius?: SkeletonRadius;
  /** Render N stacked copies. */
  count?: number;
}

/**
 * Loading placeholder. Purely decorative — the surrounding region should carry
 * `aria-busy` so assistive tech announces the pending state once, not per block.
 */
export function Skeleton({ className, radius = "xl", count = 1 }: SkeletonProps) {
  const block = (key?: number) => (
    <div key={key} aria-hidden className={clsx(skeletonClass[radius], className)} />
  );

  if (count === 1) return block();
  return <>{Array.from({ length: count }, (_, i) => block(i))}</>;
}

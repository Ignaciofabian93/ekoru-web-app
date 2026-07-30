import clsx from "clsx";

export type SkeletonRadius = "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";

export interface SkeletonProps {
  /** Tailwind sizing/aspect utilities for this placeholder, e.g. "h-4 w-2/3". */
  className?: string;
  radius?: SkeletonRadius;
  /** Render N stacked copies. */
  count?: number;
}

const RADIUS_CLASS: Record<SkeletonRadius, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  full: "rounded-full",
};

/**
 * Loading placeholder. Purely decorative — the surrounding region should carry
 * `aria-busy` so assistive tech announces the pending state once, not per block.
 */
export function Skeleton({ className, radius = "xl", count = 1 }: SkeletonProps) {
  const block = (key?: number) => (
    <div
      key={key}
      aria-hidden
      className={clsx(
        "animate-pulse bg-background-secondary",
        RADIUS_CLASS[radius],
        className,
      )}
    />
  );

  if (count === 1) return block();
  return <>{Array.from({ length: count }, (_, i) => block(i))}</>;
}

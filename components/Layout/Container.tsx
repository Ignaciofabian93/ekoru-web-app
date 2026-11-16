import clsx from "clsx";
import type { CSSProperties, ElementType, ReactNode } from "react";
import { MAX_WIDTH, RHYTHM, spacing, type Gap, type Width } from "./tokens";

interface ContainerProps {
  children: ReactNode;
  /** Max width of the content column. See the width scale in `./tokens`. */
  width?: Width;
  /** Vertical gap between direct children. Defaults to the section rhythm. */
  gap?: Gap;
  /** Horizontal breathing room. Turn off for full-bleed bodies. */
  padded?: boolean;
  /** Vertical padding. Defaults to `6` (24px); `0` sits flush against the shell. */
  paddingY?: Gap;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
}

/**
 * Centers content at one of the three page widths and owns the vertical rhythm
 * between whatever it wraps. Children — usually `Section`s — never add their own
 * outer margins; the gap here is the single source of spacing between them.
 */
export function Container({
  children,
  width = "default",
  gap = RHYTHM.SECTION,
  padded = true,
  paddingY = 6,
  as,
  className,
  style,
}: ContainerProps) {
  const Component = as ?? "div";
  return (
    <Component
      className={clsx(
        "mx-auto flex w-full flex-col",
        MAX_WIDTH[width],
        // Padding scales with the viewport so the gutter never feels cramped on
        // phones or oversized on desktop.
        padded && "px-4 sm:px-6",
        className,
      )}
      style={{ gap: spacing[gap], paddingBlock: spacing[paddingY], ...style }}
    >
      {children}
    </Component>
  );
}

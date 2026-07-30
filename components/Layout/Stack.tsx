import clsx from "clsx";
import type { CSSProperties, ElementType, ReactNode } from "react";
import {
  ALIGN_CLASS,
  JUSTIFY_CLASS,
  STACK_BELOW_CLASS,
  spacing,
  type Align,
  type Breakpoint,
  type Gap,
  type Justify,
} from "./tokens";

interface StackProps {
  children: ReactNode;
  /** Main axis. Defaults to a vertical stack. */
  direction?: "row" | "col";
  gap?: Gap;
  align?: Align;
  justify?: Justify;
  wrap?: boolean;
  /**
   * Row only: collapse to a column below this breakpoint. This is how header
   * rows stay readable on phones instead of squeezing a title and a link
   * side by side.
   */
  stackBelow?: Breakpoint;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
}

/**
 * One-dimensional flex layout. Replaces the ad-hoc wrappers that built classes
 * by interpolation (`items-${align}`) — Tailwind never compiled those, so those
 * props silently did nothing. Everything here resolves through a static map.
 */
export function Stack({
  children,
  direction = "col",
  gap = 4,
  align,
  justify,
  wrap,
  stackBelow,
  as,
  className,
  style,
}: StackProps) {
  const Component = as ?? "div";
  const isRow = direction === "row";

  return (
    <Component
      className={clsx(
        "flex",
        isRow && stackBelow ? STACK_BELOW_CLASS[stackBelow] : isRow ? "flex-row" : "flex-col",
        align && ALIGN_CLASS[align],
        justify && JUSTIFY_CLASS[justify],
        wrap && "flex-wrap",
        className,
      )}
      style={{ gap: spacing[gap], ...style }}
    >
      {children}
    </Component>
  );
}

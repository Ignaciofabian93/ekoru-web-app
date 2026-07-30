import clsx from "clsx";
import type { CSSProperties, ReactNode } from "react";
import { spacing, type Gap } from "./tokens";

type Cols = 1 | 2 | 3 | 4 | 5 | 6;

// Static maps — a `grid-cols-${n}` template literal produces a class Tailwind
// never sees, and therefore never generates.
const COLS: Record<Cols, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
};

const SM_COLS: Record<Cols, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
  5: "sm:grid-cols-5",
  6: "sm:grid-cols-6",
};

const MD_COLS: Record<Cols, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
  5: "md:grid-cols-5",
  6: "md:grid-cols-6",
};

const LG_COLS: Record<Cols, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
  6: "lg:grid-cols-6",
};

interface GridProps {
  children: ReactNode;
  /** Columns from the smallest viewport up. */
  cols?: Cols;
  sm?: Cols;
  md?: Cols;
  lg?: Cols;
  gap?: Gap;
  className?: string;
  style?: CSSProperties;
}

/**
 * Responsive grid with a single gap scale. Replaces the hand-rolled grids that
 * each picked their own gap (`2`, `2.5`, `4`, and one percentage-based `2%`).
 */
export function Grid({
  children,
  cols = 1,
  sm,
  md,
  lg,
  gap = 4,
  className,
  style,
}: GridProps) {
  return (
    <div
      className={clsx(
        "grid w-full",
        COLS[cols],
        sm && SM_COLS[sm],
        md && MD_COLS[md],
        lg && LG_COLS[lg],
        className,
      )}
      style={{ gap: spacing[gap], ...style }}
    >
      {children}
    </div>
  );
}

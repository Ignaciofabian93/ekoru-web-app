import clsx from "clsx";
import type { CSSProperties, ReactNode } from "react";
import { RHYTHM, spacing, type Gap } from "./tokens";

interface SectionProps {
  children: ReactNode;
  /** Gap between the section header and its content. */
  gap?: Gap;
  /**
   * Accessible name. A named `<section>` is exposed as a `region` landmark, so
   * screen-reader users can jump straight to it — pass the visible heading text.
   */
  ariaLabel?: string;
  /** Id of the heading that names this section, when one is rendered. */
  ariaLabelledBy?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * A band of related content inside a page body. Deliberately carries no outer
 * margin: the enclosing `Container` owns the spacing between sections, which is
 * what keeps the rhythm identical from screen to screen.
 */
export function Section({
  children,
  gap = RHYTHM.CONTENT,
  ariaLabel,
  ariaLabelledBy,
  className,
  style,
}: SectionProps) {
  return (
    <section
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={clsx("flex w-full flex-col", className)}
      style={{ gap: spacing[gap], ...style }}
    >
      {children}
    </section>
  );
}

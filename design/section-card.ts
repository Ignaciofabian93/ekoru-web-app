/**
 *
 * Usage:  className={sectionCardClass} / {sectionCardIconClass[tone]}
 * ─────────────────────────────────────────────────────────────────
 */

import clsx from "clsx";
import { single } from "@/design/variants";

/**
 * The panel every dashboard section sits in: a white card on the page ground,
 * hairline border, soft shadow. Deliberately flat — the tone lives in the icon
 * chip, not the surface, so a column of cards reads as one rail rather than a
 * strip of colored blocks.
 */
export const sectionCardClass = clsx(
  "rounded-2xl border border-slate-200 bg-white p-4 sm:p-5",
  "shadow-md shadow-slate-800/10",
);

export type SectionCardTone = "default" | "primary" | "success" | "warning" | "danger";

const sectionCardIconBaseClass =
  "flex size-10 shrink-0 items-center justify-center rounded-xl border";

/** Tinted-glass chip, one hue per tone — the same recipe `NavCard` uses. */
export const sectionCardIconClass = single(sectionCardIconBaseClass, {
  default:
    "border-secondary-dark/50 bg-linear-180 from-secondary-hover/15 to-secondary/5 text-secondary-dark",
  primary:
    "border-primary/40 bg-linear-180 from-primary-light/20 to-primary-hover/5 text-primary",
  success: "border-success/40 bg-linear-180 from-success/15 to-success/5 text-success",
  warning: "border-warning/40 bg-linear-180 from-warning/15 to-warning/5 text-warning",
  danger: "border-danger/40 bg-linear-180 from-danger/15 to-danger/5 text-danger",
} satisfies Record<SectionCardTone, string>);

export const sectionCardHeaderClass = "mb-5 flex items-start justify-between gap-4";

export const sectionCardHeadingClass = "flex items-start gap-3";

export const sectionCardTitleClass = "flex min-w-0 flex-col gap-0.5";

export const sectionCardIconSize = 20;

/**
 *
 * Usage:  className={navCardClass}
 * ─────────────────────────────────────────────────────────────────
 */

import clsx from "clsx";
import { single } from "@/design/variants";

export const navCardClass = clsx(
  "flex flex-row items-center gap-3.5 rounded-2xl p-4",
  "border border-slate-200 bg-white transition-all duration-200",
  "hover:border-primary/40 hover:shadow-md hover:shadow-slate-800/10",
  "outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
);

export type NavCardTone = "primary" | "secondary" | "accent";

const navCardIconBaseClass = clsx(
  "flex size-11 shrink-0 items-center justify-center rounded-xl border",
);

/** Same tinted-glass chip the trust rows and impact band use. */
export const navCardIconClass = single(navCardIconBaseClass, {
  primary:
    "border-primary/30 bg-linear-160 from-primary-light/25 to-primary-light/5 text-primary",
  secondary:
    "border-secondary/40 bg-linear-160 from-secondary-light/30 to-secondary-light/10 text-secondary-dark",
  accent: "border-accent/40 bg-linear-160 from-accent/20 to-accent/5 text-accent",
} satisfies Record<NavCardTone, string>);

export const navCardBodyClass = "flex min-w-0 flex-1 flex-col gap-0.5";

export const navCardChevronClass = "shrink-0 text-foreground-tertiary";

export const navCardIconSize = 22;

export const navCardChevronSize = 18;

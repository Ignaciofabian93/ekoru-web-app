/**
 *
 * Usage:  className={filterPanelClass}
 * ─────────────────────────────────────────────────────────────────
 */

import clsx from "clsx";
import { single } from "@/design/variants";

export const filterPanelClass = "flex flex-col gap-4 pb-2";

export const filterPanelHeaderClass =
  "flex flex-row items-center justify-between gap-2";

export const filterPanelTitleGroupClass = "flex flex-row items-center gap-2";

/** Lime pill carrying how many filters are on. */
export const filterPanelBadgeClass = clsx(
  "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5",
  "bg-primary text-xs font-semibold text-on-primary tabular-nums",
);

export const filterPanelClearClass = clsx(
  "cursor-pointer text-sm font-semibold text-primary",
  "transition-colors hover:text-primary-active",
  "outline-none focus-visible:ring-2 focus-visible:ring-border-focus rounded-sm",
);

/**
 * Each group is separated by a rule above it rather than a box around it — the
 * rail reads as one column of filters, not a stack of cards.
 */
export const filterGroupClass = "flex flex-col gap-2.5 border-t border-slate-200 pt-4";

export const filterGroupToggleClass = clsx(
  "flex cursor-pointer flex-row items-center justify-between gap-2 p-0",
  "outline-none focus-visible:ring-2 focus-visible:ring-border-focus rounded-sm",
);

export const filterGroupChevronClass = single(
  "shrink-0 text-foreground-tertiary transition-transform duration-200",
  {
    open: "rotate-180",
    closed: "rotate-0",
  },
);

export const filterGroupChevronSize = 16;

export const filterGroupBodyClass = "flex flex-col gap-2.5";

export const filterOptionsClass = "flex flex-col gap-0.5";

/** The row is its own hit target, so the checkbox and its count share a hover. */
export const filterOptionRowClass = clsx(
  "-mx-1.5 flex cursor-pointer flex-row items-center gap-2 rounded-lg px-1.5 py-1",
  "transition-colors hover:bg-background-secondary",
);

export const filterOptionLabelClass = "flex-1 min-w-0";

export const filterOptionCountClass = "text-xs text-foreground-tertiary tabular-nums";

export const filterChipsClass = "flex flex-row flex-wrap items-center gap-2";

export const filterTagsClass = "flex flex-row flex-wrap gap-1.5";

export const filterRangeRowClass = "flex flex-row items-center gap-2";

export const filterRangeDashClass = "text-foreground-tertiary";

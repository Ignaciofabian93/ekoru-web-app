/**
 *
 * Usage:  className={reviewsPanelStarClass[state]}
 * ─────────────────────────────────────────────────────────────────
 */

import clsx from "clsx";

export const reviewsPanelRootClass = "flex flex-col gap-4";

export const reviewsPanelHeaderClass =
  "flex flex-wrap items-baseline justify-between gap-2";

export const reviewsPanelSummaryClass = "flex items-center gap-2";

export const reviewsPanelStarsClass = "flex items-center gap-0.5";

/** Filled vs empty star. `interactive` adds the hover hint on the write form. */
export const reviewsPanelStarClass = {
  filled: "fill-warning text-warning",
  empty: "text-border-strong",
  emptyInteractive: "text-border-strong hover:text-warning",
};

export const reviewsPanelFormClass = clsx(
  "flex flex-col gap-3 rounded-2xl p-4",
  "border border-border-light bg-surface",
);

export const reviewsPanelRatingRowClass = "flex items-center gap-1";

export const reviewsPanelRatingButtonClass = "p-0.5";

export const reviewsPanelLoadingClass =
  "h-24 animate-pulse rounded-2xl bg-background-secondary";

export const reviewsPanelListClass = "flex flex-col gap-3";

export const reviewsPanelItemClass = clsx(
  "flex flex-col gap-2 rounded-2xl p-4",
  "border border-border-light bg-surface",
);

export const reviewsPanelItemHeaderClass =
  "flex flex-wrap items-center justify-between gap-2";

export const reviewsPanelVerifiedClass =
  "flex items-center gap-1 text-xs font-semibold text-success";

export const reviewsPanelDeleteClass = clsx(
  "flex w-fit items-center gap-1",
  "text-xs font-semibold text-danger hover:underline disabled:opacity-50",
);

export const reviewsPanelStarSize = 16;

export const reviewsPanelStarSizeSmall = 14;

export const reviewsPanelStarSizeInput = 22;

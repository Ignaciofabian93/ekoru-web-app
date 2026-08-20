/**
 *
 * Usage:  className={chipClass[tone]}
 * ─────────────────────────────────────────────────────────────────
 */

import clsx from "clsx";
import { single } from "@/design/variants";

export const comingSoonChipClass = clsx(
  "rounded-full border border-border-strong bg-background px-2 py-0.5",
  "text-xs font-medium text-foreground",
);

export type ChipTone = "idle" | "selected";

const chipBaseClass = clsx(
  "inline-flex h-7 shrink-0 items-center gap-1.5 rounded-full border px-3",
  "text-sm font-medium transition-colors",
);

/**
 * Two states, one shape. `idle` is the neutral outline a suggestion or an
 * unpicked facet wears; `selected` is the lime wash that marks a filter as
 * on — the same pair the active-filter row and the tag facets share, so a
 * chip reads the same wherever it appears.
 */
export const chipClass = single(chipBaseClass, {
  idle: "border-border-strong bg-background text-foreground",
  selected: "border-primary bg-primary-light-bg text-primary-active",
} satisfies Record<ChipTone, string>);

/** Added when the chip is a control rather than a static label. */
export const chipInteractiveClass = clsx(
  "cursor-pointer hover:border-primary-light hover:text-primary-active",
  "outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
);

export const chipCountClass = single("text-xs tabular-nums", {
  idle: "text-foreground-tertiary",
  selected: "text-primary",
} satisfies Record<ChipTone, string>);

/** The trailing ✕ on a removable chip — a real button inside a static shell. */
export const chipRemoveClass = clsx(
  "flex cursor-pointer items-center justify-center rounded-full",
  "text-current opacity-80 transition-opacity hover:opacity-100",
  "outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
);

export const chipRemoveIconSize = 14;

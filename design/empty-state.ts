/**
 *
 * Usage:  className={emptyStateClass[frame]}
 * ─────────────────────────────────────────────────────────────────
 */

import clsx from "clsx";
import { single } from "@/design/variants";

export type EmptyStateFrame = "bare" | "framed";

const emptyStateBaseClass = "flex flex-col items-center gap-3 text-center";

/**
 * `bare` is the inline state a grid shows in place of its rows. `framed` is
 * the whole-page version — a soft panel that fills the space a full result set
 * would have taken, so an empty search still reads as a finished page.
 */
export const emptyStateClass = single(emptyStateBaseClass, {
  bare: "py-16",
  framed: "rounded-2xl border border-slate-200 bg-background-secondary px-6 py-14",
} satisfies Record<EmptyStateFrame, string>);

export const emptyStateIconClass = "text-foreground-secondary opacity-30";

export const emptyStateIconSize = 48;

export const emptyStateDescriptionClass = "max-w-115";

export const emptyStateTipsClass = "mt-3 flex flex-col items-start gap-2 text-left";

export const emptyStateTipClass = "flex flex-row items-center gap-2";

export const emptyStateTipIconClass = "shrink-0 text-primary";

export const emptyStateTipIconSize = 16;

export const emptyStateActionsClass = clsx(
  "mt-5 flex flex-row flex-wrap items-center justify-center gap-2",
);

/**
 *
 * Usage:  className={dataListClass}
 * ─────────────────────────────────────────────────────────────────
 */

import clsx from "clsx";

/**
 * The framed surface: a hairline card that clips its own rows, so the first and
 * last row inherit the rounded corners instead of squaring them off.
 */
export const dataListClass = clsx(
  "flex flex-col overflow-hidden bg-white",
  "rounded-2xl border border-slate-200",
);

/** Header strip for the optional caption, divided from the rows by the same hairline. */
export const dataListCaptionClass = "border-b border-slate-200 px-4 py-2.5";

export const dataListBodyClass = "flex flex-col divide-y divide-slate-200";

/** Label left, value right — the shape every row in the list shares. */
export const dataListRowClass =
  "flex items-center justify-between gap-4 px-4 py-3";

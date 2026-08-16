/**
 *
 * Usage:  className={clsx(toggleTrackClass, toggleTrackStateClass.checked)}
 * ─────────────────────────────────────────────────────────────────
 */

import clsx from "clsx";

export const toggleTrackClass = clsx(
  "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2",
  "transition-colors duration-200",
  "outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
);

/** Mutually exclusive — both set border-color and background. */
export const toggleTrackStateClass = {
  checked: "border-primary bg-primary",
  unchecked: "border-border-strong bg-background-tertiary",
};

export const toggleDisabledClass = "cursor-not-allowed opacity-50";

export const toggleThumbClass = clsx(
  "inline-block h-4 w-4 transform rounded-full bg-white shadow-sm",
  "transition-transform duration-200",
);

export const toggleThumbStateClass = {
  checked: "translate-x-5",
  unchecked: "translate-x-1",
};

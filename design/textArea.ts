/**
 *
 * Usage:  className={clsx(textAreaFieldClass, textAreaBorderClass.error)}
 * ─────────────────────────────────────────────────────────────────
 */

import clsx from "clsx";

export const textAreaRootClass = "flex w-full flex-col gap-1.5";

export const textAreaLabelClass =
  "font-sans text-sm font-medium text-foreground-secondary";

export const textAreaFieldClass = clsx(
  "resize-y rounded-md border-2 border-solid bg-surface px-4 py-3",
  "font-sans text-base font-normal text-foreground outline-none",
  "transition-[border-color] duration-150",
);

/** Mutually exclusive — both set border-color. */
export const textAreaBorderClass = {
  error: "border-danger",
  default: "border-input-border focus:border-primary",
};

export const textAreaErrorTextClass = "font-sans text-xs font-normal text-danger";

/**
 *
 * Usage:  className={checkboxBoxClass[variant][size]}
 * ─────────────────────────────────────────────────────────────────
 */

import clsx from "clsx";
import type {
  CheckboxSize,
  CheckboxVariant,
} from "@/components/Primitives/Checkbox/Checkbox";
import { cross, crossState } from "@/design/variants";

const checkboxBoxBaseClass = clsx(
  "mt-px flex shrink-0 items-center justify-center",
  "border-2 border-solid",
  "transition-[background-color,border-color] duration-150",
);

const checkboxSizeClass: Record<CheckboxSize, string> = {
  sm: "size-4.5 rounded-[4px]",
  md: "size-5.5 rounded-[5px]",
  lg: "size-6.5 rounded-[6px]",
};

const checkboxVariantClass: Record<CheckboxVariant, string> = {
  default: "border-input-border bg-surface",
  filled: "border-transparent bg-background-secondary",
  outline: "border-primary bg-transparent",
};

/**
 * Unchecked box, per variant × size. Checked state *replaces* this rather than
 * layering on top — both set border-color and background, and clsx does not
 * resolve Tailwind conflicts, so the two must stay mutually exclusive.
 */
export const checkboxBoxClass = cross(
  checkboxBoxBaseClass,
  checkboxVariantClass,
  checkboxSizeClass,
);

export const checkboxBoxCheckedClass = crossState(
  checkboxBoxBaseClass,
  "border-primary bg-primary",
  checkboxSizeClass,
);

export const checkboxIconSize: Record<CheckboxSize, number> = {
  sm: 12,
  md: 16,
  lg: 20,
};

export const checkboxRootClass = "flex flex-col gap-1";

export const checkboxControlClass = clsx(
  "flex cursor-pointer flex-row items-start gap-3 p-0 text-left",
  "disabled:cursor-not-allowed disabled:opacity-50",
);

export const checkboxTickClass = "text-on-primary transition-opacity duration-100";

export const checkboxLabelGroupClass = "flex flex-1 flex-col gap-0.5";

export const checkboxLabelClass = "font-sans text-sm font-medium";

export const checkboxLabelToneClass = {
  error: "text-danger",
  disabled: "text-foreground-tertiary",
  default: "text-foreground",
};

export const checkboxDescriptionClass =
  "font-sans text-sm font-normal leading-4.5 text-foreground-secondary";

export const checkboxErrorClass = "pl-8.5 font-sans text-xs font-normal text-danger";

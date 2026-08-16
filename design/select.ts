/**
 *
 * Usage:  className={selectTriggerClass[variant][size]}
 * ─────────────────────────────────────────────────────────────────
 */

import clsx from "clsx";
import type {
  SelectSize,
  SelectVariant,
  SelectWidth,
} from "@/components/Primitives/Select/Select.types";
import { cross } from "@/design/variants";

const selectTriggerBaseClass = clsx(
  "relative box-border flex flex-row items-center gap-2 rounded-md",
  "border-2 border-solid outline-none",
  "transition-[border-color] duration-150",
);

/** Only the parts of the size scale that belong on the trigger itself. */
const selectSizeClass: Record<SelectSize, string> = {
  sm: "h-9 px-2.5",
  md: "h-11 px-3",
  lg: "h-14 px-3.5",
};

const selectVariantClass: Record<SelectVariant, string> = {
  default: "bg-input-bg",
  filled: "bg-background-secondary",
  outline: "bg-transparent",
};

/**
 * Trigger for every variant × size pair: `selectTriggerClass[variant][size]`.
 * Carries background only — the border comes from one of the three state maps
 * below, since idle/focus/error are mutually exclusive.
 */
export const selectTriggerClass = cross(
  selectTriggerBaseClass,
  selectVariantClass,
  selectSizeClass,
);

export const selectIdleBorderClass: Record<SelectVariant, string> = {
  default: "border-input-border",
  filled: "border-transparent",
  outline: "border-primary",
};

export const selectFocusBorderClass: Record<SelectVariant, string> = {
  default: "border-input-border-focus",
  filled: "border-input-border-focus",
  outline: "border-primary-active",
};

export const selectErrorBorderClass = "border-danger";

export const selectStateClass = {
  disabled: "cursor-not-allowed opacity-50",
  default: "cursor-pointer",
};

/** Indent of the trigger label, clearing the leading icon when there is one. */
export const selectPadLeftClass: Record<SelectSize, string> = {
  sm: "pl-5.5",
  md: "pl-6",
  lg: "pl-6.5",
};

export const selectTextClass: Record<SelectSize, string> = {
  sm: "text-xs",
  md: "text-base",
  lg: "text-lg",
};

export const selectIconSize: Record<SelectSize, number> = {
  sm: 14,
  md: 16,
  lg: 18,
};

export const selectWidthClass: Record<SelectWidth, string> = {
  sm: "w-1/3",
  md: "w-1/2",
  lg: "w-2/3",
  full: "w-full",
};

export const selectRootClass = "relative flex flex-col gap-px";

export const selectLeftIconClass = "absolute left-3 flex";

export const selectValueGroupClass =
  "flex flex-1 flex-row items-center gap-2 overflow-hidden";

export const selectValueClass = "flex-1 truncate text-left font-sans font-normal";

export const selectValueToneClass = {
  selected: "text-input-text",
  placeholder: "text-input-placeholder",
};

export const selectChevronClass = "flex transition-transform duration-200";

export const selectChevronToneClass = {
  error: "text-danger",
  open: "text-primary",
  idle: "text-foreground-tertiary",
};

export const selectErrorTextClass = "font-sans text-xs font-normal text-danger";

export const selectDropdownClass = clsx(
  "absolute right-0 left-0 z-10 flex max-h-80 flex-col overflow-hidden",
  "rounded-lg border-[1.5px] border-solid border-border-light bg-surface shadow-md",
);

export const selectDropdownDirectionClass = {
  up: "bottom-full mb-2",
  down: "top-full mt-2",
};

export const selectSearchClass = clsx(
  "shrink-0 border-b border-border-light px-4 py-2",
  "font-sans text-base font-normal text-input-text outline-none",
);

export const selectListboxClass = "max-h-67 overflow-y-auto";

export const selectNoResultsClass =
  "block px-4 py-3 font-sans text-sm font-normal italic text-foreground-secondary";

export const selectOptionClass = "flex w-full cursor-pointer p-0 text-left";

export const selectOptionSelectedClass = "bg-primary/10";

export const selectOptionDividerClass = "border-b border-border-light";

export const selectOptionRowClass =
  "flex flex-1 flex-row items-center gap-2.5 px-4 py-3.5";

export const selectOptionLabelClass = "flex-1 font-sans leading-5";

export const selectOptionLabelToneClass = {
  selected: "font-semibold text-primary",
  default: "font-normal text-foreground",
};

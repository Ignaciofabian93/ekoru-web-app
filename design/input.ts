/**
 *
 * Usage:  className={inputFieldClass[variant][size]}
 * ─────────────────────────────────────────────────────────────────
 */

import clsx from "clsx";
import type {
  InputSize,
  InputVariant,
  InputWidth,
} from "@/components/Primitives/Inputs/Input.types";
import { cross, crossState } from "@/design/variants";

const inputFieldBaseClass = clsx(
  "box-border h-full w-full rounded-md",
  "border-2 border-solid",
  "font-sans font-normal text-input-text outline-none",
  "transition-[border-color,background-color] duration-150",
);

/** Only the parts of the size scale that belong on the field element itself. */
const inputSizeClass: Record<InputSize, string> = {
  sm: "px-2.5 text-xs",
  md: "px-3 text-base",
  lg: "px-3.5 text-lg",
};

const inputVariantClass: Record<InputVariant, string> = {
  default: "bg-input-bg border-input-border focus:border-input-border-focus",
  filled:
    "bg-background-secondary border-transparent focus:bg-input-bg focus:border-input-border-focus",
  outline: "bg-transparent border-primary focus:bg-primary/5 focus:border-primary-active",
};

/** Field element for every variant × size pair: `inputFieldClass[variant][size]`. */
export const inputFieldClass = cross(
  inputFieldBaseClass,
  inputVariantClass,
  inputSizeClass,
);

/**
 * Replaces the variant entirely while the field is in error — both set
 * border-color, and clsx does not resolve Tailwind conflicts.
 */
export const inputFieldErrorClass = crossState(
  inputFieldBaseClass,
  "border-danger",
  inputSizeClass,
);

/** Room for the leading icon / trailing button, added only when one is shown. */
export const inputPadLeftClass: Record<InputSize, string> = {
  sm: "pl-8",
  md: "pl-9",
  lg: "pl-10",
};

export const inputPadRightClass: Record<InputSize, string> = {
  sm: "pr-8",
  md: "pr-9",
  lg: "pr-10",
};

export const inputHeightClass: Record<InputSize, string> = {
  sm: "h-9",
  md: "h-11",
  lg: "h-14",
};

export const inputWidthClass: Record<InputWidth, string> = {
  sm: "w-1/3",
  md: "w-1/2",
  lg: "w-2/3",
  full: "w-full",
};

export const inputIconSize: Record<InputSize, number> = {
  sm: 14,
  md: 16,
  lg: 18,
};

export const inputRootClass = "relative flex flex-col gap-px";

export const inputRowClass = "group relative flex items-center";

export const inputLabelClass = "font-sans text-sm font-medium text-foreground";

export const inputLeftIconClass = "pointer-events-none absolute left-3 z-1 flex";

export const inputLeftIconToneClass = {
  error: "text-danger",
  default: "text-foreground-tertiary group-focus-within:text-primary",
};

export const inputTrailingButtonClass = clsx(
  "absolute right-3 flex cursor-pointer items-center p-0",
  "text-foreground-tertiary transition-opacity duration-75",
);

export const inputErrorTextClass =
  "absolute -bottom-4.5 font-sans text-xs font-normal text-danger";

/** Suppresses the native search affordance so the custom clear button is the only one. */
export const inputSearchResetClass = "[&::-webkit-search-cancel-button]:appearance-none";

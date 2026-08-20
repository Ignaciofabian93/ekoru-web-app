/**
 *
 * Usage:  className={buttonClass[variant][size]}
 * ─────────────────────────────────────────────────────────────────
 */

import clsx from "clsx";
import type {
  ButtonSize,
  ButtonVariant,
} from "@/components/Primitives/Button/Button.types";
import { iconSize } from "@/design/tokens";
import { cross } from "@/design/variants";

const buttonBaseClass = clsx(
  "relative box-border inline-flex flex-row items-center justify-center",
  "mx-auto min-w-35",
  "font-sans font-bold leading-[1.45]",
  "cursor-pointer select-none",
  "border border-solid outline-none",
  "transition duration-200 ease-in-out active:scale-[0.96]",
  "disabled:cursor-not-allowed disabled:opacity-50",
);

/**
 * Height, radius and type scale — the button's frame, without the padding that
 * only a label needs. Split out so a control that must sit in a button's place
 * inherits the same footprint instead of restating it (see
 * `design/quantity-stepper.ts`).
 */
export const buttonShapeClass: Record<ButtonSize, string> = {
  sm: "min-h-8 rounded-sm text-sm",
  md: "min-h-10 rounded-md text-base",
  lg: "min-h-12 rounded-md text-base",
};

export const buttonPaddingClass: Record<ButtonSize, string> = {
  sm: "px-3.5 py-2",
  md: "px-5 py-3",
  lg: "px-6 py-4",
};

export const buttonSizeClass: Record<ButtonSize, string> = {
  sm: clsx(buttonShapeClass.sm, buttonPaddingClass.sm),
  md: clsx(buttonShapeClass.md, buttonPaddingClass.md),
  lg: clsx(buttonShapeClass.lg, buttonPaddingClass.lg),
};

/** The look itself: gradient, border and text color per variant. */
export const buttonVariantClass: Record<ButtonVariant, string> = {
  primary: clsx(
    "border-primary bg-linear-180 from-primary to-primary/60 text-on-primary",
    "hover:from-primary/90 hover:to-primary/80",
  ),
  secondary: clsx(
    "border-secondary-dark bg-linear-180 from-secondary-dark to-secondary-dark/60 text-white",
    "hover:from-secondary-dark/90 hover:to-secondary-dark/80",
  ),
  outline: clsx(
    "border-secondary-dark bg-white text-secondary-dark",
    "hover:brightness-110",
  ),
  ghost: "border-transparent bg-transparent text-foreground hover:bg-slate-50",
  success: clsx(
    "border-success bg-linear-180 from-success to-success/60 text-white",
    "hover:from-success/90 hover:to-success/80",
  ),
  warning: clsx(
    "border-warning bg-linear-180 from-warning to-warning/60 text-white",
    "hover:from-warning/90 hover:to-warning/80",
  ),
  error: clsx(
    "border-red-600 bg-linear-180 from-red-600 to-red-600/60 text-white",
    "hover:from-red-600/90 hover:to-red-600/80",
  ),
};

/** Root class for every variant × size pair: `buttonClass[variant][size]`. */
export const buttonClass = cross(buttonBaseClass, buttonVariantClass, buttonSizeClass);

/** Wrapper around the label + icons, hidden while the spinner shows. */
export const buttonContentClass: Record<ButtonSize, string> = {
  sm: "flex flex-row items-center gap-1",
  md: "flex flex-row items-center gap-2",
  lg: "flex flex-row items-center gap-2",
};

export const buttonSpinnerClass =
  "absolute size-4 animate-spin rounded-full border-2 border-current border-t-transparent";

export const buttonIconSize: Record<ButtonSize, number> = {
  sm: iconSize.sm,
  md: iconSize.md,
  lg: iconSize.lg,
};

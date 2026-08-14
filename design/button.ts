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
import { fontFamily, iconSize } from "@/design/tokens";

const buttonBaseClass = clsx(
  "relative box-border inline-flex flex-row items-center justify-center",
  "mx-auto min-w-35",
  "font-bold leading-[1.45]",
  "cursor-pointer select-none",
  "border border-solid outline-none",
  "transition duration-200 ease-in-out active:scale-[0.96]",
  "disabled:cursor-not-allowed disabled:opacity-50",
  fontFamily.sans,
);

const buttonSizeClass: Record<ButtonSize, string> = {
  sm: "min-h-8 rounded-sm px-3.5 py-2 text-sm",
  md: "min-h-10 rounded-md px-5 py-3 text-base",
  lg: "min-h-12 rounded-md px-6 py-4 text-base",
};

const buttonVariantClass: Record<ButtonVariant, string> = {
  primary: clsx(
    "border-primary bg-linear-180 from-primary to-primary/60 text-on-primary",
    "hover:from-primary/90 hover:to-primary/80",
  ),
  secondary: clsx(
    "border-secondary-dark bg-linear-180 from-secondary-dark to-secondary-dark/60 text-white",
    "hover:from-secondary-dark/90 hover:to-secondary-dark/80",
  ),
  outline: clsx(
    "border-slate-800 bg-linear-180 from-slate-50 to-slate-50/60 text-slate-800",
    "hover:from-slate-50/90 hover:to-slate-50/80",
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
export const buttonClass = Object.fromEntries(
  (Object.keys(buttonVariantClass) as ButtonVariant[]).map((variant) => [
    variant,
    Object.fromEntries(
      (Object.keys(buttonSizeClass) as ButtonSize[]).map((size) => [
        size,
        clsx(buttonBaseClass, buttonSizeClass[size], buttonVariantClass[variant]),
      ]),
    ),
  ]),
) as Record<ButtonVariant, Record<ButtonSize, string>>;

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

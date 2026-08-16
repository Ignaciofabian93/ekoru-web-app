/**
 *
 * Usage:  className={clsx(textBaseClass, textSizeClass[size], textColorClass[color])}
 *
 * Text has no variant × size cross-product — size, weight, colour and alignment
 * are independent axes that combine freely, so they stay as flat maps rather
 * than being multiplied into a nested lookup.
 * ─────────────────────────────────────────────────────────────────
 */

import clsx from "clsx";
import type {
  TextAlign,
  TextColor,
  TextSize,
  TextVariant,
  TextWeight,
} from "@/components/Primitives/Text/Text.types";

export const textBaseClass = "m-0 font-sans";

export const textSizeClass: Record<TextSize, string> = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
};

export const textWeightClass: Record<TextWeight, string> = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};

export const textColorClass: Record<TextColor, string> = {
  default: "text-foreground",
  primary: "text-primary",
  primaryDark: "text-primary-dark",
  secondary: "text-foreground-secondary",
  tertiary: "text-foreground-tertiary",
  muted: "text-foreground-muted",
  error: "text-danger",
  success: "text-success",
  warning: "text-warning",
  white: "text-white",
  red: "text-red-600",
};

export const textAlignClass: Record<TextAlign, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
  justify: "text-justify",
};

export const textLineClampClass: Record<number, string> = {
  1: "truncate",
  2: "line-clamp-2",
  3: "line-clamp-3",
  4: "line-clamp-4",
  5: "line-clamp-5",
  6: "line-clamp-6",
};

/** Extra decoration a few variants carry beyond the shared axes. */
export const textVariantClass: Partial<Record<TextVariant, string>> = {
  blockquote: "italic pl-3",
  code: clsx("font-mono bg-background-secondary rounded-[4px] px-1 py-0.5"),
};

export const textBlockquoteWrapperClass = "flex items-stretch gap-2.5 py-0.5";

export const textBlockquoteBarClass = "w-0.75 shrink-0 rounded-xs bg-primary";

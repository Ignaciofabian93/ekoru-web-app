/**
 *
 * Usage:  className={clsx(titleBaseClass, titleSizeClass[level], titleColorClass[color])}
 *
 * Like Text, Title's axes are independent rather than a variant × size grid.
 * ─────────────────────────────────────────────────────────────────
 */

import type {
  TitleAlign,
  TitleColor,
  TitleLevel,
  TitleWeight,
} from "@/components/Primitives/Title/Title.types";

export const titleBaseClass = "m-0 font-sans";

// text-* classes resolve to the design-token font scale (design/tokens.ts
// fontSize, mirrored in globals.css @theme): 36 / 30 / 24 / 20 / 17 / 15.
export const titleSizeClass: Record<TitleLevel, string> = {
  h1: "text-4xl",
  h2: "text-3xl",
  h3: "text-2xl",
  h4: "text-xl",
  h5: "text-lg",
  h6: "text-base",
};

export const titleWeightClass: Record<TitleWeight, string> = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
  extrabold: "font-bold",
};

export const titleColorClass: Record<TitleColor, string> = {
  default: "text-foreground",
  primary: "text-primary",
  secondary: "text-foreground-secondary",
  tertiary: "text-foreground-tertiary",
  error: "text-danger",
  success: "text-success",
  warning: "text-warning",
  white: "text-white",
};

export const titleAlignClass: Record<TitleAlign, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export const titleTruncateClass = "truncate";

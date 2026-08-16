/**
 *
 * Usage:  className={iconButtonClass[variant][size]}
 * ─────────────────────────────────────────────────────────────────
 */

import clsx from "clsx";
import type {
  IconButtonShape,
  IconButtonSize,
  IconButtonVariant,
} from "@/components/Primitives/IconButton/IconButton";
import { iconSize } from "@/design/tokens";
import { cross } from "@/design/variants";

const iconButtonBaseClass = clsx(
  "inline-flex shrink-0 cursor-pointer items-center justify-center",
  "border-2 border-solid outline-none",
  "transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-primary",
  "disabled:cursor-not-allowed disabled:opacity-50",
);

const iconButtonSizeClass: Record<IconButtonSize, string> = {
  sm: "size-8",
  md: "size-10",
  lg: "size-12",
};

const iconButtonVariantClass: Record<IconButtonVariant, string> = {
  primary: "border-transparent bg-primary text-on-primary hover:brightness-110",
  surface:
    "border-border bg-surface text-foreground-secondary hover:bg-background-secondary",
  outline: "border-primary bg-surface text-primary hover:bg-primary-light-bg",
  ghost:
    "border-transparent bg-transparent text-foreground-secondary hover:bg-background-secondary",
  overlay: "border-transparent bg-black/40 text-white backdrop-blur-sm hover:bg-black/55",
};

/** Root class for every variant × size pair: `iconButtonClass[variant][size]`. */
export const iconButtonClass = cross(
  iconButtonBaseClass,
  iconButtonVariantClass,
  iconButtonSizeClass,
);

/** Third axis — kept separate so the lookup stays two levels deep. */
export const iconButtonShapeClass: Record<IconButtonShape, string> = {
  circle: "rounded-full",
  rounded: "rounded-xl",
};

export const iconButtonIconSize: Record<IconButtonSize, number> = {
  sm: iconSize.sm,
  md: iconSize.md,
  lg: iconSize.lg,
};

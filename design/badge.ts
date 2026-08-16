/**
 *
 * Usage:  className={badgeClass[variant][size]}
 * ─────────────────────────────────────────────────────────────────
 */

import type { BadgeSize, BadgeVariant } from "@/components/Primitives/Badge/Badge";
import { cross } from "@/design/variants";

const badgeBaseClass =
  "inline-flex w-fit items-center rounded-full border font-semibold shadow-sm";

const badgeSizeClass: Record<BadgeSize, string> = {
  small: "gap-1 px-2 py-0.5 text-[11px]",
  medium: "gap-1.5 px-2.5 py-1 text-xs",
  large: "gap-1.5 px-3 py-1.5 text-sm",
};

const badgeVariantClass: Record<BadgeVariant, string> = {
  primary: "border-primary bg-linear-120 from-primary to-primary/60 text-white",
  secondary:
    "border-secondary-dark bg-linear-120 from-secondary-dark to-secondary-dark/60 text-white",
  tertiary: "bg-secondary/15 text-secondary",
  descriptive: "bg-primary/10 text-primary",
  attention: "bg-red-500 text-white",
  ghost: "border-border-light bg-transparent text-foreground-secondary",
};

/** Root class for every variant × size pair: `badgeClass[variant][size]`. */
export const badgeClass = cross(badgeBaseClass, badgeVariantClass, badgeSizeClass);

export const badgeIconSize: Record<BadgeSize, number> = {
  small: 12,
  medium: 14,
  large: 16,
};

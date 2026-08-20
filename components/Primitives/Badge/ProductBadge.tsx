"use client";

import clsx from "clsx";
import type { LucideIcon } from "lucide-react";
import type React from "react";
import {
  badgeIconSize,
  productConditionBadgeClass,
  productInfoBadgeClass,
} from "@/design/badge";
import type { ProductCondition } from "@/types/enums";
import type { BadgeSize } from "./Badge";

/** What is happening to a listing right now, as opposed to how worn it is. */
export type ProductInfoType = "EXCHANGEABLE" | "OFFER" | "SOLD_OUT";

export interface ProductConditionBadgeProps {
  /** Drives the colour — see `conditionToneClass` in `design/badge.ts`. */
  condition: ProductCondition;
  /** Pass a translated string; the badge resolves no copy of its own. */
  label: string;
  size?: BadgeSize;
  /** Positioning and stacking belong to the caller, not the badge. */
  className?: string;
  style?: React.CSSProperties;
}

/**
 * How worn the product is. One tone per `ProductCondition`, so the same
 * listing reads identically on a card and on its detail page.
 */
export function ProductConditionBadge({
  condition,
  label,
  size = "small",
  className,
  style,
}: ProductConditionBadgeProps) {
  return (
    <span
      className={clsx(productConditionBadgeClass[condition][size], className)}
      style={style}
    >
      {label}
    </span>
  );
}

export interface ProductInfoBadgeProps {
  /** Drives the colour — see `infoToneClass` in `design/badge.ts`. */
  type: ProductInfoType;
  /** Pass a translated string; the badge resolves no copy of its own. */
  label: string;
  icon?: LucideIcon;
  size?: BadgeSize;
  /** Positioning and stacking belong to the caller, not the badge. */
  className?: string;
  style?: React.CSSProperties;
}

/**
 * A listing's current status: open to swaps, on promotion, or gone. Solid
 * fills, since these are the badges that sit over a photo.
 */
export function ProductInfoBadge({
  type,
  label,
  icon: Icon,
  size = "small",
  className,
  style,
}: ProductInfoBadgeProps) {
  return (
    <span className={clsx(productInfoBadgeClass[type][size], className)} style={style}>
      {Icon && <Icon size={badgeIconSize[size]} strokeWidth={2.5} aria-hidden />}
      {label}
    </span>
  );
}

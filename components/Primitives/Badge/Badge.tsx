"use client";

import clsx from "clsx";
import type { LucideIcon } from "lucide-react";
import type React from "react";

export type BadgeVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "descriptive"
  | "ghost"
  | "attention";
export type BadgeSize = "small" | "medium" | "large";

export interface BadgeProps {
  label?: string | number;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: LucideIcon;
  style?: React.CSSProperties;
}

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  primary: "bg-linear-120 from-primary to-primary-light/80 text-white border-primary",
  secondary:
    "bg-linear-120 from-secondary-dark to-secondary-dark/60 text-white border-secondary-dark",
  tertiary: "bg-secondary/15 text-secondary",
  descriptive: "bg-primary/10 text-primary",
  attention: "bg-red-500 text-white",
  ghost: "border border-border-light bg-transparent text-foreground-secondary",
};

const SIZE_STYLES: Record<BadgeSize, string> = {
  small: "gap-1 px-2 py-0.5 text-[11px]",
  medium: "gap-1.5 px-2.5 py-1 text-xs",
  large: "gap-1.5 px-3 py-1.5 text-sm",
};

const ICON_SIZE: Record<BadgeSize, number> = { small: 12, medium: 14, large: 16 };

export function Badge({
  label,
  variant = "primary",
  size = "medium",
  icon: Icon,
  style,
}: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex w-fit items-center rounded-full font-semibold shadow-sm border",
        VARIANT_STYLES[variant],
        SIZE_STYLES[size],
      )}
      style={style}
    >
      {Icon && <Icon size={ICON_SIZE[size]} strokeWidth={2.5} />}
      {label}
    </span>
  );
}

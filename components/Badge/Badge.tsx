"use client";

import clsx from "clsx";
import { type LucideIcon } from "lucide-react";

type BadgeVariant = "primary" | "secondary" | "tertiary" | "descriptive" | "ghost";
type BadgeSize = "small" | "medium" | "large";

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  primary: "bg-primary text-white",
  secondary: "bg-white text-secondary-dark",
  tertiary: "bg-secondary/15 text-secondary",
  descriptive: "bg-primary/10 text-primary",
  ghost: "border border-border-light bg-transparent text-foreground-secondary",
};

const SIZE_STYLES: Record<BadgeSize, string> = {
  small: "gap-1 px-2 py-0.5 text-[11px]",
  medium: "gap-1.5 px-2.5 py-1 text-xs",
  large: "gap-1.5 px-3 py-1.5 text-sm",
};

const ICON_SIZE: Record<BadgeSize, number> = { small: 12, medium: 14, large: 16 };

type BadgeProps = {
  label?: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: LucideIcon;
  style?: React.CSSProperties;
};

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
        "inline-flex w-fit items-center rounded-full font-semibold shadow-sm",
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

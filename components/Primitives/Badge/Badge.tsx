"use client";

import type { LucideIcon } from "lucide-react";
import type React from "react";
import { badgeClass, badgeIconSize } from "@/design/badge";

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

export function Badge({
  label,
  variant = "primary",
  size = "medium",
  icon: Icon,
  style,
}: BadgeProps) {
  return (
    <span className={badgeClass[variant][size]} style={style}>
      {Icon && <Icon size={badgeIconSize[size]} strokeWidth={2.5} />}
      {label}
    </span>
  );
}

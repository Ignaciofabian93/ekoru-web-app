"use client";

import type React from "react";
import type { ProductCondition } from "@/types/enums";
import clsx from "clsx";
import { type LucideIcon } from "lucide-react";

type ProductInfoType = "EXCHANGEABLE" | "OFFER" | "SOLD_OUT";

export interface ProductConditionBadgeProps {
  label?: string | number;
  style?: React.CSSProperties;
  condition?: ProductCondition;
}

export interface ProductInfoBadgeProps {
  label?: string;
  style?: React.CSSProperties;
  icon?: LucideIcon;
  type?: ProductInfoType;
}

const CONDITION_STYLES: Record<ProductCondition, string> = {
  NEW: "bg-primary-light-bg text-primary",
  LIKE_NEW: "bg-primary-light-bg text-primary",
  OPEN_BOX: "bg-primary-light-bg text-primary",
  REFURBISHED: "bg-primary-light-bg text-primary",
  GOOD: "bg-primary-light-bg text-primary",
  FAIR: "bg-amber-50 text-amber-700",
  POOR: "bg-red-50 text-red-600",
  FOR_PARTS: "bg-red-50 text-red-600",
};

export function ProductConditionBadge({
  label,
  style,
  condition,
}: ProductConditionBadgeProps) {
  return (
    <span
      className={clsx(
        "pointer-events-none absolute bottom-2 left-2 z-20 rounded-md px-2 py-0.5 text-xs font-medium",
        CONDITION_STYLES[condition as ProductCondition],
      )}
      style={style}
    >
      {label}
    </span>
  );
}

const productInfoBadgeClass: Record<ProductInfoType, string> = {
  EXCHANGEABLE: "bg-gray-700 text-white",
  OFFER: "bg-danger text-white",
  SOLD_OUT: "bg-red-800 text-white",
};

export function ProductInfoBadge({
  label,
  icon: Icon,
  style,
  type,
}: ProductInfoBadgeProps) {
  return (
    <span
      className={clsx(
        "pointer-events-none absolute top-2 left-2 z-20",
        "inline-flex items-center gap-1 rounded-md",
        "px-2 py-0.5 text-xs font-medium",
        productInfoBadgeClass[type as ProductInfoType],
      )}
      style={style}
    >
      {Icon && <Icon size={12} strokeWidth={2.5} />}
      {label}
    </span>
  );
}

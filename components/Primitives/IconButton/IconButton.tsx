"use client";

import clsx from "clsx";
import type { LucideIcon } from "lucide-react";
import React from "react";
import {
  iconButtonClass,
  iconButtonIconSize,
  iconButtonShapeClass,
} from "@/design/iconButton";

export type IconButtonVariant = "primary" | "surface" | "outline" | "ghost" | "overlay";
export type IconButtonSize = "sm" | "md" | "lg";
export type IconButtonShape = "circle" | "rounded";

export interface IconButtonProps {
  icon: LucideIcon | React.ReactElement;
  /** Required: the button has no visible text to name it. */
  ariaLabel: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  shape?: IconButtonShape;
  disabled?: boolean;
  /** Reflected as `aria-pressed` — use for toggles such as favourite. */
  pressed?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
  ref?: React.Ref<HTMLButtonElement>;
}

function renderIcon(
  icon: LucideIcon | React.ReactElement,
  size: number,
): React.ReactNode {
  if (React.isValidElement(icon)) return icon;
  const Icon = icon as LucideIcon;
  return <Icon size={size} color="currentColor" strokeWidth={2} aria-hidden />;
}

export function IconButton({
  icon,
  ariaLabel,
  onClick,
  variant = "surface",
  size = "md",
  shape = "circle",
  disabled = false,
  pressed,
  type = "button",
  className,
  ref,
}: IconButtonProps) {
  return (
    <button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-pressed={pressed}
      className={clsx(
        iconButtonClass[variant][size],
        iconButtonShapeClass[shape],
        className,
      )}
    >
      {renderIcon(icon, iconButtonIconSize[size])}
    </button>
  );
}

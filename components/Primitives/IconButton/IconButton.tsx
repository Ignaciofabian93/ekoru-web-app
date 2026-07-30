"use client";

import clsx from "clsx";
import type { LucideIcon } from "lucide-react";
import React from "react";

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

const SIZE_CLASS: Record<IconButtonSize, { box: string; icon: number }> = {
  sm: { box: "size-8", icon: 16 },
  md: { box: "size-10", icon: 18 },
  lg: { box: "size-12", icon: 20 },
};

const VARIANT_CLASS: Record<IconButtonVariant, string> = {
  primary: "border-transparent bg-primary text-on-primary hover:brightness-110",
  surface:
    "border-border bg-surface text-foreground-secondary hover:bg-background-secondary",
  outline: "border-primary bg-surface text-primary hover:bg-primary-light-bg",
  ghost: "border-transparent bg-transparent text-foreground-secondary hover:bg-background-secondary",
  overlay: "border-transparent bg-black/40 text-white backdrop-blur-sm hover:bg-black/55",
};

function renderIcon(icon: LucideIcon | React.ReactElement, size: number): React.ReactNode {
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
        "inline-flex shrink-0 cursor-pointer items-center justify-center border-2 border-solid",
        "outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-primary",
        "disabled:cursor-not-allowed disabled:opacity-50",
        shape === "circle" ? "rounded-full" : "rounded-xl",
        SIZE_CLASS[size].box,
        VARIANT_CLASS[variant],
        className,
      )}
    >
      {renderIcon(icon, SIZE_CLASS[size].icon)}
    </button>
  );
}

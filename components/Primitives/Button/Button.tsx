"use client";

import clsx from "clsx";
import type { LucideIcon } from "lucide-react";
import React from "react";
import type { ButtonProps, ButtonSize, ButtonVariant } from "./Button.types";
import { Text, type TextColor } from "../Text";

const SIZE_CLASS: Record<
  ButtonSize,
  { box: string; gap: string; text: string; icon: number }
> = {
  sm: { box: "min-h-8 rounded-sm px-3.5 py-2", gap: "gap-1", text: "text-sm", icon: 16 },
  md: { box: "min-h-10 rounded-md px-5 py-3", gap: "gap-2", text: "text-base", icon: 18 },
  lg: { box: "min-h-12 rounded-md px-6 py-4", gap: "gap-2", text: "text-base", icon: 20 },
};

const TEXT_COLOR_CLASS: Record<ButtonVariant, TextColor> = {
  primary: "white",
  filled: "white",
  secondary: "white",
  secondary_outline: "secondary",
  outline: "primary",
  ghost: "primary",
  success: "white",
  warning: "white",
  error: "red",
};

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary:
    "bg-linear-180 from-primary to-primary-light/80 border border-primary text-on-primary",
  filled: "bg-primary border-primary text-on-primary",
  secondary: "bg-secondary border-secondary text-on-primary",
  secondary_outline: "bg-surface border-secondary text-secondary",
  outline: "bg-surface border-primary text-primary",
  ghost: "bg-transparent border-transparent text-primary",
  success: "bg-success border-success text-on-primary",
  warning: "bg-warning border-warning text-on-primary",
  error: "bg-linear-180 from-red-50 to-red-50/60 border border-red-600 text-red-600",
};

function renderIcon(
  icon: LucideIcon | React.ReactElement,
  size: number,
): React.ReactNode {
  if (React.isValidElement(icon)) return icon;
  const Icon = icon as LucideIcon;
  return <Icon size={size} color="currentColor" strokeWidth={2} />;
}

export function Button({
  text,
  onPress,
  onClick,
  variant = "primary",
  size = "md",
  loading = false,
  loadingText,
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  style,
  type = "button",
  className,
  ref,
}: ButtonProps) {
  const s = SIZE_CLASS[size];
  const textColorClass = TEXT_COLOR_CLASS[variant];
  const isDisabled = disabled || loading;
  const label = loading && loadingText ? loadingText : text;
  const hasBorder =
    variant === "outline" ||
    variant === "secondary_outline" ||
    variant === "ghost" ||
    variant === "error";

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    onClick?.(e);
    onPress?.();
  };

  return (
    <button
      ref={ref}
      type={type}
      onClick={handleClick}
      disabled={isDisabled}
      style={style}
      className={clsx(
        "relative box-border inline-flex flex-row items-center justify-center min-w-35 cursor-pointer select-none border-solid outline-none transition-transform duration-100 active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-50",
        s.box,
        VARIANT_CLASS[variant],
        hasBorder ? "border" : "border-0",
        fullWidth ? "w-full" : "w-fit",
        "mx-auto",
        className,
      )}
    >
      <span className={clsx("flex flex-row items-center", s.gap, loading && "opacity-0")}>
        {leftIcon && renderIcon(leftIcon, s.icon)}
        <Text
          variant="span"
          weight="bold"
          color={textColorClass}
          className={clsx(s.text)}
        >
          {label}
        </Text>
        {rightIcon && renderIcon(rightIcon, s.icon)}
      </span>

      {loading && (
        <span className="absolute size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
    </button>
  );
}

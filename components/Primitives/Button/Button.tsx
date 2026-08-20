"use client";
import clsx from "clsx";
import type { LucideIcon } from "lucide-react";
import React from "react";
import {
  buttonClass,
  buttonContentClass,
  buttonIconSize,
  buttonSpinnerClass,
} from "@/design/button";
import type { ButtonProps } from "./Button.types";

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
  ariaPressed,
  style,
  type = "button",
  className,
  ref,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const label = loading && loadingText ? loadingText : text;
  const icon = buttonIconSize[size];

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
      aria-pressed={ariaPressed}
      style={style}
      className={clsx(
        buttonClass[variant][size],
        fullWidth ? "w-full" : "w-fit",
        className,
      )}
    >
      <span className={clsx(buttonContentClass[size], loading && "opacity-0")}>
        {leftIcon && renderIcon(leftIcon, icon)}
        <span>{label}</span>
        {rightIcon && renderIcon(rightIcon, icon)}
      </span>

      {loading && <span className={buttonSpinnerClass} />}
    </button>
  );
}

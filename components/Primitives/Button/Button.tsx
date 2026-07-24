import { fontFamily } from "@/design/tokens";
import clsx from "clsx";
import type { LucideIcon } from "lucide-react";
import React from "react";

export interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
  loading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  leftIcon?: LucideIcon | React.ReactElement;
  rightIcon?: LucideIcon | React.ReactElement;
  fullWidth?: boolean;
  style?: React.CSSProperties;
  type?: "button" | "submit" | "reset";
  className?: string;
}

export interface IconButtonProps extends ButtonProps {
  icon: LucideIcon | React.ReactElement;
  iconSize: number;
}

const VARIANT_MAPPING = {
  primary: "bg-primary text-white",
  secondary: "",
};

const SIZE_MAPPING = {
  sm: "text-sm h-6 px-3",
  md: "text-base py-2 px-4",
  lg: "text-lg h-12 px-5",
};

function renderIcon(
  icon: LucideIcon | React.ReactElement,
  size?: number,
  color?: string,
): React.ReactNode {
  if (React.isValidElement(icon)) return icon;
  const Icon = icon as LucideIcon;
  return <Icon size={size} color={color} strokeWidth={2} />;
}

export function Button({
  label,
  onClick,
  variant = "primary",
  size = "md",
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{ fontFamily: fontFamily.sans }}
      className={clsx(
        "w-full",
        VARIANT_MAPPING[variant],
        SIZE_MAPPING[size],
        "rounded-sm",
        "cursor-pointer",
      )}
    >
      {label}
    </button>
  );
}

export function IconButton({
  icon,
  variant = "primary",
  iconSize = 14,
}: Omit<IconButtonProps, "label">) {
  if (!icon) return null;
  return (
    <button className={clsx("p-2 rounded-sm", VARIANT_MAPPING[variant])}>
      {renderIcon(icon, iconSize)}
    </button>
  );
}

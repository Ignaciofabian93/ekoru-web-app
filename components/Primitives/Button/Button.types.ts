import type { LucideIcon } from "lucide-react";
import type React from "react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "secondary_outline"
  | "outline"
  | "ghost"
  | "success"
  | "warning"
  | "error"
  | "filled";

export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps {
  text: string;
  onPress?: () => void;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  leftIcon?: LucideIcon | React.ReactElement;
  rightIcon?: LucideIcon | React.ReactElement;
  fullWidth?: boolean;
  style?: React.CSSProperties;
  type?: "button" | "submit" | "reset";
  className?: string;
  ref?: React.Ref<HTMLButtonElement>;
}

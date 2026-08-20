import type { LucideIcon } from "lucide-react";
import type React from "react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "success"
  | "warning"
  | "error";

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
  /**
   * Pressed state for a button that toggles something on and off (save,
   * follow, mute). Without it the label is the only thing that changes, which
   * a screen reader announces as a new button rather than a flipped state.
   */
  ariaPressed?: boolean;
  style?: React.CSSProperties;
  type?: "button" | "submit" | "reset";
  className?: string;
  ref?: React.Ref<HTMLButtonElement>;
}

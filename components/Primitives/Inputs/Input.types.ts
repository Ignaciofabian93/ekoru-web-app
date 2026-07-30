import type { LucideIcon } from "lucide-react";
import type React from "react";

export type InputVariant = "default" | "filled" | "outline";
export type InputSize = "sm" | "md" | "lg";
export type InputWidth = "sm" | "md" | "lg" | "full";

interface BaseInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "size"> {
  label?: string;
  name?: string;
  leftIcon?: LucideIcon;
  errorMessage?: string;
  size?: InputSize;
  width?: InputWidth;
  variant?: InputVariant;
  hasError?: boolean;
  isInvalid?: boolean;
  onChangeText?: (value: string) => void;
  ref?: React.Ref<HTMLInputElement>;
}

export interface InputProps extends BaseInputProps {
  type?: "text" | "email" | "password" | "number" | "search";
}

export interface SearchInputProps extends Omit<BaseInputProps, "type"> {
  /** Show a clear button when there is a value. Defaults to true. */
  clearable?: boolean;
  /** Accessible name of the clear button. */
  clearLabel?: string;
  onClear?: () => void;
}

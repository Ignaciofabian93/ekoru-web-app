import type { LucideIcon } from "lucide-react";
import type React from "react";

export type Option = {
  label: string;
  value: string | number;
  iconColor?: string;
  /** Arbitrary node (e.g. a flag) shown before the label in the trigger and list. */
  icon?: React.ReactNode;
};

export type SelectVariant = "default" | "filled" | "outline";
export type SelectSize = "sm" | "md" | "lg";
export type SelectWidth = "sm" | "md" | "lg" | "full";

export interface SelectProps {
  options?: Option[];
  value?: string | number;
  name?: string;
  label?: string;
  placeholder?: string;
  onChange: (value: string | number) => void;
  variant?: SelectVariant;
  size?: SelectSize;
  width?: SelectWidth;
  disabled?: boolean;
  readOnly?: boolean;
  leftIcon?: LucideIcon;
  errorMessage?: string;
  showColorIcon?: boolean;
  renderOption?: (option: Option, selected: boolean) => React.ReactNode;
  searchEnabled?: boolean;
  dropdownDirection?: "up" | "down";
  noResultsText?: string;
  /**
   * Accessible name for the trigger. Defaults to the visible `label`; pass this
   * when the control needs a fuller name than the label reads on its own.
   */
  ariaLabel?: string;
  /** Id of the element describing this control (a hint or error text). */
  ariaDescribedBy?: string;
  /** Accessible name and placeholder of the in-dropdown search field. */
  searchLabel?: string;
  searchPlaceholder?: string;
  ref?: React.Ref<HTMLDivElement>;
}

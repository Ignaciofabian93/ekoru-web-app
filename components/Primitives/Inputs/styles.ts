import type { InputSize, InputVariant, InputWidth } from "./Input.types";

export const SIZE_CLASS: Record<
  InputSize,
  { h: string; text: string; px: string; padLeft: string; padRight: string; icon: number }
> = {
  sm: { h: "h-9", text: "text-xs", px: "px-2.5", padLeft: "pl-8", padRight: "pr-8", icon: 14 },
  md: { h: "h-11", text: "text-base", px: "px-3", padLeft: "pl-9", padRight: "pr-9", icon: 16 },
  lg: { h: "h-14", text: "text-lg", px: "px-3.5", padLeft: "pl-10", padRight: "pr-10", icon: 18 },
};

export const WIDTH_CLASS: Record<InputWidth, string> = {
  sm: "w-1/3",
  md: "w-1/2",
  lg: "w-2/3",
  full: "w-full",
};

export const VARIANT_CLASS: Record<InputVariant, string> = {
  default: "bg-input-bg border-input-border focus:border-input-border-focus",
  filled:
    "bg-background-secondary border-transparent focus:bg-input-bg focus:border-input-border-focus",
  outline: "bg-transparent border-primary focus:bg-primary/5 focus:border-primary-active",
};

/** Shared shell for the input element itself, before size/variant modifiers. */
export const FIELD_BASE =
  "box-border h-full w-full rounded-md border-2 border-solid font-sans font-normal text-input-text outline-none transition-[border-color,background-color] duration-150";

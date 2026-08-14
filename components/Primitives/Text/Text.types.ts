import type React from "react";
import type { lineHeight } from "@/design/tokens";

export type TextVariant = "p" | "span" | "label" | "blockquote" | "small" | "code";
// Sizes resolve to the design-token font scale (design/tokens.ts fontSize,
// mirrored in globals.css @theme).
export type TextSize = "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
export type TextLeading = keyof typeof lineHeight;
export type TextWeight = "normal" | "medium" | "semibold" | "bold";
export type TextColor =
  | "default"
  | "primary"
  | "primaryDark"
  | "secondary"
  | "tertiary"
  | "error"
  | "success"
  | "warning"
  | "muted"
  | "white"
  | "red";
export type TextAlign = "left" | "center" | "right" | "justify";

export interface TextProps {
  variant?: TextVariant;
  size?: TextSize;
  weight?: TextWeight;
  color?: TextColor;
  /** Line height from the design tokens. Defaults to `relaxed` (body copy). */
  leading?: TextLeading;
  align?: TextAlign;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  /** Maps to CSS line-clamp */
  numberOfLines?: number;
  className?: string;
  onClick?: React.MouseEventHandler;
  ref?: React.Ref<HTMLElement>;
}

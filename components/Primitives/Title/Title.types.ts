import type React from "react";

export type TitleLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
export type TitleWeight = "normal" | "medium" | "semibold" | "bold" | "extrabold";
export type TitleColor =
  | "default"
  | "primary"
  | "secondary"
  | "tertiary"
  | "error"
  | "success"
  | "warning"
  | "white";
export type TitleAlign = "left" | "center" | "right";

export interface TitleProps {
  level?: TitleLevel;
  /** Controls visual size independently from the semantic heading level. Defaults to matching `level`. */
  size?: TitleLevel;
  weight?: TitleWeight;
  color?: TitleColor;
  align?: TitleAlign;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  className?: string;
  /** Maps to CSS line-clamp */
  numberOfLines?: number;
  onClick?: React.MouseEventHandler;
  ref?: React.Ref<HTMLHeadingElement>;
}

import clsx from "clsx";
import { letterSpacing, lineHeight } from "@/design/tokens";
import type {
  TitleAlign,
  TitleColor,
  TitleLevel,
  TitleProps,
  TitleWeight,
} from "./Title.types";

// text-* classes resolve to the design-token font scale (design/tokens.ts
// fontSize, mirrored in globals.css @theme): 36 / 30 / 24 / 20 / 17 / 15.
const SIZE_CLASS: Record<TitleLevel, string> = {
  h1: "text-4xl",
  h2: "text-3xl",
  h3: "text-2xl",
  h4: "text-xl",
  h5: "text-lg",
  h6: "text-base",
};

const WEIGHT_CLASS: Record<TitleWeight, string> = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
  extrabold: "font-bold",
};

const COLOR_CLASS: Record<TitleColor, string> = {
  default: "text-foreground",
  primary: "text-primary",
  secondary: "text-foreground-secondary",
  tertiary: "text-foreground-tertiary",
  error: "text-danger",
  success: "text-success",
  warning: "text-warning",
  white: "text-white",
};

const ALIGN_CLASS: Record<TitleAlign, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export function Title({
  level = "h1",
  size,
  weight = "bold",
  color = "default",
  align = "left",
  style,
  children,
  className,
  numberOfLines,
  onClick,
  ref,
}: TitleProps) {
  const Tag = level;
  return (
    <Tag
      ref={ref}
      style={{ lineHeight: lineHeight.snug, letterSpacing: letterSpacing.snug, ...style }}
      className={clsx(
        "m-0 font-sans",
        SIZE_CLASS[size ?? level],
        WEIGHT_CLASS[weight],
        COLOR_CLASS[color],
        ALIGN_CLASS[align],
        numberOfLines === 1 && "truncate",
        className,
      )}
      onClick={onClick}
    >
      {children}
    </Tag>
  );
}

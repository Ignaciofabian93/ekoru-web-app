import { colors, fontFamily } from "@/design/tokens";
import React from "react";

type Level = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
type Weight = "normal" | "medium" | "semibold" | "bold" | "extrabold";
type TitleColor =
  | "default"
  | "primary"
  | "secondary"
  | "tertiary"
  | "error"
  | "success"
  | "warning"
  | "white";
type Align = "left" | "center" | "right";

export interface TitleProps {
  level?: Level;
  /** Controls visual size independently from the semantic heading level. Defaults to matching `level`. */
  size?: Level;
  weight?: Weight;
  color?: TitleColor;
  align?: Align;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  className?: string;
  /** Maps to CSS line-clamp */
  numberOfLines?: number;
  onClick?: React.MouseEventHandler;
}

const LEVEL_MAP: Record<Level, number> = {
  h1: 36,
  h2: 30,
  h3: 26,
  h4: 22,
  h5: 19,
  h6: 17,
};

const WEIGHT_MAP: Record<Weight, number> = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 700,
};

const COLOR_MAP: Record<TitleColor, string> = {
  default: colors.foreground,
  primary: colors.primary,
  secondary: colors.foregroundSecondary,
  tertiary: colors.foregroundTertiary,
  error: colors.danger,
  success: colors.success,
  warning: colors.warning,
  white: colors.white,
};

const Title = React.forwardRef<HTMLHeadingElement, TitleProps>(
  (
    {
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
    },
    ref,
  ) => {
    const fs = LEVEL_MAP[size ?? level];

    const lineClamp: React.CSSProperties =
      numberOfLines === 1
        ? { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }
        : {};

    const computed: React.CSSProperties = {
      fontFamily: fontFamily.sans,
      fontWeight: WEIGHT_MAP[weight],
      fontSize: fs,
      color: COLOR_MAP[color],
      textAlign: align,
      letterSpacing: -0.4,
      lineHeight: `${fs * 1.2}px`,
      margin: 0,
      ...lineClamp,
    };

    const Tag = level;
    return (
      <Tag
        ref={ref}
        style={{ ...computed, ...style }}
        className={className}
        onClick={onClick}
      >
        {children}
      </Tag>
    );
  },
);

Title.displayName = "Title";

export { Title };

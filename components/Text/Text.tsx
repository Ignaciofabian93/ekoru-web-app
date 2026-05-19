import { borderRadius, colors, fontFamily, fontSize } from "@/design/tokens";
import React from "react";

type Variant = "p" | "span" | "label" | "blockquote" | "small" | "code";
type Size = keyof typeof fontSize;
type Weight = "normal" | "medium" | "semibold" | "bold";
type TextColor =
  | "default"
  | "primary"
  | "primaryDark"
  | "secondary"
  | "tertiary"
  | "error"
  | "success"
  | "warning"
  | "muted"
  | "white";
type Align = "left" | "center" | "right" | "justify";

export interface TextProps {
  variant?: Variant;
  size?: Size;
  weight?: Weight;
  color?: TextColor;
  align?: Align;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  /** Maps to CSS line-clamp */
  numberOfLines?: number;
  className?: string;
  onClick?: React.MouseEventHandler;
}

const SIZE_MAP = fontSize;

const WEIGHT_MAP: Record<Weight, number> = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

const COLOR_MAP: Record<TextColor, string> = {
  default: colors.foreground,
  primary: colors.primary,
  primaryDark: colors.primaryDark,
  secondary: colors.foregroundSecondary,
  tertiary: colors.foregroundTertiary,
  muted: colors.foregroundMuted,
  error: colors.danger,
  success: colors.success,
  warning: colors.warning,
  white: colors.white,
};

const VARIANT_DEFAULTS: Partial<Record<Variant, { size?: Size; weight?: Weight }>> = {
  label: { weight: "medium" },
  small: { size: "xs" },
  code: { size: "sm" },
};

const Text = React.forwardRef<HTMLElement, TextProps>(
  (
    {
      variant = "p",
      size,
      weight,
      color = "default",
      align = "left",
      style,
      children,
      numberOfLines,
      className,
      onClick,
    },
    ref,
  ) => {
    const defaults = VARIANT_DEFAULTS[variant] ?? {};
    const resolvedSize = size ?? defaults.size ?? "base";
    const resolvedWeight = weight ?? defaults.weight ?? "normal";

    const lineClamp: React.CSSProperties =
      numberOfLines === 1
        ? { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }
        : numberOfLines && numberOfLines > 1
          ? {
              display: "-webkit-box",
              WebkitLineClamp: numberOfLines,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }
          : {};

    const computed: React.CSSProperties = {
      fontFamily: fontFamily.sans,
      fontWeight: WEIGHT_MAP[resolvedWeight],
      fontSize: SIZE_MAP[resolvedSize],
      color: COLOR_MAP[color],
      textAlign: align,
      margin: 0,
      ...lineClamp,
      ...(variant === "blockquote" && { fontStyle: "italic", paddingLeft: 12 }),
      ...(variant === "code" && {
        fontFamily: "monospace",
        backgroundColor: colors.backgroundSecondary,
        borderRadius: borderRadius.sm / 2,
        paddingInline: 4,
        paddingBlock: 2,
      }),
    };

    const flatStyle: React.CSSProperties = { ...computed, ...style };
    const sharedProps = { ref: ref as never, style: flatStyle, className, onClick };

    if (variant === "blockquote") {
      return (
        <div style={{ display: "flex", alignItems: "stretch", gap: 10, paddingBlock: 2 }}>
          <div
            style={{
              width: 3,
              borderRadius: borderRadius.sm / 4,
              backgroundColor: colors.primary,
              flexShrink: 0,
            }}
          />
          <blockquote {...sharedProps}>{children}</blockquote>
        </div>
      );
    }

    if (variant === "code") return <code {...sharedProps}>{children}</code>;
    if (variant === "span") return <span {...sharedProps}>{children}</span>;
    if (variant === "label") return <label {...sharedProps}>{children}</label>;
    if (variant === "small") return <small {...sharedProps}>{children}</small>;
    return <p {...sharedProps}>{children}</p>;
  },
);

Text.displayName = "Text";

export { Text };

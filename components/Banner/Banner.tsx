import { borderRadius, colors, fontFamily, fontSize, shadows } from "@/design/tokens";
import React from "react";

type Variant = "primary" | "secondary" | "outlined" | "ghost";

export interface BannerProps {
  title: string;
  description: string;
  variant?: Variant;
  showDots?: boolean;
  animated?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

const VARIANT_CONFIG = {
  primary: {
    gradient: `linear-gradient(to right, ${colors.primaryDark}, ${colors.primary}, ${colors.primaryDark})`,
    textColor: colors.onPrimary,
    dotColor: colors.onPrimary,
    borderWidth: 0,
    borderColor: "transparent",
    shadow: true,
  },
  secondary: {
    gradient: `linear-gradient(to right, ${colors.secondaryDark}, ${colors.secondary}, ${colors.secondaryDark})`,
    textColor: colors.onPrimary,
    dotColor: colors.onPrimary,
    borderWidth: 0,
    borderColor: "transparent",
    shadow: true,
  },
  outlined: {
    gradient: null,
    textColor: colors.foreground,
    dotColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.primary,
    shadow: true,
  },
  ghost: {
    gradient: null,
    textColor: colors.foreground,
    dotColor: colors.foregroundSecondary,
    borderWidth: 0,
    borderColor: "transparent",
    shadow: false,
  },
} as const;

const Banner = React.forwardRef<HTMLDivElement, BannerProps>(
  ({ title, description, variant = "primary", showDots = true, animated: _animated, style, className }, ref) => {
    const config = VARIANT_CONFIG[variant];

    const containerStyle: React.CSSProperties = {
      paddingInline: 20,
      paddingBlock: 14,
      borderRadius: borderRadius.lg,
      width: "100%",
      alignSelf: "center",
      overflow: "hidden",
      boxShadow: config.shadow ? shadows.lg : undefined,
      borderWidth: config.borderWidth,
      borderStyle: config.borderWidth > 0 ? "solid" : undefined,
      borderColor: config.borderColor,
      background: config.gradient
        ? config.gradient
        : variant === "ghost"
          ? "rgba(255,255,255,0.5)"
          : colors.background,
      boxSizing: "border-box",
      ...style,
    };

    return (
      <div ref={ref} style={containerStyle} className={className}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            marginBottom: 8,
          }}
        >
          {showDots && (
            <div
              style={{ width: 8, height: 8, borderRadius: borderRadius.sm, backgroundColor: config.dotColor }}
            />
          )}
          <span
            style={{
              fontSize: fontSize.base,
              fontFamily: fontFamily.sans,
              fontWeight: 700,
              color: config.textColor,
              textAlign: "center",
              letterSpacing: -0.3,
              flexShrink: 1,
            }}
          >
            {title}
          </span>
          {showDots && (
            <div
              style={{ width: 8, height: 8, borderRadius: borderRadius.sm, backgroundColor: config.dotColor }}
            />
          )}
        </div>

        <p
          style={{
            fontSize: fontSize.sm,
            fontFamily: fontFamily.sans,
            fontWeight: 400,
            color: config.textColor,
            textAlign: "center",
            lineHeight: "20px",
            margin: 0,
          }}
        >
          {description}
        </p>
      </div>
    );
  },
);

Banner.displayName = "Banner";

export default Banner;
export { Banner };

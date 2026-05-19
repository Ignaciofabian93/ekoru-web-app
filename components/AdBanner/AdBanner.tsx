import { borderRadius, colors, fontFamily, fontSize } from "@/design/tokens";
import React from "react";

type Variant = "primary" | "secondary" | "outlined" | "ghost";

export interface AdBannerProps {
  icon?: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  title?: string;
  description?: string;
  cta: React.ReactNode;
  variant?: Variant;
  animated?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

const GRADIENT_COLORS: Record<"primary" | "secondary", string> = {
  primary: `linear-gradient(to right, ${colors.primaryDark}, ${colors.primary}, ${colors.primaryDark})`,
  secondary: `linear-gradient(to right, ${colors.secondaryDark}, ${colors.secondary}, ${colors.secondaryDark})`,
};

const ICON_BG: Record<Variant, string> = {
  primary: "rgba(255,255,255,0.15)",
  secondary: "rgba(255,255,255,0.15)",
  outlined: colors.background,
  ghost: colors.background,
};

const ICON_COLOR: Record<Variant, string> = {
  primary: colors.onPrimary,
  secondary: colors.onPrimary,
  outlined: colors.primary,
  ghost: colors.primary,
};

const TEXT_COLOR: Record<Variant, string> = {
  primary: colors.onPrimary,
  secondary: colors.onPrimary,
  outlined: colors.foreground,
  ghost: colors.foreground,
};

const TEXT_MUTED: Record<Variant, string> = {
  primary: "rgba(255,255,255,0.75)",
  secondary: "rgba(255,255,255,0.75)",
  outlined: colors.foregroundSecondary,
  ghost: colors.foregroundSecondary,
};

const AdBanner = React.forwardRef<HTMLDivElement, AdBannerProps>(
  ({ icon: Icon, title, description, cta, variant = "primary", animated: _animated, style, className }, ref) => {
    const isGradient = variant === "primary" || variant === "secondary";

    const containerStyle: React.CSSProperties = {
      width: "100%",
      paddingInline: 16,
      paddingBlock: 14,
      overflow: "hidden",
      ...(isGradient && { background: GRADIENT_COLORS[variant as "primary" | "secondary"] }),
      ...(variant === "outlined" && {
        backgroundColor: colors.background,
        border: `1px solid ${colors.primary}`,
        borderRadius: borderRadius.lg,
      }),
      ...(variant === "ghost" && {
        backgroundColor: "rgba(255,255,255,0.5)",
        borderTop: `1px solid ${colors.borderLight}`,
        borderBottom: `1px solid ${colors.borderLight}`,
      }),
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
            justifyContent: "space-between",
            gap: 12,
            paddingInline: 4,
            paddingBlock: 6,
          }}
        >
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
            {Icon && (
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: borderRadius.lg,
                  backgroundColor: ICON_BG[variant],
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 4,
                }}
              >
                <Icon size={36} color={ICON_COLOR[variant]} strokeWidth={1.75} />
              </div>
            )}
            {title && (
              <p
                style={{
                  fontSize: fontSize.base,
                  fontFamily: fontFamily.sans,
                  fontWeight: 700,
                  color: TEXT_COLOR[variant],
                  margin: 0,
                }}
              >
                {title}
              </p>
            )}
            {description && (
              <p
                style={{
                  fontSize: fontSize.sm,
                  fontFamily: fontFamily.sans,
                  fontWeight: 400,
                  color: TEXT_MUTED[variant],
                  lineHeight: "18px",
                  margin: 0,
                }}
              >
                {description}
              </p>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {cta}
          </div>
        </div>
      </div>
    );
  },
);

AdBanner.displayName = "AdBanner";

export default AdBanner;

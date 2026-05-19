"use client";

import { button as buttonTokens, colors, fontFamily, spacing } from "@/design/tokens";
import type { LucideIcon } from "lucide-react";
import React, { useState } from "react";

type Variant =
  | "primary"
  | "secondary"
  | "secondary_outline"
  | "outline"
  | "ghost"
  | "success"
  | "warning"
  | "error"
  | "filled";

type Size = "sm" | "md" | "lg";

export interface MainButtonProps {
  text: string;
  onPress?: () => void;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  leftIcon?: LucideIcon | React.ReactElement;
  rightIcon?: LucideIcon | React.ReactElement;
  fullWidth?: boolean;
  style?: React.CSSProperties;
  type?: "button" | "submit" | "reset";
  className?: string;
}

const SIZE_MAP = {
  sm: {
    paddingBlock: spacing[2],
    paddingInline: buttonTokens.sm.paddingX,
    fontSize: buttonTokens.sm.fontSize,
    iconSize: buttonTokens.sm.iconSize,
    gap: spacing[1],
    radius: buttonTokens.sm.borderRadius,
    minHeight: buttonTokens.sm.minHeight,
  },
  md: {
    paddingBlock: spacing[3],
    paddingInline: buttonTokens.md.paddingX,
    fontSize: buttonTokens.md.fontSize,
    iconSize: buttonTokens.md.iconSize,
    gap: spacing[2],
    radius: buttonTokens.md.borderRadius,
    minHeight: buttonTokens.md.minHeight,
  },
  lg: {
    paddingBlock: spacing[4],
    paddingInline: buttonTokens.lg.paddingX,
    fontSize: buttonTokens.lg.fontSize,
    iconSize: buttonTokens.lg.iconSize,
    gap: spacing[2],
    radius: buttonTokens.lg.borderRadius,
    minHeight: buttonTokens.lg.minHeight,
  },
} as const;

interface VariantStyle {
  bg: string;
  border: string;
  textColor: string;
  spinnerColor: string;
  iconColor: string;
}

const VARIANT_MAP: Record<Variant, VariantStyle> = {
  primary: { bg: colors.primary, border: colors.primary, textColor: colors.onPrimary, spinnerColor: colors.onPrimary, iconColor: colors.onPrimary },
  filled: { bg: colors.primary, border: colors.primary, textColor: colors.onPrimary, spinnerColor: colors.onPrimary, iconColor: colors.onPrimary },
  secondary: { bg: colors.secondary, border: colors.secondary, textColor: colors.onPrimary, spinnerColor: colors.onPrimary, iconColor: colors.onPrimary },
  secondary_outline: { bg: colors.surface, border: colors.secondary, textColor: colors.secondary, spinnerColor: colors.secondary, iconColor: colors.secondary },
  outline: { bg: colors.surface, border: colors.primary, textColor: colors.primary, spinnerColor: colors.primary, iconColor: colors.primary },
  ghost: { bg: "transparent", border: "transparent", textColor: colors.primary, spinnerColor: colors.primary, iconColor: colors.primary },
  success: { bg: colors.success, border: colors.success, textColor: colors.onPrimary, spinnerColor: colors.onPrimary, iconColor: colors.onPrimary },
  warning: { bg: colors.warning, border: colors.warning, textColor: colors.onPrimary, spinnerColor: colors.onPrimary, iconColor: colors.onPrimary },
  error: { bg: colors.danger, border: colors.danger, textColor: colors.onPrimary, spinnerColor: colors.onPrimary, iconColor: colors.onPrimary },
};

function renderIcon(icon: LucideIcon | React.ReactElement, size: number, color: string): React.ReactNode {
  if (React.isValidElement(icon)) return icon;
  const Icon = icon as LucideIcon;
  return <Icon size={size} color={color} strokeWidth={2} />;
}

const MainButton = React.forwardRef<HTMLButtonElement, MainButtonProps>(
  (
    {
      text,
      onPress,
      onClick,
      variant = "primary",
      size = "md",
      loading = false,
      loadingText,
      disabled = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      style: customStyle,
      type = "button",
      className,
    },
    ref,
  ) => {
    const s = SIZE_MAP[size];
    const v = VARIANT_MAP[variant];
    const isDisabled = disabled || loading;
    const label = loading && loadingText ? loadingText : text;
    const [pressed, setPressed] = useState(false);

    const hasBorder = variant === "outline" || variant === "secondary_outline" || variant === "ghost";

    const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
      onClick?.(e);
      onPress?.();
    };

    const buttonStyle: React.CSSProperties = {
      display: "inline-flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      minWidth: 140,
      paddingBlock: s.paddingBlock,
      paddingInline: s.paddingInline,
      borderRadius: s.radius,
      minHeight: s.minHeight,
      backgroundColor: v.bg,
      borderWidth: hasBorder ? 2 : 0,
      borderStyle: "solid",
      borderColor: v.border,
      opacity: isDisabled ? 0.5 : 1,
      cursor: isDisabled ? "not-allowed" : "pointer",
      transform: pressed && !isDisabled ? "scale(0.96)" : "scale(1)",
      transition: "transform 0.1s ease",
      width: fullWidth ? "100%" : undefined,
      outline: "none",
      userSelect: "none",
      gap: s.gap,
      boxSizing: "border-box",
      ...customStyle,
    };

    return (
      <button
        ref={ref}
        type={type}
        onClick={handleClick}
        disabled={isDisabled}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onMouseLeave={() => setPressed(false)}
        style={buttonStyle}
        className={className}
      >
        <span
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: s.gap,
            opacity: loading ? 0 : 1,
          }}
        >
          {leftIcon && renderIcon(leftIcon, s.iconSize, v.iconColor)}
          <span
            style={{
              fontFamily: fontFamily.sans,
              fontWeight: 700,
              fontSize: s.fontSize,
              color: v.textColor,
              textAlign: "center",
            }}
          >
            {label}
          </span>
          {rightIcon && renderIcon(rightIcon, s.iconSize, v.iconColor)}
        </span>

        {loading && (
          <span
            className="animate-spin"
            style={{
              position: "absolute",
              width: 16,
              height: 16,
              border: `2px solid ${v.spinnerColor}`,
              borderTopColor: "transparent",
              borderRadius: "50%",
            }}
          />
        )}
      </button>
    );
  },
);

MainButton.displayName = "MainButton";

export default MainButton;
export { MainButton };

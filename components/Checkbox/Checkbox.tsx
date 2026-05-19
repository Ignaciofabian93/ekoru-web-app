"use client";

import { colors, fontFamily, fontSize } from "@/design/tokens";
import { Check } from "lucide-react";
import React from "react";

type Variant = "default" | "filled" | "outline";
type Size = "sm" | "md" | "lg";

export interface CheckboxProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  onChange?: (checked: boolean) => void;
  label?: string;
  description?: string;
  errorMessage?: string;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

const SIZE_MAP: Record<Size, { box: number; icon: number; radius: number }> = {
  sm: { box: 18, icon: 12, radius: 4 },
  md: { box: 22, icon: 16, radius: 5 },
  lg: { box: 26, icon: 20, radius: 6 },
};

const VARIANT_IDLE: Record<Variant, { borderColor: string; bg: string }> = {
  default: { borderColor: colors.inputBorder, bg: colors.surface },
  filled: { borderColor: "transparent", bg: colors.backgroundSecondary },
  outline: { borderColor: colors.primary, bg: "transparent" },
};

const Checkbox = React.forwardRef<HTMLDivElement, CheckboxProps>(
  (
    {
      checked = false,
      onCheckedChange,
      onChange,
      label,
      description,
      errorMessage,
      variant = "default",
      size = "md",
      disabled = false,
      style,
      className,
    },
    ref,
  ) => {
    const s = SIZE_MAP[size];
    const idle = VARIANT_IDLE[variant];

    const handlePress = () => {
      if (disabled) return;
      onCheckedChange?.(!checked);
      onChange?.(!checked);
    };

    const hasLabel = label || description;
    const labelColor = errorMessage
      ? colors.danger
      : disabled
        ? colors.foregroundTertiary
        : colors.foreground;

    return (
      <div ref={ref} style={{ display: "flex", flexDirection: "column", gap: 4, ...style }} className={className}>
        <button
          type="button"
          onClick={handlePress}
          disabled={disabled}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            gap: 12,
            background: "none",
            border: "none",
            padding: 0,
            cursor: disabled ? "not-allowed" : "pointer",
            opacity: disabled ? 0.5 : 1,
            textAlign: "left",
          }}
        >
          {/* Box */}
          <div
            style={{
              width: s.box,
              height: s.box,
              borderRadius: s.radius,
              borderWidth: 2,
              borderStyle: "solid",
              borderColor: checked ? colors.primary : idle.borderColor,
              backgroundColor: checked ? colors.primary : idle.bg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              marginTop: 1,
              transition: "background-color 0.15s ease, border-color 0.15s ease",
            }}
          >
            <span style={{ opacity: checked ? 1 : 0, transition: "opacity 0.1s ease" }}>
              <Check size={s.icon} color={colors.onPrimary} strokeWidth={3} />
            </span>
          </div>

          {hasLabel && (
            <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 2 }}>
              {label && (
                <span
                  style={{
                    fontSize: fontSize.sm,
                    fontFamily: fontFamily.sans,
                    fontWeight: 500,
                    color: labelColor,
                  }}
                >
                  {label}
                </span>
              )}
              {description && (
                <span
                  style={{
                    fontSize: fontSize.sm,
                    fontFamily: fontFamily.sans,
                    fontWeight: 400,
                    color: colors.foregroundSecondary,
                    lineHeight: "18px",
                  }}
                >
                  {description}
                </span>
              )}
            </div>
          )}
        </button>

        {errorMessage && (
          <span
            style={{
              paddingLeft: 34,
              fontSize: fontSize.xs,
              fontFamily: fontFamily.sans,
              fontWeight: 400,
              color: colors.danger,
            }}
          >
            {errorMessage}
          </span>
        )}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
export { Checkbox };

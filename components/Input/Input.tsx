"use client";

import {
  borderRadius,
  colors,
  fontFamily,
  fontSize,
  input as inputTokens,
  spacing,
} from "@/design/tokens";
import { Eye, EyeOff, type LucideIcon } from "lucide-react";
import React, { useState } from "react";

type Variant = "default" | "filled" | "outline";
type Size = "sm" | "md" | "lg";
type Width = "sm" | "md" | "lg" | "full";

export interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "size"
> {
  label?: string;
  name?: string;
  leftIcon?: LucideIcon;
  errorMessage?: string;
  size?: Size;
  width?: Width;
  variant?: Variant;
  type?: "text" | "email" | "password" | "number" | "search";
  hasError?: boolean;
  isInvalid?: boolean;
  onChangeText?: (value: string) => void;
}

const SIZE_MAP: Record<
  Size,
  { height: number; fontSize: number; iconSize: number; px: number }
> = {
  sm: {
    height: inputTokens.sm.height,
    fontSize: inputTokens.sm.fontSize,
    iconSize: inputTokens.sm.iconSize,
    px: inputTokens.sm.paddingX,
  },
  md: {
    height: inputTokens.md.height,
    fontSize: inputTokens.md.fontSize,
    iconSize: inputTokens.md.iconSize,
    px: inputTokens.md.paddingX,
  },
  lg: {
    height: inputTokens.lg.height,
    fontSize: inputTokens.lg.fontSize,
    iconSize: inputTokens.lg.iconSize,
    px: inputTokens.lg.paddingX,
  },
};

const WIDTH_MAP: Record<Width, string> = {
  sm: "33%",
  md: "50%",
  lg: "66%",
  full: "100%",
};

interface VariantStyle {
  bg: string;
  borderColor: string;
  borderWidth: number;
  focusedBg: string;
  focusedBorderColor: string;
}

const VARIANT_MAP: Record<Variant, VariantStyle> = {
  default: {
    bg: colors.inputBg,
    borderColor: colors.inputBorder,
    borderWidth: 2,
    focusedBg: colors.inputBg,
    focusedBorderColor: colors.inputBorderFocus,
  },
  filled: {
    bg: colors.backgroundSecondary,
    borderColor: "transparent",
    borderWidth: 2,
    focusedBg: colors.inputBg,
    focusedBorderColor: colors.inputBorderFocus,
  },
  outline: {
    bg: "transparent",
    borderColor: colors.primary,
    borderWidth: 2,
    focusedBg: `${colors.primary}0D`,
    focusedBorderColor: colors.primaryActive,
  },
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      name,
      leftIcon: LeftIcon,
      errorMessage,
      size = "md",
      width = "full",
      variant = "default",
      type = "text",
      hasError,
      isInvalid,
      placeholder,
      maxLength = 50,
      onFocus,
      onBlur,
      onChangeText,
      ...rest
    },
    ref,
  ) => {
    const s = SIZE_MAP[size];
    const v = VARIANT_MAP[variant];
    const showError = hasError || isInvalid;

    const [focused, setFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";
    const resolvedType = isPassword ? (showPassword ? "text" : "password") : type;

    const bg = focused ? v.focusedBg : v.bg;
    const resolvedBorderColor = showError
      ? colors.danger
      : focused
        ? v.focusedBorderColor
        : v.borderColor;
    const iconColor = showError
      ? colors.danger
      : focused
        ? colors.primary
        : colors.foregroundTertiary;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChangeText?.(e.target.value);
    };

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          position: "relative",
          width: WIDTH_MAP[width],
        }}
      >
        {label && (
          <label
            htmlFor={name}
            style={{
              fontSize: fontSize.sm,
              fontFamily: fontFamily.sans,
              fontWeight: 500,
              color: colors.foreground,
            }}
          >
            {label}
          </label>
        )}

        <div
          style={{
            position: "relative",
            height: s.height,
            display: "flex",
            alignItems: "center",
          }}
        >
          {LeftIcon && (
            <div
              style={{
                position: "absolute",
                left: spacing[3],
                zIndex: 1,
                display: "flex",
                pointerEvents: "none",
              }}
            >
              <LeftIcon size={s.iconSize} color={iconColor} strokeWidth={2} />
            </div>
          )}

          <input
            ref={ref}
            id={name}
            name={name}
            type={resolvedType}
            placeholder={placeholder}
            maxLength={maxLength}
            onFocus={(e) => {
              setFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              onBlur?.(e);
            }}
            onChange={handleChange}
            style={{
              width: "100%",
              height: "100%",
              fontSize: s.fontSize,
              paddingInline: s.px,
              paddingLeft: LeftIcon ? s.px + s.iconSize + 8 : s.px,
              paddingRight: isPassword ? s.px + s.iconSize + 8 : s.px,
              backgroundColor: bg,
              borderWidth: v.borderWidth,
              borderStyle: "solid",
              borderColor: resolvedBorderColor,
              borderRadius: borderRadius.md,
              fontFamily: fontFamily.sans,
              fontWeight: 400,
              color: colors.inputText,
              outline: "none",
              transition: "border-color 0.15s ease, background-color 0.15s ease",
              boxSizing: "border-box",
            }}
            {...rest}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              style={{
                position: "absolute",
                right: spacing[3],
                display: "flex",
                alignItems: "center",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "opacity 0.08s ease",
              }}
            >
              {showPassword ? (
                <EyeOff
                  size={s.iconSize}
                  color={colors.foregroundTertiary}
                  strokeWidth={2}
                />
              ) : (
                <Eye
                  size={s.iconSize}
                  color={colors.foregroundTertiary}
                  strokeWidth={2}
                />
              )}
            </button>
          )}
        </div>

        {showError && errorMessage && (
          <span
            style={{
              position: "absolute",
              bottom: -18,
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

Input.displayName = "Input";

export default Input;
export { Input };

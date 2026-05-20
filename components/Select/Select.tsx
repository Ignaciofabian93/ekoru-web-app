"use client";

import {
  borderRadius,
  colors,
  fontFamily,
  fontSize,
  input as inputTokens,
  shadows,
  spacing,
} from "@/design/tokens";
import { Check, ChevronDown, Circle, type LucideIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Text } from "../Text/Text";

export type Option = {
  label: string;
  value: string | number;
  iconColor?: string;
};

type Variant = "default" | "filled" | "outline";
type Size = "sm" | "md" | "lg";
type Width = "sm" | "md" | "lg" | "full";

export interface SelectProps {
  options?: Option[];
  value?: string | number;
  name?: string;
  label?: string;
  placeholder?: string;
  onChange: (value: string | number) => void;
  variant?: Variant;
  size?: Size;
  width?: Width;
  disabled?: boolean;
  readOnly?: boolean;
  leftIcon?: LucideIcon;
  errorMessage?: string;
  showColorIcon?: boolean;
  renderOption?: (option: Option, selected: boolean) => React.ReactNode;
  searchEnabled?: boolean;
  dropdownDirection?: "up" | "down";
  noResultsText?: string;
}

const SIZE_MAP: Record<
  Size,
  { height: number; fontSize: number; px: number; iconSize: number }
> = {
  sm: {
    height: inputTokens.sm.height,
    fontSize: inputTokens.sm.fontSize,
    px: inputTokens.sm.paddingX,
    iconSize: inputTokens.sm.iconSize,
  },
  md: {
    height: inputTokens.md.height,
    fontSize: inputTokens.md.fontSize,
    px: inputTokens.md.paddingX,
    iconSize: inputTokens.md.iconSize,
  },
  lg: {
    height: inputTokens.lg.height,
    fontSize: inputTokens.lg.fontSize,
    px: inputTokens.lg.paddingX,
    iconSize: inputTokens.lg.iconSize,
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
  focusedBorderColor: string;
  errorBorderColor: string;
}

const VARIANT_MAP: Record<Variant, VariantStyle> = {
  default: {
    bg: colors.inputBg,
    borderColor: colors.inputBorder,
    borderWidth: 2,
    focusedBorderColor: colors.inputBorderFocus,
    errorBorderColor: colors.danger,
  },
  filled: {
    bg: colors.backgroundSecondary,
    borderColor: "transparent",
    borderWidth: 2,
    focusedBorderColor: colors.inputBorderFocus,
    errorBorderColor: colors.danger,
  },
  outline: {
    bg: "transparent",
    borderColor: colors.primary,
    borderWidth: 2,
    focusedBorderColor: colors.primaryActive,
    errorBorderColor: colors.danger,
  },
};

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      options = [],
      value,
      name: _name,
      label,
      placeholder = "Select...",
      onChange,
      variant = "default",
      size = "md",
      width = "full",
      disabled = false,
      readOnly = false,
      leftIcon: LeftIcon,
      errorMessage,
      showColorIcon = false,
      renderOption,
      searchEnabled = true,
      dropdownDirection = "down",
      noResultsText = "No results found",
    },
    ref,
  ) => {
    const s = SIZE_MAP[size];
    const v = VARIANT_MAP[variant];
    const hasError = !!errorMessage;

    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);

    const selectedOption = options.find((o) => o.value === value);
    const filteredOptions = options.filter((o) =>
      o.label.toLowerCase().includes(search.toLowerCase()),
    );

    // Close on outside click
    useEffect(() => {
      if (!isOpen) return;
      const handler = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          handleClose();
        }
      };
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, [isOpen]);

    // Focus search on open
    useEffect(() => {
      if (isOpen && searchEnabled) {
        setTimeout(() => searchRef.current?.focus(), 0);
      }
    }, [isOpen, searchEnabled]);

    const handleOpen = () => {
      if (disabled || readOnly) return;
      setIsOpen(true);
    };

    const handleClose = () => {
      setIsOpen(false);
      setSearch("");
    };

    const handleSelect = (optionValue: string | number) => {
      onChange(optionValue);
      handleClose();
    };

    const borderColor = hasError
      ? v.errorBorderColor
      : isOpen
        ? v.focusedBorderColor
        : v.borderColor;

    const renderColorCircle = (option?: Option) => {
      if (!showColorIcon || !option?.iconColor) return null;
      return (
        <Circle
          size={16}
          color={option.iconColor}
          fill={option.iconColor}
          strokeWidth={option.iconColor === "#FFFFFF" ? 1 : 0}
          stroke={option.iconColor === "#FFFFFF" ? "#888" : option.iconColor}
        />
      );
    };

    const dropdownPositionStyle: React.CSSProperties =
      dropdownDirection === "up"
        ? { bottom: "100%", marginBottom: 8 }
        : { top: "100%", marginTop: 8 };

    return (
      <div
        ref={(node) => {
          (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof ref === "function") ref(node);
          else if (ref)
            (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          width: WIDTH_MAP[width],
          position: "relative",
        }}
      >
        {label && (
          <Text
            style={{ fontSize: fontSize.sm, fontWeight: 500, color: colors.foreground }}
          >
            {label}
          </Text>
        )}

        {/* Trigger */}
        <button
          type="button"
          onClick={handleOpen}
          disabled={disabled || readOnly}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            height: s.height,
            paddingInline: s.px,
            backgroundColor: v.bg,
            borderWidth: v.borderWidth,
            borderStyle: "solid",
            borderColor,
            borderRadius: borderRadius.md,
            cursor: disabled || readOnly ? "not-allowed" : "pointer",
            opacity: disabled || readOnly ? 0.5 : 1,
            gap: spacing[2],
            transition: "border-color 0.15s ease",
            outline: "none",
            position: "relative",
            boxSizing: "border-box",
          }}
        >
          {LeftIcon && (
            <span style={{ position: "absolute", left: spacing[3], display: "flex" }}>
              <LeftIcon
                size={s.iconSize}
                color={isOpen ? colors.primary : colors.foregroundTertiary}
                strokeWidth={2}
              />
            </span>
          )}

          <span
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: spacing[2],
              paddingLeft: LeftIcon ? s.iconSize + 8 : 0,
              overflow: "hidden",
            }}
          >
            {renderColorCircle(selectedOption)}
            <span
              style={{
                flex: 1,
                fontFamily: fontFamily.sans,
                fontWeight: 400,
                fontSize: s.fontSize,
                color: selectedOption ? colors.inputText : colors.inputPlaceholder,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                textAlign: "left",
              }}
            >
              {selectedOption?.label ?? placeholder}
            </span>
          </span>

          <span
            style={{
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
              display: "flex",
            }}
          >
            <ChevronDown
              size={s.iconSize}
              color={
                hasError
                  ? colors.danger
                  : isOpen
                    ? colors.primary
                    : colors.foregroundTertiary
              }
              strokeWidth={2}
            />
          </span>
        </button>

        {errorMessage && (
          <span
            style={{
              fontSize: fontSize.xs,
              fontFamily: fontFamily.sans,
              fontWeight: 400,
              color: colors.danger,
            }}
          >
            {errorMessage}
          </span>
        )}

        {/* Dropdown */}
        {isOpen && (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              zIndex: 10,
              backgroundColor: colors.surface,
              borderWidth: 1.5,
              borderStyle: "solid",
              borderColor: colors.borderLight,
              borderRadius: borderRadius.lg,
              overflow: "hidden",
              maxHeight: 320,
              boxShadow: shadows.md,
              display: "flex",
              flexDirection: "column",
              ...dropdownPositionStyle,
            }}
          >
            {searchEnabled && (
              <input
                ref={searchRef}
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  fontFamily: fontFamily.sans,
                  fontWeight: 400,
                  fontSize: fontSize.base,
                  paddingInline: spacing[4],
                  paddingBlock: spacing[2],
                  color: colors.inputText,
                  background: "none",
                  border: "none",
                  borderBottom: `1px solid ${colors.borderLight}`,
                  outline: "none",
                  flexShrink: 0,
                }}
              />
            )}
            <div style={{ overflowY: "auto", maxHeight: 268 }}>
              {filteredOptions.length === 0 ? (
                <span
                  style={{
                    display: "block",
                    paddingInline: spacing[4],
                    paddingBlock: spacing[3],
                    fontSize: fontSize.sm,
                    fontFamily: fontFamily.sans,
                    fontWeight: 400,
                    color: colors.foregroundSecondary,
                    fontStyle: "italic",
                  }}
                >
                  {noResultsText}
                </span>
              ) : (
                filteredOptions.map((item, i) => {
                  const isSelected = item.value === value;
                  return (
                    <button
                      key={String(item.value)}
                      type="button"
                      onClick={() => handleSelect(item.value)}
                      style={{
                        display: "flex",
                        width: "100%",
                        textAlign: "left",
                        background: isSelected ? `${colors.primary}1A` : "none",
                        border: "none",
                        borderBottom:
                          i < filteredOptions.length - 1
                            ? `1px solid ${colors.borderLight}`
                            : "none",
                        cursor: "pointer",
                        padding: 0,
                      }}
                    >
                      {renderOption ? (
                        renderOption(item, isSelected)
                      ) : (
                        <span
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            paddingInline: 16,
                            paddingBlock: 14,
                            gap: 10,
                            flex: 1,
                          }}
                        >
                          {renderColorCircle(item)}
                          <span
                            style={{
                              flex: 1,
                              fontFamily: fontFamily.sans,
                              fontWeight: isSelected ? 600 : 400,
                              color: isSelected ? colors.primary : colors.foreground,
                              fontSize: s.fontSize,
                              lineHeight: "20px",
                            }}
                          >
                            {item.label}
                          </span>
                          {isSelected && (
                            <Check size={16} color={colors.primary} strokeWidth={2.5} />
                          )}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";

export default Select;
export { Select };

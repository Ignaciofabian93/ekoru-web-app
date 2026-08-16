"use client";

import clsx from "clsx";
import { Check } from "lucide-react";
import type React from "react";
import {
  checkboxBoxCheckedClass,
  checkboxBoxClass,
  checkboxControlClass,
  checkboxDescriptionClass,
  checkboxErrorClass,
  checkboxIconSize,
  checkboxLabelClass,
  checkboxLabelGroupClass,
  checkboxLabelToneClass,
  checkboxRootClass,
  checkboxTickClass,
} from "@/design/checkbox";

export type CheckboxVariant = "default" | "filled" | "outline";
export type CheckboxSize = "sm" | "md" | "lg";

export interface CheckboxProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  onChange?: (checked: boolean) => void;
  label?: string;
  description?: string;
  errorMessage?: string;
  variant?: CheckboxVariant;
  size?: CheckboxSize;
  disabled?: boolean;
  style?: React.CSSProperties;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
}

export function Checkbox({
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
  ref,
}: CheckboxProps) {
  const handlePress = () => {
    if (disabled) return;
    onCheckedChange?.(!checked);
    onChange?.(!checked);
  };

  const hasLabel = label || description;
  const labelTone = errorMessage ? "error" : disabled ? "disabled" : "default";

  return (
    <div ref={ref} style={style} className={clsx(checkboxRootClass, className)}>
      <button
        type="button"
        onClick={handlePress}
        disabled={disabled}
        aria-checked={checked}
        role="checkbox"
        className={checkboxControlClass}
      >
        {/* Box */}
        <div
          className={
            checked ? checkboxBoxCheckedClass[size] : checkboxBoxClass[variant][size]
          }
        >
          <span
            className={clsx(checkboxTickClass, checked ? "opacity-100" : "opacity-0")}
          >
            <Check
              size={checkboxIconSize[size]}
              color="currentColor"
              strokeWidth={3}
              aria-hidden
            />
          </span>
        </div>

        {hasLabel && (
          <div className={checkboxLabelGroupClass}>
            {label && (
              <span
                className={clsx(checkboxLabelClass, checkboxLabelToneClass[labelTone])}
              >
                {label}
              </span>
            )}
            {description && (
              <span className={checkboxDescriptionClass}>{description}</span>
            )}
          </div>
        )}
      </button>

      {errorMessage && <span className={checkboxErrorClass}>{errorMessage}</span>}
    </div>
  );
}

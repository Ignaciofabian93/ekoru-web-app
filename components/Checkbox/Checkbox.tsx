"use client";

import clsx from "clsx";
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

const SIZE_CLASS: Record<Size, { box: string; icon: number }> = {
  sm: { box: "size-4.5 rounded-[4px]", icon: 12 },
  md: { box: "size-5.5 rounded-[5px]", icon: 16 },
  lg: { box: "size-6.5 rounded-[6px]", icon: 20 },
};

const VARIANT_IDLE: Record<Variant, string> = {
  default: "border-input-border bg-surface",
  filled: "border-transparent bg-background-secondary",
  outline: "border-primary bg-transparent",
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
    const s = SIZE_CLASS[size];

    const handlePress = () => {
      if (disabled) return;
      onCheckedChange?.(!checked);
      onChange?.(!checked);
    };

    const hasLabel = label || description;

    return (
      <div ref={ref} style={style} className={clsx("flex flex-col gap-1", className)}>
        <button
          type="button"
          onClick={handlePress}
          disabled={disabled}
          className="flex cursor-pointer flex-row items-start gap-3 p-0 text-left disabled:cursor-not-allowed disabled:opacity-50"
        >
          {/* Box */}
          <div
            className={clsx(
              "mt-px flex shrink-0 items-center justify-center border-2 border-solid transition-[background-color,border-color] duration-150",
              s.box,
              checked ? "border-primary bg-primary" : VARIANT_IDLE[variant],
            )}
          >
            <span
              className={clsx(
                "text-on-primary transition-opacity duration-100",
                checked ? "opacity-100" : "opacity-0",
              )}
            >
              <Check size={s.icon} color="currentColor" strokeWidth={3} />
            </span>
          </div>

          {hasLabel && (
            <div className="flex flex-1 flex-col gap-0.5">
              {label && (
                <span
                  className={clsx(
                    "font-sans text-sm font-medium",
                    errorMessage
                      ? "text-danger"
                      : disabled
                        ? "text-foreground-tertiary"
                        : "text-foreground",
                  )}
                >
                  {label}
                </span>
              )}
              {description && (
                <span className="font-sans text-sm font-normal leading-4.5 text-foreground-secondary">
                  {description}
                </span>
              )}
            </div>
          )}
        </button>

        {errorMessage && (
          <span className="pl-8.5 font-sans text-xs font-normal text-danger">
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

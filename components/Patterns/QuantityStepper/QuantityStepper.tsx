"use client";

import clsx from "clsx";
import { Minus, Plus } from "lucide-react";
import type React from "react";
import type {
  ButtonSize,
  ButtonVariant,
} from "@/components/Primitives/Button/Button.types";
import { buttonIconSize } from "@/design/button";
import {
  quantityStepperClass,
  quantityStepperStepClass,
  quantityStepperValueClass,
} from "@/design/quantity-stepper";

export interface QuantityStepperProps {
  value: number;
  /** Upper bound, normally the available stock. `+` disables on reaching it. */
  max: number;
  onChange: (next: number) => void;
  /**
   * Lower bound. Zero by default — where the caller swaps the stepper back for
   * something else at zero, that swap is the "remove" affordance.
   */
  min?: number;
  /** Shares the button scale, so a stepper can stand in for one. */
  size?: ButtonSize;
  variant?: ButtonVariant;
  /** Freezes both controls — a pending write, say. Bounds disable them anyway. */
  disabled?: boolean;
  fullWidth?: boolean;
  /** Accessible name of the group. Pass a translated string. */
  label?: string;
  decreaseLabel?: string;
  increaseLabel?: string;
  className?: string;
  style?: React.CSSProperties;
  ref?: React.Ref<HTMLDivElement>;
}

/**
 * Picks a quantity between `min` and `max`, styled as a button with the count
 * in place of a label. Clamping lives here, so a caller can't be driven out of
 * range by the control.
 */
export function QuantityStepper({
  value,
  max,
  onChange,
  min = 0,
  size = "md",
  variant = "primary",
  disabled = false,
  fullWidth = false,
  label = "Quantity",
  decreaseLabel = "Decrease quantity",
  increaseLabel = "Increase quantity",
  className,
  style,
  ref,
}: QuantityStepperProps) {
  const set = (next: number) => onChange(Math.max(min, Math.min(max, next)));
  const icon = buttonIconSize[size];

  return (
    <div
      ref={ref}
      role="group"
      aria-label={label}
      style={style}
      className={clsx(
        quantityStepperClass[variant][size],
        fullWidth ? "w-full" : "w-fit",
        className,
      )}
    >
      <button
        type="button"
        aria-label={decreaseLabel}
        disabled={disabled || value <= min}
        onClick={() => set(value - 1)}
        className={quantityStepperStepClass[size]}
      >
        <Minus size={icon} color="currentColor" strokeWidth={2.5} aria-hidden />
      </button>

      {/* aria-live so the new count is announced after a press — the buttons
          keep focus, so nothing else would surface the change. */}
      <span aria-live="polite" className={quantityStepperValueClass}>
        {value}
      </span>

      <button
        type="button"
        aria-label={increaseLabel}
        disabled={disabled || value >= max}
        onClick={() => set(value + 1)}
        className={quantityStepperStepClass[size]}
      >
        <Plus size={icon} color="currentColor" strokeWidth={2.5} aria-hidden />
      </button>
    </div>
  );
}

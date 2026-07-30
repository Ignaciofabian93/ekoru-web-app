"use client";

import clsx from "clsx";

export interface ToggleProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
  /** Required unless the switch is labelled by a visible element via `ariaLabelledBy`. */
  ariaLabel?: string;
  ariaLabelledBy?: string;
}

export function Toggle({
  checked,
  onChange,
  disabled,
  ariaLabel,
  ariaLabelledBy,
}: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={clsx(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 transition-colors duration-200",
        "outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        checked ? "border-primary bg-primary" : "border-border-strong bg-background-tertiary",
        disabled && "cursor-not-allowed opacity-50",
      )}
    >
      <span
        className={clsx(
          "inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200",
          checked ? "translate-x-5" : "translate-x-1",
        )}
      />
    </button>
  );
}

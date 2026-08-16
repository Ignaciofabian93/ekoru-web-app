"use client";

import clsx from "clsx";
import {
  toggleDisabledClass,
  toggleThumbClass,
  toggleThumbStateClass,
  toggleTrackClass,
  toggleTrackStateClass,
} from "@/design/toggle";

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
  const state = checked ? "checked" : "unchecked";

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
        toggleTrackClass,
        toggleTrackStateClass[state],
        disabled && toggleDisabledClass,
      )}
    >
      <span className={clsx(toggleThumbClass, toggleThumbStateClass[state])} />
    </button>
  );
}

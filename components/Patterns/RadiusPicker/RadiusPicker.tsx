"use client";
import clsx from "clsx";
import { useId } from "react";

export interface RadiusPickerProps<T extends number> {
  /** The distances on offer, in the order shown. */
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  /** Shown before the chips, and the group's accessible name. */
  label: string;
  /** Each chip's text, e.g. `5 km`. */
  formatOption: (value: T) => string;
}

/**
 * How far a search reaches, as a row of chips. Native radios underneath, so
 * the group is one tab stop and the arrow keys move between distances. Used
 * by home's "near you" row and the recycling map, so both read the same.
 */
export function RadiusPicker<T extends number>({
  options,
  value,
  onChange,
  label,
  formatOption,
}: RadiusPickerProps<T>) {
  const name = useId();

  return (
    <fieldset className="flex min-w-0 flex-wrap items-center gap-2">
      <legend className="sr-only">{label}</legend>
      <span aria-hidden className="mr-1 font-sans text-sm text-foreground-secondary">
        {label}
      </span>
      {options.map((option) => {
        const checked = option === value;
        return (
          <label
            key={option}
            className={clsx(
              "cursor-pointer rounded-full border px-3 py-1 font-sans text-sm",
              "transition-colors duration-150",
              "has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-primary has-[input:focus-visible]:ring-offset-1",
              checked
                ? "border-primary bg-linear-90 from-primary-dark via-primary to-primary-light font-semibold text-on-primary"
                : "border-border-light bg-white text-foreground-secondary hover:bg-background-tertiary",
            )}
          >
            <input
              type="radio"
              name={name}
              value={option}
              checked={checked}
              onChange={() => onChange(option)}
              className="sr-only"
            />
            {formatOption(option)}
          </label>
        );
      })}
    </fieldset>
  );
}

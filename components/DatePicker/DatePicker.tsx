"use client";

import clsx from "clsx";
import { Calendar } from "lucide-react";

function parseDate(str: string): string {
  if (!str) return "";
  return str.split("T")[0];
}

function formatDisplay(str: string): string {
  if (!str) return "";
  const [y, m, d] = str.split("-").map(Number);
  if (!y || !m || !d) return "";
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export interface DatePickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  confirmLabel?: string;
  maximumDate?: Date;
  minimumDate?: Date;
}

export default function DatePicker({
  label,
  value,
  onChange,
  placeholder,
  maximumDate,
  minimumDate,
}: DatePickerProps) {
  const dateValue = parseDate(value);
  const displayValue = formatDisplay(dateValue);

  const maxAttr = maximumDate ? maximumDate.toISOString().split("T")[0] : undefined;
  const minAttr = minimumDate ? minimumDate.toISOString().split("T")[0] : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-sans text-sm font-medium text-foreground">{label}</label>

      <div className="relative flex items-center">
        <div className="pointer-events-none absolute left-3 z-1 flex text-foreground-tertiary">
          <Calendar size={18} color="currentColor" strokeWidth={2} />
        </div>

        {/* Invisible native date input for picker functionality */}
        <input
          type="date"
          value={dateValue}
          onChange={(e) => onChange(e.target.value)}
          min={minAttr}
          max={maxAttr}
          className="absolute inset-0 z-2 w-full cursor-pointer opacity-0"
        />

        {/* Visual display */}
        <div className="box-border flex h-11 w-full cursor-pointer flex-row items-center gap-2 rounded-md border-2 border-solid border-input-border bg-input-bg pr-3 pl-9.5">
          <span
            className={clsx(
              "flex-1 font-sans text-base font-normal",
              displayValue ? "text-input-text" : "text-input-placeholder",
            )}
          >
            {displayValue || placeholder || "Select a date"}
          </span>
        </div>
      </div>
    </div>
  );
}

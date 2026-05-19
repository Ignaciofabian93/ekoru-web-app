"use client";

import { borderRadius, colors, fontFamily, fontSize, spacing } from "@/design/tokens";
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

  const maxAttr = maximumDate
    ? maximumDate.toISOString().split("T")[0]
    : undefined;
  const minAttr = minimumDate
    ? minimumDate.toISOString().split("T")[0]
    : undefined;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label
        style={{
          fontSize: fontSize.sm,
          fontFamily: fontFamily.sans,
          fontWeight: 500,
          color: colors.foreground,
        }}
      >
        {label}
      </label>

      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <div
          style={{
            position: "absolute",
            left: spacing[3],
            display: "flex",
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          <Calendar size={18} color={colors.foregroundTertiary} strokeWidth={2} />
        </div>

        {/* Invisible native date input for picker functionality */}
        <input
          type="date"
          value={dateValue}
          onChange={(e) => onChange(e.target.value)}
          min={minAttr}
          max={maxAttr}
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0,
            cursor: "pointer",
            zIndex: 2,
            width: "100%",
          }}
        />

        {/* Visual display */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            height: 44,
            backgroundColor: colors.inputBg,
            borderWidth: 2,
            borderStyle: "solid",
            borderColor: colors.inputBorder,
            borderRadius: borderRadius.md,
            paddingInline: spacing[3],
            paddingLeft: spacing[3] + 18 + 8,
            gap: spacing[2],
            width: "100%",
            boxSizing: "border-box",
            cursor: "pointer",
          }}
        >
          <span
            style={{
              flex: 1,
              fontSize: fontSize.base,
              fontFamily: fontFamily.sans,
              fontWeight: 400,
              color: displayValue ? colors.inputText : colors.inputPlaceholder,
            }}
          >
            {displayValue || placeholder || "Select a date"}
          </span>
        </div>
      </div>
    </div>
  );
}

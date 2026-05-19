"use client";

import { borderRadius, colors, fontFamily, fontSize, spacing } from "@/design/tokens";
import { useState } from "react";

interface TextAreaProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText?: (text: string) => void;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  maxLength?: number;
  minLength?: number;
  style?: React.CSSProperties;
  rows?: number;
}

export default function TextArea({
  label,
  placeholder,
  value,
  onChangeText,
  onChange,
  maxLength,
  minLength,
  style,
  rows = 4,
}: TextAreaProps) {
  const [focused, setFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChangeText?.(e.target.value);
    onChange?.(e);
  };

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 6 }}>
      {label && (
        <label
          style={{
            fontSize: fontSize.sm,
            fontFamily: fontFamily.sans,
            fontWeight: 500,
            color: colors.foregroundSecondary,
          }}
        >
          {label}
        </label>
      )}
      <textarea
        value={value}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        maxLength={maxLength}
        minLength={minLength}
        placeholder={placeholder}
        rows={rows}
        style={{
          fontFamily: fontFamily.sans,
          fontWeight: 400,
          fontSize: fontSize.base,
          color: colors.foreground,
          backgroundColor: colors.surface,
          borderWidth: 2,
          borderStyle: "solid",
          borderColor: focused ? colors.primary : colors.inputBorder,
          borderRadius: borderRadius.md,
          paddingBlock: spacing[3],
          paddingInline: spacing[4],
          resize: "vertical",
          outline: "none",
          transition: "border-color 0.15s ease",
          ...style,
        }}
      />
    </div>
  );
}

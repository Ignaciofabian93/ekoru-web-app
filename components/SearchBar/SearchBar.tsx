"use client";

import { borderRadius, colors, fontSize, iconSize, spacing } from "@/design/tokens";
import { Search } from "lucide-react";
import { useState } from "react";

interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  style?: React.CSSProperties;
}

export default function SearchBar({
  value: controlledValue,
  onChange,
  placeholder = "Search...",
  style,
}: SearchBarProps) {
  const [internalValue, setInternalValue] = useState("");
  const isControlled = controlledValue !== undefined;
  const query = isControlled ? controlledValue : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setInternalValue(e.target.value);
    onChange?.(e.target.value);
  };

  return (
    <div
      style={{
        backgroundColor: "transparent",
        paddingInline: spacing[4],
        paddingTop: spacing[1],
        paddingBottom: spacing[3],
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: colors.surface,
          borderRadius: borderRadius.md,
          paddingInline: spacing[3],
          height: spacing[10],
          gap: spacing[2],
        }}
      >
        <Search size={iconSize.md} color={colors.inputPlaceholder} strokeWidth={2} />
        <input
          type="search"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          style={{
            flex: 1,
            fontSize: fontSize.base,
            color: colors.foreground,
            background: "none",
            border: "none",
            outline: "none",
            padding: 0,
          }}
        />
      </div>
    </div>
  );
}

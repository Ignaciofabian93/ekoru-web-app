"use client";

import { borderRadius, colors } from "@/design/tokens";
import type { LucideIcon } from "lucide-react";
import { Text } from "../Text/Text";

export default function UploadImageCard({
  onPress,
  title,
  description,
  icon: Icon,
  iconColor,
  disabled = false,
}: {
  onPress: () => void;
  title: string;
  description: string;
  icon: LucideIcon;
  iconStyle?: object;
  iconColor: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onPress}
      disabled={disabled}
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "none",
        border: "none",
        padding: 0,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          backgroundColor: colors.surface,
          borderRadius: borderRadius.xl,
          paddingBlock: 20,
          paddingInline: 12,
          borderWidth: 1.5,
          borderStyle: "solid",
          borderColor: `${iconColor}33`,
          boxShadow: disabled ? "none" : "0 2px 8px rgba(0,0,0,0.08)",
          opacity: disabled ? 0.4 : 1,
          filter: disabled ? "grayscale(100%)" : "none",
          width: "100%",
        }}
      >
        <Icon size={40} color={iconColor} strokeWidth={1.75} />
        <Text size="sm" weight="semibold" align="center">
          {title}
        </Text>
        <Text size="xs" color="secondary" align="center">
          {description}
        </Text>
      </div>
    </button>
  );
}

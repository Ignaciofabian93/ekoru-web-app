import { borderRadius, colors, fontFamily, fontSize } from "@/design/tokens";
import type { LucideIcon } from "lucide-react";
import React from "react";

export default function MenuRow({
  icon: Icon,
  label,
  onPress,
  hasBorder,
}: {
  icon: LucideIcon;
  label: string;
  onPress: () => void;
  hasBorder: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onPress}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        paddingBlock: 13,
        paddingInline: 14,
        gap: 12,
        width: "100%",
        background: "none",
        border: "none",
        borderBottom: hasBorder ? `1px solid ${colors.borderStrong}` : "none",
        cursor: "pointer",
        textAlign: "left",
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: borderRadius.sm,
          backgroundColor: `${colors.primary}18`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={18} strokeWidth={1.5} color={colors.primary} />
      </div>
      <span
        style={{
          fontSize: fontSize.sm,
          fontFamily: fontFamily.sans,
          fontWeight: 500,
          color: colors.foreground,
        }}
      >
        {label}
      </span>
    </button>
  );
}

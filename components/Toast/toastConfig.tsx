import { borderRadius, colors, fontFamily, fontSize, shadows } from "@/design/tokens";
import { AlertCircle, CheckCircle, Info } from "lucide-react";
import React from "react";

export interface ToastProps {
  text1?: string;
  text2?: string;
  type?: "success" | "error" | "info";
  style?: React.CSSProperties;
}

const TOAST_CONFIG = {
  success: { accentColor: colors.success, icon: <CheckCircle size={20} color={colors.success} strokeWidth={2} /> },
  error: { accentColor: colors.danger, icon: <AlertCircle size={20} color={colors.danger} strokeWidth={2} /> },
  info: { accentColor: colors.primary, icon: <Info size={20} color={colors.primary} strokeWidth={2} /> },
};

export function Toast({ text1, text2, type = "info", style }: ToastProps) {
  const config = TOAST_CONFIG[type];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        borderLeft: `4px solid ${config.accentColor}`,
        paddingInline: 14,
        paddingBlock: 12,
        gap: 12,
        boxShadow: shadows.md,
        width: "90%",
        maxWidth: 400,
        boxSizing: "border-box",
        ...style,
      }}
    >
      <span style={{ flexShrink: 0 }}>{config.icon}</span>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        {text1 && (
          <span style={{ fontSize: fontSize.sm, fontFamily: fontFamily.sans, fontWeight: 600, color: colors.foreground }}>
            {text1}
          </span>
        )}
        {text2 && (
          <span style={{ fontSize: fontSize.sm, fontFamily: fontFamily.sans, fontWeight: 400, color: colors.foregroundSecondary }}>
            {text2}
          </span>
        )}
      </div>
    </div>
  );
}

export default Toast;

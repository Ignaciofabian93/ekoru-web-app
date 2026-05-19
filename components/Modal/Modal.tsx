"use client";

import { borderRadius, colors, fontFamily, fontSize, shadows } from "@/design/tokens";
import { X } from "lucide-react";
import React, { useEffect } from "react";
import { createPortal } from "react-dom";

type Size = "sm" | "md" | "lg" | "xl" | "full";

export interface ModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  title?: string;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  size?: Size;
  style?: React.CSSProperties;
}

const SIZE_MAP: Record<Size, string> = {
  sm: "448px",
  md: "512px",
  lg: "672px",
  xl: "896px",
  full: "calc(100% - 32px)",
};

export default function Modal({
  isOpen = false,
  onClose,
  children,
  title,
  showCloseButton = true,
  closeOnOverlayClick = true,
  size = "md",
  style,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        zIndex: 40,
      }}
      onClick={closeOnOverlayClick ? onClose : undefined}
    >
      <div
        style={{
          width: "100%",
          maxWidth: SIZE_MAP[size],
          maxHeight: "90vh",
          backgroundColor: colors.surface,
          borderRadius: borderRadius["2xl"],
          overflow: "hidden",
          boxShadow: shadows.xl,
          display: "flex",
          flexDirection: "column",
          ...style,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || showCloseButton) && (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingInline: 20,
              paddingBlock: 16,
              borderBottom: `1px solid ${colors.borderLight}`,
              gap: 12,
              flexShrink: 0,
            }}
          >
            {title ? (
              <span
                style={{
                  flex: 1,
                  fontSize: fontSize.lg,
                  fontFamily: fontFamily.sans,
                  fontWeight: 600,
                  color: colors.foreground,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {title}
              </span>
            ) : (
              <div />
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                aria-label="Close"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 4,
                  borderRadius: borderRadius.sm,
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                <X size={20} color={colors.foregroundSecondary} strokeWidth={2} />
              </button>
            )}
          </div>
        )}

        <div style={{ overflowY: "auto", padding: 20, flex: 1 }}>{children}</div>
      </div>
    </div>,
    document.body,
  );
}

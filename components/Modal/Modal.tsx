"use client";

import clsx from "clsx";
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

const SIZE_CLASS: Record<Size, string> = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-[calc(100%-32px)]",
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
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/55 p-4"
      onClick={closeOnOverlayClick ? onClose : undefined}
    >
      <div
        style={style}
        className={clsx(
          "flex max-h-[90vh] w-full flex-col overflow-hidden rounded-2xl bg-surface shadow-xl",
          SIZE_CLASS[size],
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || showCloseButton) && (
          <div className="flex shrink-0 flex-row items-center justify-between gap-3 border-b border-border-light px-5 py-4">
            {title ? (
              <span className="flex-1 truncate font-sans text-lg font-semibold text-foreground">
                {title}
              </span>
            ) : (
              <div />
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                aria-label="Close"
                className="flex shrink-0 cursor-pointer items-center justify-center rounded-sm bg-transparent p-1 text-foreground-secondary"
              >
                <X size={20} color="currentColor" strokeWidth={2} />
              </button>
            )}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </div>,
    document.body,
  );
}

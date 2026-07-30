"use client";

import clsx from "clsx";
import { X } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import type { ModalProps, ModalSize } from "./Modal.types";

/** Enter/exit transition length. Keep in sync with the `duration-200` classes. */
const ANIMATION_MS = 200;

const SIZE_CLASS: Record<ModalSize, string> = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-[calc(100%-32px)]",
};

export function Modal({
  isOpen = false,
  onClose,
  children,
  title,
  showCloseButton = true,
  closeLabel = "Close",
  closeOnOverlayClick = true,
  size = "md",
  style,
}: ModalProps) {
  // `mounted` keeps the modal in the tree through the exit animation; `visible`
  // drives the enter/exit transition classes.
  const [mounted, setMounted] = useState(isOpen);
  const [visible, setVisible] = useState(false);
  const titleId = useId();

  // Deliberately synchronizes React state with an external timeline (the CSS
  // transition + timer): mount on open, stay mounted through the exit
  // transition, then unmount. The set-state-in-effect heuristic can't see that
  // external system, so it's disabled for this specific effect.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      return;
    }
    setVisible(false);
    const id = setTimeout(() => setMounted(false), ANIMATION_MS);
    return () => clearTimeout(id);
  }, [isOpen]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Once mounted (after paint), flip to visible on the next frame so the
  // browser has a start frame to transition from.
  useEffect(() => {
    if (!mounted) return;
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mounted]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!mounted || typeof document === "undefined") return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal
      aria-labelledby={title ? titleId : undefined}
      className={clsx(
        "fixed inset-0 z-40 flex items-center justify-center bg-black/55 p-4",
        "transition-opacity duration-200 ease-out motion-reduce:transition-none",
        visible ? "opacity-100" : "opacity-0",
      )}
      onClick={closeOnOverlayClick ? onClose : undefined}
    >
      <div
        style={style}
        className={clsx(
          "flex max-h-[90vh] w-full flex-col overflow-hidden rounded-2xl bg-surface shadow-xl",
          "transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none",
          visible
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-2 scale-95 opacity-0",
          SIZE_CLASS[size],
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || showCloseButton) && (
          <div className="flex shrink-0 flex-row items-center justify-between gap-3 border-b border-border-light px-5 py-4">
            {title ? (
              <span
                id={titleId}
                className="flex-1 truncate font-sans text-lg font-semibold text-foreground"
              >
                {title}
              </span>
            ) : (
              <div />
            )}
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                aria-label={closeLabel}
                className="flex shrink-0 cursor-pointer items-center justify-center rounded-sm bg-transparent p-1 text-foreground-secondary"
              >
                <X size={20} color="currentColor" strokeWidth={2} aria-hidden />
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

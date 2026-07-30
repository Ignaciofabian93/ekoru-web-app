"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface UseDropdownOptions {
  /**
   * Return focus to the trigger when Escape closes the panel, so keyboard users
   * aren't dropped at the top of the document. Requires wiring `triggerRef`.
   */
  restoreFocusOnEscape?: boolean;
  /**
   * Close when focus leaves the container. Covers keyboard users tabbing out —
   * the outside-click listener only covers pointers.
   */
  closeOnFocusOut?: boolean;
}

/**
 * Open/closed state plus the dismissal listeners every dropdown needs:
 * outside pointer-down, Escape, and (optionally) focus leaving the container.
 * Attach `containerRef` to the wrapper and `triggerRef` to the toggle.
 */
export function useDropdown<T extends HTMLElement = HTMLElement>({
  restoreFocusOnEscape = true,
  closeOnFocusOut = true,
}: UseDropdownOptions = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<T>(null);

  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  useEffect(() => {
    if (!isOpen) return;
    const onMouseDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setIsOpen(false);
      if (restoreFocusOnEscape) triggerRef.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, restoreFocusOnEscape]);

  useEffect(() => {
    if (!isOpen || !closeOnFocusOut) return;
    const node = containerRef.current;
    const onFocusOut = (e: FocusEvent) => {
      const next = e.relatedTarget as Node | null;
      if (next && node && !node.contains(next)) setIsOpen(false);
    };
    node?.addEventListener("focusout", onFocusOut);
    return () => node?.removeEventListener("focusout", onFocusOut);
  }, [isOpen, closeOnFocusOut]);

  return {
    isOpen,
    setIsOpen,
    open: () => setIsOpen(true),
    close,
    toggle,
    containerRef,
    triggerRef,
  };
}

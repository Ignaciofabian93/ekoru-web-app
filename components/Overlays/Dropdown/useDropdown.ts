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

  /**
   * Hands focus back to the trigger if it is still inside the panel, before the
   * panel closes.
   *
   * A `keepMounted` panel goes `inert` + `aria-hidden` on close, and hiding a
   * subtree that still holds focus is exactly what the browser refuses to do —
   * it logs "Blocked aria-hidden on an element because its descendant retained
   * focus" and the user is left focused on something no longer exposed. Moving
   * focus first is also what the menu-button pattern asks for: dismissing a menu
   * returns you to the control that opened it.
   */
  const releaseFocus = useCallback(() => {
    if (containerRef.current?.contains(document.activeElement)) {
      triggerRef.current?.focus();
    }
  }, []);

  const close = useCallback(() => {
    releaseFocus();
    setIsOpen(false);
  }, [releaseFocus]);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  useEffect(() => {
    if (!isOpen) return;
    const onMouseDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        // Runs before the browser's own focus handling for this click, so a
        // focusable target still ends up with the focus — the trigger only
        // keeps it when the click landed on something that takes none.
        releaseFocus();
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [isOpen, releaseFocus]);

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

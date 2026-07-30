"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Arrow / Home / End navigation across a menu's items, with Tab dismissing.
 * Register each item via `itemRef(index)`; the first item takes focus when the
 * menu opens so arrow keys land somewhere predictable.
 */
export function useRovingFocus(
  isOpen: boolean,
  itemCount: number,
  onDismiss: () => void,
) {
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) itemRefs.current[0]?.focus();
  }, [isOpen]);

  const focusItem = useCallback(
    (index: number) => {
      if (itemCount === 0) return;
      const next = (index + itemCount) % itemCount;
      itemRefs.current[next]?.focus();
    },
    [itemCount],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          focusItem(index + 1);
          break;
        case "ArrowUp":
          e.preventDefault();
          focusItem(index - 1);
          break;
        case "Home":
          e.preventDefault();
          focusItem(0);
          break;
        case "End":
          e.preventDefault();
          focusItem(itemCount - 1);
          break;
        case "Tab":
          onDismiss();
          break;
      }
    },
    [focusItem, itemCount, onDismiss],
  );

  const itemRef = useCallback(
    (index: number) => (el: HTMLButtonElement | null) => {
      itemRefs.current[index] = el;
    },
    [],
  );

  return { itemRef, handleKeyDown, focusItem };
}

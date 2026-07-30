"use client";

import clsx from "clsx";
import type React from "react";

export type DropdownAlign = "left" | "right";

export interface DropdownPanelProps {
  isOpen: boolean;
  children: React.ReactNode;
  id?: string;
  align?: DropdownAlign;
  /** Tailwind width utility for the panel, e.g. "w-44" or "min-w-62". */
  width?: string;
  /**
   * Keep the panel mounted while collapsed and hide it with `inert` +
   * `aria-hidden` so it animates but stays out of the tab order. Off by
   * default, which unmounts the panel entirely.
   */
  keepMounted?: boolean;
  className?: string;
}

/**
 * The floating surface of a dropdown: positioning, elevation and the
 * open/close transition. Pair with `useDropdown` for the dismissal behavior.
 */
export function DropdownPanel({
  isOpen,
  children,
  id,
  align = "right",
  width = "min-w-44",
  keepMounted = false,
  className,
}: DropdownPanelProps) {
  if (!keepMounted && !isOpen) return null;

  return (
    <div
      id={id}
      inert={keepMounted ? !isOpen : undefined}
      aria-hidden={keepMounted ? !isOpen : undefined}
      className={clsx(
        "absolute top-[calc(100%+6px)] z-49 flex flex-col overflow-hidden rounded-xl",
        "bg-surface shadow-xl ring-1 ring-border-light",
        "transition-all duration-200",
        align === "right" ? "right-0 origin-top-right" : "left-0 origin-top-left",
        width,
        keepMounted &&
          (isOpen
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-2 scale-95 opacity-0"),
        className,
      )}
    >
      {children}
    </div>
  );
}

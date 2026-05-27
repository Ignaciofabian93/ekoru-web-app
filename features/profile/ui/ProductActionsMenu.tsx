"use client";
import clsx from "clsx";
import {
  Eye,
  MoreVertical,
  Pencil,
  PowerOff,
  Power,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export interface ProductMenuAction {
  key: string;
  label: string;
  icon: LucideIcon;
  onSelect: () => void;
  tone?: "default" | "danger";
}

interface ProductActionsMenuProps {
  actions: ProductMenuAction[];
  ariaLabel: string;
}

export function ProductActionsMenu({ actions, ariaLabel }: ProductActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((p) => !p);
        }}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={ariaLabel}
        className="flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-foreground shadow-sm transition-transform hover:scale-105"
      >
        <MoreVertical size={14} color="currentColor" strokeWidth={2} />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-20 mt-1.5 flex w-44 flex-col overflow-hidden rounded-lg border border-border-light bg-surface py-1 shadow-lg"
        >
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.key}
                type="button"
                role="menuitem"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpen(false);
                  action.onSelect();
                }}
                className={clsx(
                  "flex items-center gap-2.5 px-3 py-2 text-left text-sm font-medium transition-colors",
                  action.tone === "danger"
                    ? "text-danger hover:bg-danger/10"
                    : "text-foreground hover:bg-background-secondary",
                )}
              >
                <Icon size={14} color="currentColor" strokeWidth={2} />
                {action.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Re-export the most common icons so call-sites don't need to import them too.
export { Eye, Pencil, Power, PowerOff, Trash2 };

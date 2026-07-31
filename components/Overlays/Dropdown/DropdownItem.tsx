"use client";

import clsx from "clsx";
import type { LucideIcon } from "lucide-react";
import type React from "react";
import { Text } from "@/components/Primitives/Text";

export type DropdownItemTone = "default" | "danger";

export interface DropdownItemProps {
  icon?: LucideIcon | React.ElementType;
  label: string;
  onSelect: () => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLButtonElement>;
  tone?: DropdownItemTone;
  /** Render the icon inside a filled square badge (the account menu style). */
  iconBadge?: boolean;
  /** Trailing count pill (e.g. pending deals). Hidden when 0/undefined. */
  badgeCount?: number;
  hasBorder?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
}

export function DropdownItem({
  icon: Icon,
  label,
  onSelect,
  onKeyDown,
  tone = "default",
  iconBadge = false,
  badgeCount,
  hasBorder = false,
  ref,
}: DropdownItemProps) {
  const isDanger = tone === "danger";

  return (
    <button
      ref={ref}
      type="button"
      role="menuitem"
      onClick={(e) => {
        // Menus often sit on top of a clickable card, so the activation must
        // not bubble into it.
        e.preventDefault();
        e.stopPropagation();
        onSelect();
      }}
      onKeyDown={onKeyDown}
      className={clsx(
        "group flex w-full cursor-pointer items-center gap-2.5 border-none px-3 py-2.5 text-left",
        "transition-colors duration-150 outline-none",
        "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary",
        isDanger && !iconBadge
          ? "text-danger hover:bg-danger/10 focus-visible:bg-danger/10"
          : "text-foreground hover:bg-surface-hover focus-visible:bg-surface-hover",
        hasBorder && "border-b border-border-light",
      )}
    >
      {Icon &&
        (iconBadge ? (
          <span
            aria-hidden
            className={clsx(
              "flex size-8 shrink-0 items-center justify-center rounded-sm text-white",
              isDanger ? "bg-danger/90" : "bg-primary/90",
            )}
          >
            <Icon size={16} strokeWidth={2} />
          </span>
        ) : (
          <Icon size={14} color="currentColor" strokeWidth={2} aria-hidden />
        ))}
      <Text variant="span" size={iconBadge ? "base" : "sm"} weight="medium">
        {label}
      </Text>
      {typeof badgeCount === "number" && badgeCount > 0 && (
        <span className="ml-auto flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-bold text-white">
          {badgeCount > 99 ? "99+" : badgeCount}
        </span>
      )}
    </button>
  );
}

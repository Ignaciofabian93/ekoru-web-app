"use client";

import clsx from "clsx";
import type { LucideIcon } from "lucide-react";
import type React from "react";
import { Text } from "@/components/Primitives/Text";

export type DropdownItemTone = "default" | "danger";

export interface DropdownItemProps {
  icon?: LucideIcon | React.ElementType;
  label: string;
  /**
   * Secondary line under the label — a "coming soon" note, usually. Preferred
   * over a trailing chip here: the panel is narrow, and a chip beside the label
   * would push it into wrapping.
   */
  description?: string;
  onSelect: () => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLButtonElement>;
  tone?: DropdownItemTone;
  /** Trailing count pill (e.g. pending deals). Hidden when 0/undefined. */
  badgeCount?: number;
  /**
   * Inert: dimmed and non-activating. Uses `aria-disabled` rather than the
   * `disabled` attribute on purpose — a disabled button can't take focus, which
   * would break the menu's arrow-key navigation the moment one item is off.
   */
  disabled?: boolean;
  /**
   * Gives the row a standing tinted background instead of only tinting on
   * hover, so it reads as its own block. For the one item in a menu that
   * deserves to stand out — reach for it sparingly, since highlighting several
   * highlights none.
   */
  highlighted?: boolean;
  hasBorder?: boolean;
  className?: string;
  ref?: React.Ref<HTMLButtonElement>;
}

export function DropdownItem({
  icon: Icon,
  label,
  description,
  onSelect,
  onKeyDown,
  tone = "default",
  badgeCount,
  disabled = false,
  highlighted = false,
  hasBorder = false,
  className,
  ref,
}: DropdownItemProps) {
  const isDanger = tone === "danger";

  // Resolved as one string per state rather than layered classes: two
  // conflicting Tailwind utilities in the same list are settled by stylesheet
  // order, not by the order they are written here, so an override would only
  // work by accident.
  const stateClass = disabled
    ? "cursor-not-allowed text-foreground-tertiary opacity-70"
    : isDanger
      ? highlighted
        ? "cursor-pointer bg-danger text-white hover:brightness-125"
        : // White only works against the filled red above it. Unhighlighted, the
          // row sits on the panel's white surface, so the tone has to come from
          // the text itself — it was rendering white on white: invisible, but
          // still hoverable.
          "cursor-pointer text-danger hover:bg-danger/10 focus-visible:bg-danger/10"
      : highlighted
        ? "cursor-pointer bg-primary/10 text-primary hover:bg-primary/15 focus-visible:bg-primary/15"
        : "cursor-pointer text-foreground hover:bg-surface-hover focus-visible:bg-surface-hover";

  return (
    <button
      ref={ref}
      type="button"
      role="menuitem"
      aria-disabled={disabled || undefined}
      onClick={(e) => {
        // Menus often sit on top of a clickable card, so the activation must
        // not bubble into it.
        e.preventDefault();
        e.stopPropagation();
        if (disabled) return;
        onSelect();
      }}
      onKeyDown={onKeyDown}
      className={clsx(
        "group flex w-full items-center gap-2.5 border-none px-3 py-2.5 text-left",
        "transition-colors duration-150 outline-none",
        "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary",
        stateClass,
        hasBorder && "border-b border-border-light",
        className,
      )}
    >
      {Icon && (
        <Icon
          size={14}
          color="currentColor"
          strokeWidth={2}
          aria-hidden
          className="shrink-0"
        />
      )}
      <span className="flex min-w-0 flex-1 flex-col">
        <Text
          variant="span"
          size="sm"
          weight="medium"
          color={isDanger ? (highlighted ? "white" : "error") : "secondary"}
        >
          {label}
        </Text>
        {description && (
          <Text variant="span" size="xs" color="tertiary">
            {description}
          </Text>
        )}
      </span>
      {typeof badgeCount === "number" && badgeCount > 0 && (
        <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-bold text-white">
          {badgeCount > 99 ? "99+" : badgeCount}
        </span>
      )}
    </button>
  );
}

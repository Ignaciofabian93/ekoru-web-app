import clsx from "clsx";
import type { LucideIcon } from "lucide-react";
import React from "react";

export default function MenuRow({
  icon: Icon,
  label,
  onPress,
  hasBorder,
  badgeCount,
  badge,
  disabled,
}: {
  icon: LucideIcon;
  label: string;
  onPress: () => void;
  hasBorder: boolean;
  /** Trailing count pill (e.g. pending deals). Hidden at 0/undefined. */
  badgeCount?: number;
  /** Rendered before the count — e.g. a "Proximamente" chip. */
  badge?: React.ReactNode;
  /** Rows for pages that haven't shipped: visible, but not navigable. */
  disabled?: boolean;
}) {
  const hasTrailing = !!badge || (typeof badgeCount === "number" && badgeCount > 0);

  return (
    <button
      type="button"
      onClick={onPress}
      disabled={disabled}
      className={clsx(
        "flex w-full flex-row items-center gap-3 px-3.5 py-3.25 text-left",
        hasBorder && "border-b border-border-strong",
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
      )}
    >
      <div className="flex size-8 shrink-0 items-center justify-center rounded-sm bg-primary/10 text-primary">
        <Icon size={18} strokeWidth={1.5} color="currentColor" />
      </div>
      <span className="font-sans text-sm font-medium text-foreground">{label}</span>
      {hasTrailing && (
        <div className="ml-auto flex shrink-0 items-center gap-2">
          {badge}
          {typeof badgeCount === "number" && badgeCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-bold text-white">
              {badgeCount > 99 ? "99+" : badgeCount}
            </span>
          )}
        </div>
      )}
    </button>
  );
}

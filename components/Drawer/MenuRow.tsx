import clsx from "clsx";
import type { LucideIcon } from "lucide-react";
import React from "react";

export default function MenuRow({
  icon: Icon,
  label,
  onPress,
  hasBorder,
  badgeCount,
}: {
  icon: LucideIcon;
  label: string;
  onPress: () => void;
  hasBorder: boolean;
  /** Trailing count pill (e.g. pending deals). Hidden at 0/undefined. */
  badgeCount?: number;
}) {
  return (
    <button
      type="button"
      onClick={onPress}
      className={clsx(
        "flex w-full cursor-pointer flex-row items-center gap-3 px-3.5 py-3.25 text-left",
        hasBorder && "border-b border-border-strong",
      )}
    >
      <div className="flex size-8 shrink-0 items-center justify-center rounded-sm bg-primary/10 text-primary">
        <Icon size={18} strokeWidth={1.5} color="currentColor" />
      </div>
      <span className="font-sans text-sm font-medium text-foreground">{label}</span>
      {typeof badgeCount === "number" && badgeCount > 0 && (
        <span className="ml-auto flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-bold text-white">
          {badgeCount > 99 ? "99+" : badgeCount}
        </span>
      )}
    </button>
  );
}

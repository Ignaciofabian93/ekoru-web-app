import clsx from "clsx";
import { ChevronRight, type LucideIcon } from "lucide-react";
import React from "react";
import { Badge } from "@/components/Primitives/Badge";
import { Text } from "@/components/Primitives/Text";
import {
  drawerRowChevronClass,
  drawerRowChevronSize,
  drawerRowClass,
  drawerRowIconClass,
  drawerRowIconSize,
  drawerRowTrailingClass,
} from "@/design/drawer";

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
  const showCount = typeof badgeCount === "number" && badgeCount > 0;

  return (
    <button
      type="button"
      onClick={onPress}
      disabled={disabled}
      className={clsx(
        drawerRowClass,
        hasBorder && "border-b border-border-strong",
        disabled
          ? "cursor-not-allowed opacity-60"
          : "cursor-pointer hover:bg-surface-hover",
      )}
    >
      <span className={drawerRowIconClass}>
        <Icon size={drawerRowIconSize} color="currentColor" strokeWidth={2} />
      </span>

      <Text variant="span" weight="medium" size="base" className="flex-1">
        {label}
      </Text>

      <span className={drawerRowTrailingClass}>
        {badge}
        {showCount && (
          <Badge
            variant="primary"
            size="small"
            label={badgeCount > 99 ? "99+" : badgeCount}
          />
        )}
        {/* A row carrying a coming-soon chip leads nowhere, so it gets no
            chevron — the chip stands in for the affordance. */}
        {!badge && (
          <ChevronRight
            size={drawerRowChevronSize}
            color="currentColor"
            strokeWidth={2}
            aria-hidden
            className={drawerRowChevronClass}
          />
        )}
      </span>
    </button>
  );
}

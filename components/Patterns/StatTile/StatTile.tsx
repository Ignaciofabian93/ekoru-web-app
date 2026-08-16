import clsx from "clsx";
import type { LucideIcon } from "lucide-react";
import { Text } from "@/components/Primitives/Text";
import {
  statTileBodyClass,
  statTileClass,
  statTileDisabledClass,
  statTileIconSize,
  statTileIconStroke,
  statTileTextClass,
} from "@/design/stat-tile";

export type StatTileTone = "neutral" | "primary" | "success" | "info";
export type StatTileOrientation = "vertical" | "horizontal";

export interface StatTileProps {
  icon: LucideIcon;
  /** Already-formatted figure — the caller owns locale formatting. */
  value: string;
  label: string;
  /** `vertical` stacks icon over value; `horizontal` sits the icon beside it. */
  orientation?: StatTileOrientation;
  tone?: StatTileTone;
  /**
   * Greys the tile out — for a figure that isn't live yet, so a placeholder
   * zero doesn't read as a real measurement.
   */
  disabled?: boolean;
  className?: string;
}

/**
 * A single figure with its icon and caption. Backs the profile impact and
 * activity snapshots so the tiles no longer drift apart in padding, radius and
 * icon size.
 */
export function StatTile({
  icon: Icon,
  value,
  label,
  orientation = "vertical",
  tone = "neutral",
  disabled = false,
  className,
}: StatTileProps) {
  return (
    <div
      className={clsx(
        disabled ? statTileDisabledClass[orientation] : statTileClass[tone][orientation],
        className,
      )}
    >
      <Icon
        size={statTileIconSize}
        color="currentColor"
        strokeWidth={statTileIconStroke}
        aria-hidden
      />

      <div className={statTileBodyClass[orientation]}>
        <Text variant="span" size="xl" weight="bold" className={statTileTextClass}>
          {value}
        </Text>
        <Text variant="span" size="xs" className={statTileTextClass}>
          {label}
        </Text>
      </div>
    </div>
  );
}

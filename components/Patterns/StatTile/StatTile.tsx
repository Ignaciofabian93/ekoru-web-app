import clsx from "clsx";
import type { LucideIcon } from "lucide-react";
import { Text } from "@/components/Primitives/Text";

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
 * Tinted glass, in the same recipe `TotalImpact` uses: a translucent
 * top-to-bottom wash of the tone, a hairline border of the same hue, and the
 * figure and its caption both carried in that color. No icon chip — the icon
 * sits bare on the wash.
 *
 * `primary` is `TotalImpact`'s CO₂ card exactly. `success` and `info` have no
 * `-light`/`-dark` steps in the palette, so their wash fades one hue from /10
 * to near-transparent instead of between two.
 */
const TONE_SURFACE: Record<StatTileTone, string> = {
  neutral: "border-border-light text-foreground-secondary",
  primary:
    "border-primary/30 bg-linear-180 from-primary-light/5 to-primary-dark/5 text-primary",
  success:
    "border-success/30 bg-linear-180 from-success/10 to-success/[0.02] text-success",
  info: "border-info/30 bg-linear-180 from-info/10 to-info/[0.02] text-info",
};

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
  const isHorizontal = orientation === "horizontal";

  return (
    <div
      className={clsx(
        "flex rounded-2xl border p-4 shadow-sm shadow-slate-800/10",
        isHorizontal ? "w-full items-center gap-4" : "flex-col items-center gap-1.5",
        "hover:brightness-120 transition-all duration-300 ease-in-out",
        // The tone tints border, wash and text together, so a disabled tile
        // drops it for a flat grey rather than a washed-out version of the
        // live color.
        disabled
          ? "border-border-light bg-background-secondary/60 text-foreground-muted opacity-60"
          : TONE_SURFACE[tone],
        className,
      )}
    >
      <Icon size={22} color="currentColor" strokeWidth={1.6} aria-hidden />

      <div
        className={clsx(
          "flex flex-col",
          isHorizontal ? "min-w-0 gap-1" : "items-center gap-1.5",
        )}
      >
        <Text variant="span" size="xl" weight="bold" className="text-current">
          {value}
        </Text>
        <Text variant="span" size="xs" className="text-current">
          {label}
        </Text>
      </div>
    </div>
  );
}

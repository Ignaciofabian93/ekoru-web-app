import clsx from "clsx";
import type { LucideIcon } from "lucide-react";
import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";

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
  className?: string;
}

const TONE_SURFACE: Record<StatTileTone, string> = {
  neutral: "bg-background-secondary/60 text-primary",
  primary: "bg-linear-to-br from-primary/15 to-primary-light/10 text-primary",
  success: "bg-linear-to-br from-success/15 to-success/5 text-success",
  info: "bg-linear-to-br from-info/15 to-info/5 text-info",
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
  className,
}: StatTileProps) {
  const isHorizontal = orientation === "horizontal";

  return (
    <div
      className={clsx(
        "flex rounded-xl p-3.5",
        isHorizontal ? "w-full items-center gap-4" : "flex-col gap-1.5",
        TONE_SURFACE[tone],
        className,
      )}
    >
      <div
        className={clsx(
          "flex shrink-0 items-center justify-center rounded-md text-current",
          isHorizontal ? "size-10 bg-white/70" : "size-8 bg-surface",
        )}
      >
        <Icon
          size={isHorizontal ? 22 : 16}
          color="currentColor"
          strokeWidth={2}
          aria-hidden
        />
      </div>

      <div className={clsx("flex flex-col", isHorizontal && "min-w-0")}>
        <Title level="h3" size={isHorizontal ? "h6" : "h5"} weight="bold" color="default">
          {value}
        </Title>
        <Text variant="span" size="xs" color={isHorizontal ? "secondary" : "tertiary"}>
          {label}
        </Text>
      </div>
    </div>
  );
}

/**
 *
 * Usage:  className={statTileClass[tone][orientation]}
 * ─────────────────────────────────────────────────────────────────
 */

import clsx from "clsx";
import type {
  StatTileOrientation,
  StatTileTone,
} from "@/components/Patterns/StatTile/StatTile";
import { cross, crossState } from "@/design/variants";

const statTileBaseClass = clsx(
  "flex rounded-2xl border p-4 shadow-sm shadow-slate-800/10",
  "hover:brightness-120 transition-all duration-300 ease-in-out",
);

const statTileOrientationClass: Record<StatTileOrientation, string> = {
  vertical: "flex-col items-center gap-1.5",
  horizontal: "w-full items-center gap-4",
};

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
const statTileToneClass: Record<StatTileTone, string> = {
  neutral: "border-border-light text-foreground-secondary",
  primary:
    "border-primary/30 bg-linear-180 from-primary-light/5 to-primary-dark/5 text-primary",
  success:
    "border-success/30 bg-linear-180 from-success/10 to-success/[0.02] text-success",
  info: "border-info/30 bg-linear-180 from-info/10 to-info/[0.02] text-info",
};

/** Tile for every tone × orientation pair: `statTileClass[tone][orientation]`. */
export const statTileClass = cross(
  statTileBaseClass,
  statTileToneClass,
  statTileOrientationClass,
);

/**
 * The tone tints border, wash and text together, so a disabled tile drops it
 * for a flat grey rather than a washed-out version of the live color — which
 * means it replaces the tone rather than layering over it.
 */
export const statTileDisabledClass = crossState(
  statTileBaseClass,
  "border-border-light bg-background-secondary/60 text-foreground-muted opacity-60",
  statTileOrientationClass,
);

export const statTileBodyClass: Record<StatTileOrientation, string> = {
  vertical: "flex flex-col items-center gap-1.5",
  horizontal: "flex flex-col min-w-0 gap-1",
};

export const statTileTextClass = "text-current";

export const statTileIconSize = 22;

export const statTileIconStroke = 1.6;

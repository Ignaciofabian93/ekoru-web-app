/**
 *
 * Usage:  className={totalImpactClass[type]}          — the standalone tile
 *         className={impactTileClass[type][density]}  — the same surface, tighter
 * ─────────────────────────────────────────────────────────────────
 */

import clsx from "clsx";
import type { TotalImpactType } from "@/components/Patterns/TotalImpact/TotalImpact";
import { cross, single } from "@/design/variants";

/**
 * The surface an impact figure sits on: tint and border per type. Every place
 * that reports a saving draws from this one map — the standalone tile, the
 * card's back face and the impact modal — so the three read as one family
 * rather than three hand-copied gradients.
 */
const impactSurfaceClass: Record<TotalImpactType, string> = {
  co2: clsx("border-primary/30", "bg-linear-180 from-primary-light/5 to-primary-dark/5"),
  water: clsx(
    "border-secondary-dark/30",
    "bg-linear-180 from-secondary-light/5 to-secondary-dark/5",
  ),
  waste: clsx("border-gray-300", "bg-gray-100"),
};

/** How much room the tile has: `sm` fits a card's back face, `lg` a page panel. */
export type ImpactDensity = "sm" | "md" | "lg";

const impactTileBaseClass = "flex flex-col border";

const impactTileDensityClass: Record<ImpactDensity, string> = {
  sm: "gap-0.5 rounded-md p-1.5",
  md: "gap-1 rounded-lg p-3.5",
  lg: "gap-1.5 rounded-2xl p-4",
};

/** Impact surface at a given density: `impactTileClass[type][density]`. */
export const impactTileClass = cross(
  impactTileBaseClass,
  impactSurfaceClass,
  impactTileDensityClass,
);

/**
 * The standalone pattern tile: a centered stack at the roomiest density, and
 * the only one carrying a shadow — it stands on the page, while the others sit
 * inside a card or a modal that already has one.
 */
export const totalImpactClass = single(
  clsx(
    impactTileBaseClass,
    impactTileDensityClass.lg,
    "items-center",
    "shadow-sm shadow-slate-800/10",
  ),
  impactSurfaceClass,
);

/**
 * Icon and text all carry the type's hue, on every surface above.
 *
 * Applied through `className` on `Text`, which always emits a color of its
 * own — these win because Tailwind sorts color utilities alphabetically and
 * each of them sorts after `text-foreground*`. Check that ordering before
 * swapping in a hue that doesn't (`text-danger`, say).
 */
export const impactToneClass: Record<TotalImpactType, string> = {
  co2: "text-primary",
  water: "text-secondary-dark",
  waste: "text-gray-700",
};

export const impactIconSize: Record<ImpactDensity, number> = {
  sm: 14,
  md: 18,
  lg: 22,
};

export const impactIconStroke = 1.6;

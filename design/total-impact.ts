/**
 *
 * Usage:  className={totalImpactClass[type]}
 * ─────────────────────────────────────────────────────────────────
 */

import clsx from "clsx";
import type { TotalImpactType } from "@/components/Patterns/TotalImpact/TotalImpact";
import { single } from "@/design/variants";

const totalImpactBaseClass = clsx(
  "flex flex-col items-center gap-1.5",
  "rounded-2xl p-4 border",
  "shadow-sm shadow-slate-800/10",
);

const totalImpactVariantClass: Record<TotalImpactType, string> = {
  co2: clsx("border-primary/30", "bg-linear-180 from-primary-light/5 to-primary-dark/5"),
  water: clsx(
    "border-secondary-dark/30",
    "bg-linear-180 from-secondary-light/5 to-secondary-dark/5",
  ),
  waste: clsx("border-gray-300", "bg-gray-100"),
};

/** Card for each impact type: `totalImpactClass[type]`. */
export const totalImpactClass = single(totalImpactBaseClass, totalImpactVariantClass);

/** Icon and both text lines all carry the type's hue. */
export const totalImpactToneClass: Record<TotalImpactType, string> = {
  co2: "text-primary",
  water: "text-secondary-dark",
  waste: "text-gray-700",
};

export const totalImpactIconSize = 22;

export const totalImpactIconStroke = 1.6;

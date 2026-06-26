import type { MaterialImpactBreakdown } from "@/types/product";

/**
 * Render-ready name for a material. Prefers the backend-provided localized
 * `materialTypeLabel`; falls back to a humanized form of the raw enum key
 * (e.g. "ELECTRONIC_COMPONENTS" → "Electronic components") so the UI never
 * shows SCREAMING_SNAKE_CASE even if the subgraph hasn't been redeployed.
 */
export function materialLabel(material: MaterialImpactBreakdown): string {
  if (material.materialTypeLabel) return material.materialTypeLabel;
  const normalized = material.materialType.replace(/_/g, " ").trim().toLowerCase();
  if (!normalized) return material.materialType;
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

/**
 * Share of the composition this material represents, as a 0–100 number.
 * When the API reports the amount as a percentage we use it directly; for
 * absolute units (kg, etc.) we derive the share from the summed quantities so
 * progress bars stay meaningful.
 */
export function materialPercentage(
  material: MaterialImpactBreakdown,
  all: MaterialImpactBreakdown[],
): number {
  if (material.unit === "percentage") {
    return clampPercent(material.quantity);
  }
  const total = all.reduce((sum, m) => sum + (m.quantity || 0), 0);
  if (total <= 0) return 0;
  return clampPercent((material.quantity / total) * 100);
}

/**
 * Human-readable amount for a material: "50%" for percentage units, otherwise
 * the quantity plus its unit (e.g. "2.5 kg").
 */
export function formatMaterialAmount(material: MaterialImpactBreakdown): string {
  if (material.unit === "percentage") {
    return `${formatNumber(material.quantity)}%`;
  }
  return `${formatNumber(material.quantity)} ${material.unit}`;
}

function clampPercent(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.min(100, Math.max(0, value));
}

function formatNumber(num: number): string {
  // Drop the trailing ".0" for whole numbers, keep one decimal otherwise.
  return Number.isInteger(num)
    ? String(num)
    : num.toLocaleString("es-CL", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      });
}

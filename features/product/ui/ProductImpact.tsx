"use client";

import { Droplets, Leaf } from "lucide-react";

import { useTranslation } from "@/i18n/context";
import type { EnvironmentalImpact } from "@/types/product";
import { formatMaterialAmount, materialLabel } from "@/utils/impact";

import { NAMESPACE } from "../i18n";

export function ProductImpact({
  impact,
}: {
  impact?: EnvironmentalImpact | null;
}) {
  const { t } = useTranslation(NAMESPACE);

  if (!impact) return null;

  const hasSavings =
    impact.totalCo2SavingsKG > 0 || impact.totalWaterSavingsLT > 0;

  if (!hasSavings && impact.materialBreakdown.length === 0) return null;

  return (
    <section>
      <h2 className="text-lg font-semibold text-foreground">
        {t("impact.title")}
      </h2>
      <p className="mt-1 mb-3 text-sm text-foreground-secondary">
        {t("impact.subtitle")}
      </p>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col items-center gap-1.5 rounded-2xl border border-border-light bg-background-secondary p-4">
          <Leaf size={22} className="text-primary" strokeWidth={1.6} />
          <span className="text-2xl font-bold text-foreground">
            {impact.totalCo2SavingsKG.toFixed(1)} {t("impact.kg")}
          </span>
          <span className="text-center text-xs text-foreground-secondary">
            {t("impact.co2")}
          </span>
        </div>
        <div className="flex flex-col items-center gap-1.5 rounded-2xl border border-border-light bg-background-secondary p-4">
          <Droplets size={22} className="text-secondary" strokeWidth={1.6} />
          <span className="text-2xl font-bold text-foreground">
            {impact.totalWaterSavingsLT.toFixed(1)} {t("impact.liters")}
          </span>
          <span className="text-center text-xs text-foreground-secondary">
            {t("impact.water")}
          </span>
        </div>
      </div>

      {impact.materialBreakdown.length > 0 && (
        <div className="mt-4">
          <h3 className="mb-2 text-sm font-semibold text-foreground-secondary">
            {t("impact.materials")}
          </h3>
          <ul className="bg-surface flex flex-col divide-y divide-border-light overflow-hidden rounded-2xl border border-border-light">
            {impact.materialBreakdown.map((m) => (
              <li
                key={m.materialType}
                className="flex items-center justify-between gap-3 px-4 py-2.5"
              >
                <span className="text-sm text-foreground">{materialLabel(m)}</span>
                <span className="text-sm font-medium text-foreground-secondary">
                  {formatMaterialAmount(m)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

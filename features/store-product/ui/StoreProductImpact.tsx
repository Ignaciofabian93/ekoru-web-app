"use client";
import clsx from "clsx";
import { Leaf } from "lucide-react";
import { useTranslation } from "@/i18n/context";
import type { EnvironmentalImpact } from "@/types/product";
import { formatMaterialAmount, materialLabel } from "@/utils/impact";
import { NAMESPACE } from "../i18n";
import { Title } from "@/components/Primitives/Title";
import { Text } from "@/components/Primitives/Text";
import { DataList, TotalImpact } from "@/components/Patterns";

/**
 * The full-width band under the two rails, in the marketplace listing's shape:
 * impact is what separates Ekoru from any other product page, so it gets the
 * whole width and its own surface — and the savings sit beside the material
 * breakdown that explains them, instead of above it.
 */
export function StoreProductImpact({ impact }: { impact?: EnvironmentalImpact | null }) {
  const { t } = useTranslation(NAMESPACE);

  if (!impact) return null;

  const hasSavings = impact.totalCo2SavingsKG > 0 || impact.totalWaterSavingsLT > 0;
  const materials = impact.materialBreakdown;

  if (!hasSavings && materials.length === 0) return null;

  // With no breakdown to sit beside, the two figures split the band rather than
  // huddling in its left third.
  const tileSpan = materials.length > 0 ? "md:col-span-3" : "md:col-span-6";

  return (
    <div
      className={clsx(
        "rounded-2xl p-4 bg-white shadow-md shadow-slate-800/10 border border-slate-200",
      )}
    >
      <div className="mb-5 flex items-center gap-3">
        <span
          className={clsx(
            "flex size-10 shrink-0 items-center justify-center rounded-xl",
            "border border-primary/30 bg-linear-120 from-primary-light/30 to-primary-light/10 text-primary",
          )}
        >
          <Leaf size={20} strokeWidth={2} aria-hidden />
        </span>
        <div className="flex flex-col">
          <Title level="h2" size="h5" weight="semibold">
            {t("impact.title")}
          </Title>
          <Text variant="span" size="sm" color="secondary">
            {t("impact.subtitle")}
          </Text>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        <div className={tileSpan}>
          <TotalImpact
            type="co2"
            totalValue={Number(impact.totalCo2SavingsKG.toFixed(1))}
            unit={t("impact.kg")}
            label={t("impact.co2")}
          />
        </div>
        <div className={tileSpan}>
          <TotalImpact
            type="water"
            totalValue={Number(impact.totalWaterSavingsLT.toFixed(1))}
            unit={t("impact.liters")}
            label={t("impact.water")}
          />
        </div>

        {materials.length > 0 && (
          <div className="md:col-span-6">
            <DataList
              className="h-full"
              caption={t("impact.materials")}
              rows={materials.map((m) => ({
                label: materialLabel(m),
                value: formatMaterialAmount(m),
              }))}
            />
          </div>
        )}
      </div>
    </div>
  );
}

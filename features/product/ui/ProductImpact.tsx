"use client";
import { useTranslation } from "@/i18n/context";
import type { EnvironmentalImpact } from "@/types/product";
import { formatMaterialAmount, materialLabel } from "@/utils/impact";
import { NAMESPACE } from "../i18n";
import { Title } from "@/components/Primitives/Title";
import { Text } from "@/components/Primitives/Text";
import clsx from "clsx";
import { TotalImpact } from "@/components/Patterns";

export function ProductImpact({ impact }: { impact?: EnvironmentalImpact | null }) {
  const { t } = useTranslation(NAMESPACE);

  if (!impact) return null;

  const hasSavings = impact.totalCo2SavingsKG > 0 || impact.totalWaterSavingsLT > 0;

  if (!hasSavings && impact.materialBreakdown.length === 0) return null;

  return (
    <div className="px-2">
      <Title level="h5" size="h5" weight="semibold" className="mb-2">
        {t("impact.title")}
      </Title>
      <Text variant="p" size="sm">
        {t("impact.subtitle")}
      </Text>

      <div className="grid grid-cols-2 gap-3 my-3">
        <TotalImpact
          type="co2"
          totalValue={Number(impact.totalCo2SavingsKG.toFixed(1))}
          unit={t("impact.kg")}
          label={t("impact.co2")}
        />
        <TotalImpact
          type="water"
          totalValue={Number(impact.totalWaterSavingsLT.toFixed(1))}
          unit={t("impact.liters")}
          label={t("impact.water")}
        />
      </div>

      {impact.materialBreakdown.length > 0 && (
        <div className="mt-6">
          <Title level="h6" size="h6" weight="semibold" className="mb-3">
            {t("impact.materials")}
          </Title>
          <ul
            className={clsx(
              "bg-white flex flex-col divide-y divide-border-light",
              "overflow-hidden rounded-2xl",
            )}
          >
            {impact.materialBreakdown.map((m) => (
              <li
                key={m.materialType}
                className="flex items-center justify-between gap-3 px-4 py-2.5"
              >
                <Text variant="span" size="sm">
                  {materialLabel(m)}
                </Text>
                <Text variant="span" size="sm" weight="semibold">
                  {formatMaterialAmount(m)}
                </Text>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

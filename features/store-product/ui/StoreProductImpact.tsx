"use client";
import { Droplets, Leaf } from "lucide-react";
import { useTranslation } from "@/i18n/context";
import type { EnvironmentalImpact } from "@/types/product";
import { formatMaterialAmount, materialLabel } from "@/utils/impact";
import { NAMESPACE } from "../i18n";
import { Title } from "@/components/Title/Title";
import { Text } from "@/components/Text/Text";
import clsx from "clsx";

export function StoreProductImpact({ impact }: { impact?: EnvironmentalImpact | null }) {
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
        <div className="flex flex-col items-center gap-1.5 rounded-2xl border border-primary/30 bg-primary/10 p-4">
          <Leaf size={22} className="text-primary" strokeWidth={1.6} />
          <Text variant="span" size="2xl" weight="bold">
            {impact.totalCo2SavingsKG.toFixed(1)} {t("impact.kg")}
          </Text>
          <Text variant="span" size="xs">
            {t("impact.co2")}
          </Text>
        </div>
        <div className="flex flex-col items-center gap-1.5 rounded-2xl border border-secondary/30 bg-secondary/10 p-4">
          <Droplets size={22} className="text-secondary" strokeWidth={1.6} />
          <Text variant="span" size="2xl" weight="bold">
            {impact.totalWaterSavingsLT.toFixed(1)} {t("impact.liters")}
          </Text>
          <Text variant="span" size="xs">
            {t("impact.water")}
          </Text>
        </div>
      </div>

      {impact.materialBreakdown.length > 0 && (
        <div className="mt-6">
          <Title level="h6" size="h6" weight="semibold" className="mb-3">
            {t("impact.materials")}
          </Title>
          <ul
            className={clsx(
              "bg-white flex flex-col divide-y divide-border-light",
              "overflow-hidden rounded-2xl border border-border-light",
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

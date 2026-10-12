"use client";
import clsx from "clsx";
import { Layers } from "lucide-react";

import { DataList } from "@/components/Patterns";
import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";
import { useTranslation } from "@/i18n/context";
import type { StoreProductMaterialComposition } from "@/types/product";

import { NAMESPACE } from "../i18n";

/**
 * What the product is made of: each declared material and its share (STO-4,
 * decision D3). A store product is new, so it shows its materials and never a
 * "you saved" figure; savings belong to second-hand items, whose reuse earns
 * them. Largest share first. Renders nothing when no composition is declared.
 */
export function StoreProductMaterials({
  materials,
}: {
  materials?: StoreProductMaterialComposition[] | null;
}) {
  const { t } = useTranslation(NAMESPACE);
  const rows = [...(materials ?? [])]
    .sort((a, b) => b.percentage - a.percentage)
    .map((m) => ({ label: m.label, value: `${Number(m.percentage.toFixed(1))}%` }));

  if (rows.length === 0) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-md shadow-slate-800/10">
      <div className="mb-4 flex items-center gap-3">
        <span
          className={clsx(
            "flex size-10 shrink-0 items-center justify-center rounded-xl",
            "border border-primary/30 bg-linear-120 from-primary-light/30 to-primary-light/10 text-primary",
          )}
        >
          <Layers size={20} strokeWidth={2} aria-hidden />
        </span>
        <div className="flex flex-col">
          <Title level="h2" size="h5" weight="semibold">
            {t("materials.title")}
          </Title>
          <Text variant="span" size="sm" color="secondary">
            {t("materials.subtitle")}
          </Text>
        </div>
      </div>
      <DataList caption={t("materials.caption")} rows={rows} />
    </div>
  );
}

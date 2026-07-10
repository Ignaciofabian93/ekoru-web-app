"use client";

import { Package } from "lucide-react";
import { useMemo, useState } from "react";

import { Text } from "@/components/Text/Text";
import { Title } from "@/components/Title/Title";
import { StoreProductCard } from "@/features/stores/ui/StoreProductCard";
import { useTranslation } from "@/i18n/context";

import { NAMESPACE } from "../i18n";
import type { StoreCategoryGroup } from "../types";
import { SellerCategoriesNav } from "./SellerCategoriesNav";

interface Props {
  lang: string;
  categories: StoreCategoryGroup[];
  totalCount: number;
  loading?: boolean;
}

export function SellerStoreCatalog({ lang, categories, totalCount, loading }: Props) {
  const { t } = useTranslation(NAMESPACE);
  const [active, setActive] = useState("all");

  const visible = useMemo<StoreCategoryGroup[]>(
    () => (active === "all" ? categories : categories.filter((c) => c.id === active)),
    [active, categories],
  );

  return (
    <section className="flex min-w-0 flex-col gap-5">
      <div className="min-w-0">
        <h2 className="text-lg font-semibold text-foreground sm:text-xl">
          {t("storeCatalog.title")}
        </h2>
        <p className="text-sm text-foreground-secondary">{t("storeCatalog.subtitle")}</p>
      </div>

      <SellerCategoriesNav
        categories={categories}
        active={active}
        onChange={setActive}
        totalCount={totalCount}
      />

      {loading && categories.length === 0 ? (
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-background-secondary aspect-3/4 animate-pulse rounded-xl"
            />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="text-foreground-secondary flex flex-col items-center gap-2 py-16 text-center">
          <Package size={44} className="opacity-30" strokeWidth={1.4} />
          <p className="font-semibold">{t("storeCatalog.empty")}</p>
          <p className="text-sm">{t("storeCatalog.emptyHint")}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6 md:gap-8">
          {visible.map((group) => {
            const countLabel =
              group.products.length === 1
                ? t("catalog.categoryCount", { count: "1" })
                : t("catalog.categoryCountPlural", {
                    count: String(group.products.length),
                  });
            return (
              <section key={group.id} className="scroll-mt-24">
                <div className="mb-3 flex items-baseline justify-between gap-2">
                  <Title level="h3" size="h6">
                    {group.name}
                  </Title>
                  <Text variant="span" size="xs" weight="semibold">
                    {countLabel}
                  </Text>
                </div>
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3">
                  {group.products.map((product) => (
                    <StoreProductCard key={product.id} product={product} lang={lang} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </section>
  );
}

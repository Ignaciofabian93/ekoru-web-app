"use client";

import { Package } from "lucide-react";
import { useMemo, useState } from "react";

import { useTranslation } from "@/i18n/context";

import { NAMESPACE } from "../i18n";
import type { CategoryGroup } from "../types";
import { SellerCategoriesNav } from "./SellerCategoriesNav";
import { SellerCategorySection } from "./SellerCategorySection";

interface Props {
  lang: string;
  categories: CategoryGroup[];
  totalCount: number;
  loading?: boolean;
}

export function SellerCatalog({
  lang,
  categories,
  totalCount,
  loading,
}: Props) {
  const { t } = useTranslation(NAMESPACE);
  const [active, setActive] = useState("all");

  const visible = useMemo<CategoryGroup[]>(
    () =>
      active === "all" ? categories : categories.filter((c) => c.id === active),
    [active, categories],
  );

  return (
    <section className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-semibold text-foreground">
          {t("catalog.title")}
        </h2>
        <p className="text-sm text-foreground-secondary">
          {t("catalog.subtitle")}
        </p>
      </div>

      <SellerCategoriesNav
        categories={categories}
        active={active}
        onChange={setActive}
        totalCount={totalCount}
      />

      {loading && categories.length === 0 ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-background-secondary aspect-3/4 animate-pulse rounded-xl"
            />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="text-foreground-secondary flex flex-col items-center gap-2 py-16 text-center">
          <Package size={44} className="opacity-30" strokeWidth={1.4} />
          <p className="font-semibold">{t("catalog.empty")}</p>
          <p className="text-sm">{t("catalog.emptyHint")}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {visible.map((group) => (
            <SellerCategorySection key={group.id} lang={lang} group={group} />
          ))}
        </div>
      )}
    </section>
  );
}

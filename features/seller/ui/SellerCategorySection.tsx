"use client";

import { useTranslation } from "@/i18n/context";

import { NAMESPACE } from "../i18n";
import type { CategoryGroup } from "../types";
import { SellerProductCard } from "./SellerProductCard";

interface Props {
  lang: string;
  group: CategoryGroup;
  id?: string;
}

export function SellerCategorySection({ lang, group, id }: Props) {
  const { t } = useTranslation(NAMESPACE);

  const countLabel =
    group.products.length === 1
      ? t("catalog.categoryCount", { count: "1" })
      : t("catalog.categoryCountPlural", {
          count: String(group.products.length),
        });

  return (
    <section id={id} className="scroll-mt-24">
      <div className="mb-3 flex items-baseline justify-between gap-2">
        <h3 className="min-w-0 flex-1 truncate text-base font-semibold text-foreground md:text-lg">
          {group.name}
        </h3>
        <span className="shrink-0 text-xs font-medium whitespace-nowrap text-foreground-tertiary">
          {countLabel}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3 lg:grid-cols-4">
        {group.products.map((product) => (
          <SellerProductCard key={product.id} product={product} lang={lang} />
        ))}
      </div>
    </section>
  );
}

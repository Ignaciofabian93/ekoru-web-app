"use client";

import { useTranslation } from "@/i18n/context";
import { NAMESPACE } from "../i18n";
import type { CategoryGroup } from "../types";
import MarketplaceCard from "@/components/Card/MarketplaceCard/MarketplaceCard";
import { Title } from "@/components/Title/Title";
import { Text } from "@/components/Text/Text";

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
        <Title level="h3" size="h6">
          {group.name}
        </Title>
        <Text variant="span" size="xs" weight="semibold">
          {countLabel}
        </Text>
      </div>
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3">
        {group.products.map((product) => (
          <MarketplaceCard key={product.id} product={product} lang={lang} />
        ))}
      </div>
    </section>
  );
}

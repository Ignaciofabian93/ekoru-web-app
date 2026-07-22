"use client";
import { PackageSearch } from "lucide-react";
import { useTranslation } from "@/i18n/context";
import { NAMESPACE } from "../i18n";
import type { SearchResultItem } from "../types";
import {
  toMarketplaceCardProduct,
  toServiceCardData,
  toStoreProductCardProduct,
} from "../adapters";
import { ProductGridListLayout } from "@/components/Layout/ProductListGrid";
import MarketplaceCard from "@/components/Card/MarketplaceCard/MarketplaceCard";
import StoreProductCard from "@/components/Card/StoreProductCard/StoreProductCard";
import ServiceCard from "@/components/Card/ServiceCard/ServiceCard";

interface Props {
  items: SearchResultItem[];
  lang: string;
  loading?: boolean;
}

/** `item` narrows to a single variant in each branch, so every card gets the
 *  exact shape it expects via that variant's adapter. */
const renderItemCard = (item: SearchResultItem, lang: string) => {
  const key = `${item.type}_${item.id}`;

  switch (item.type) {
    case "PRODUCT":
      return (
        <MarketplaceCard
          key={key}
          product={toMarketplaceCardProduct(item)}
          lang={lang}
        />
      );
    case "STORE_PRODUCT":
      return (
        <StoreProductCard
          key={key}
          product={toStoreProductCardProduct(item)}
          lang={lang}
        />
      );
    case "SERVICE":
      return (
        <ServiceCard
          key={key}
          service={toServiceCardData(item)}
          href={`/${lang}/services`}
        />
      );
    default: {
      // Exhaustive: a new SearchResultType fails to compile until handled.
      const _exhaustive: never = item;
      return _exhaustive;
    }
  }
};

export function SearchResultsGrid({ items, lang, loading }: Props) {
  const { t } = useTranslation(NAMESPACE);

  if (loading && items.length === 0) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-background-secondary aspect-3/4 animate-pulse rounded-xl"
          />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-foreground-secondary py-16 text-center">
        <PackageSearch size={48} className="mx-auto mb-4 opacity-30" strokeWidth={1.5} />
        <p className="font-semibold">{t("results.empty")}</p>
        <p className="mt-1 text-sm">{t("results.emptyHint")}</p>
      </div>
    );
  }

  return (
    <ProductGridListLayout>
      {items.map((item) => renderItemCard(item, lang))}
    </ProductGridListLayout>
  );
}

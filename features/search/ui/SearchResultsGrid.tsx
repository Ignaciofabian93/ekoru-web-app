"use client";
import { PackageSearch } from "lucide-react";
import MarketplaceCard from "@/components/Card/MarketplaceCard/MarketplaceCard";
import ServiceCard from "@/components/Card/ServiceCard/ServiceCard";
import StoreProductCard from "@/components/Card/StoreProductCard/StoreProductCard";
import { ResultsGrid } from "@/components/Patterns/ResultsGrid";
import { useTranslation } from "@/i18n/context";
import {
  toMarketplaceCardProduct,
  toServiceCardData,
  toStoreProductCardProduct,
} from "../adapters";
import { NAMESPACE } from "../i18n";
import type { SearchResultItem } from "../types";

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
        <MarketplaceCard key={key} product={toMarketplaceCardProduct(item)} lang={lang} />
      );
    case "STORE_PRODUCT":
      return (
        <StoreProductCard key={key} product={toStoreProductCardProduct(item)} lang={lang} />
      );
    case "SERVICE":
      return (
        <ServiceCard key={key} service={toServiceCardData(item)} href={`/${lang}/services`} />
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

  return (
    <ResultsGrid
      items={items}
      loading={loading}
      emptyIcon={PackageSearch}
      emptyTitle={t("results.empty")}
      emptyHint={t("results.emptyHint")}
      renderItem={(item) => renderItemCard(item, lang)}
    />
  );
}

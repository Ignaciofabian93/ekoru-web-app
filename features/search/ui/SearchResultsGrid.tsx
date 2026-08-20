"use client";
import { PackageSearch } from "lucide-react";
import { ResultsGrid } from "@/components/Patterns/ResultsGrid";
import { useTranslation } from "@/i18n/context";
import {
  toMarketplaceCardProduct,
  toServiceCardService,
  toStoreProductCardProduct,
} from "../adapters";
import { NAMESPACE } from "../i18n";
import type { SearchResultItem } from "../types";
import { MarketplaceCard, ServiceCard, StoreProductCard } from "@/components/Cards";

interface Props {
  items: SearchResultItem[];
  lang: string;
  loading?: boolean;
  /**
   * Whether filters are on. An empty page then means "nothing left after
   * filtering", which is a different dead end from "nothing for this term".
   */
  filtered?: boolean;
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
        <StoreProductCard
          key={key}
          product={toStoreProductCardProduct(item)}
          lang={lang}
        />
      );
    case "SERVICE":
      return (
        <ServiceCard key={key} service={toServiceCardService(item)} lang={lang} />
      );
    default: {
      // Exhaustive: a new SearchResultType fails to compile until handled.
      const _exhaustive: never = item;
      return _exhaustive;
    }
  }
};

export function SearchResultsGrid({ items, lang, loading, filtered }: Props) {
  const { t } = useTranslation(NAMESPACE);

  return (
    <ResultsGrid
      items={items}
      loading={loading}
      emptyIcon={PackageSearch}
      emptyTitle={filtered ? t("results.emptyFiltered") : t("results.empty")}
      emptyHint={filtered ? t("results.emptyFilteredHint") : t("results.emptyHint")}
      renderItem={(item) => renderItemCard(item, lang)}
    />
  );
}

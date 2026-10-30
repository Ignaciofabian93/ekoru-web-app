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
import { trackSearchClick } from "@/features/tracking/track";
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
  /** The search these results came from; a click on one is counted against it. */
  searchId?: number | null;
  /** Results before this page, so a click's position counts from the first page. */
  positionOffset?: number;
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
      return <ServiceCard key={key} service={toServiceCardService(item)} lang={lang} />;
    default: {
      // Exhaustive: a new SearchResultType fails to compile until handled.
      const _exhaustive: never = item;
      return _exhaustive;
    }
  }
};

export function SearchResultsGrid({
  items,
  lang,
  loading,
  filtered,
  searchId,
  positionOffset = 0,
}: Props) {
  const { t } = useTranslation(NAMESPACE);

  // `contents` keeps the wrapper out of the grid layout. Only a click on a
  // link counts: the like and cart buttons inside a card are not a visit.
  const renderResult = (item: SearchResultItem, index: number) => (
    <div
      key={`${item.type}_${item.id}`}
      className="contents"
      onClickCapture={(e) => {
        if (!searchId || !(e.target as HTMLElement).closest("a")) return;
        trackSearchClick({
          searchId,
          itemType: item.type,
          itemId: item.id,
          position: positionOffset + index + 1,
        });
      }}
    >
      {renderItemCard(item, lang)}
    </div>
  );

  return (
    <ResultsGrid
      items={items}
      loading={loading}
      emptyIcon={PackageSearch}
      emptyTitle={filtered ? t("results.emptyFiltered") : t("results.empty")}
      emptyHint={filtered ? t("results.emptyFilteredHint") : t("results.emptyHint")}
      renderItem={renderResult}
    />
  );
}

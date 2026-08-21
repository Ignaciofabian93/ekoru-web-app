"use client";
import { useCallback, useMemo, useState } from "react";
import { Pagination, Tabs, type Tab } from "@/components/Patterns";
import { Modal } from "@/components/Overlays";
import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";
import type { Language } from "@/graphql/enums/enums";
import { useCountry } from "@/hooks/useCountry";
import { useFormatPrice } from "@/hooks/useFormatPrice";
import { useNavigation } from "@/hooks/useNavigation";
import { useTranslation } from "@/i18n/context";
import type { ProductCondition } from "@/types/enums";
import { useSearch } from "../hooks/useSearch";
import { useSearchFilters } from "../hooks/useSearchFilters";
import { NAMESPACE } from "../i18n";
import { countConditions, countSources, narrowItems } from "../narrow";
import {
  SEARCH_PAGE_SIZE,
  type SearchSource,
  type SearchTypeFilter,
} from "../types";
import { SearchActiveFilters } from "./SearchActiveFilters";
import { SearchDidYouMean } from "./SearchDidYouMean";
import { SearchFacetsRail } from "./SearchFacetsRail";
import { SearchHeading } from "./SearchHeading";
import { SearchResultsGrid } from "./SearchResultsGrid";
import { SearchToolbar } from "./SearchToolbar";
import { SearchZeroResults } from "./SearchZeroResults";

/**
 * Facet rail beside the results, stacked below `lg` where the rail becomes a
 * sheet — a 240px column plus a grid of cards needs a laptop's width before it
 * stops squeezing the results. The `240px` matches the rail's own content
 * width, so the results keep every pixel the rail does not need.
 */
const RAILS = "grid grid-cols-1 gap-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:items-start";

/** Marketplace and store hits both index as goods, so the tabs split the same way. */
const TAB_KEYS: SearchTypeFilter[] = ["ALL", "PRODUCTS", "SERVICES"];

interface Props {
  lang: string;
  /** GraphQL Language enum (ES | EN | FR), derived from the URL locale. */
  language: Language;
  /** The active query term, read from `?q=` on the server. */
  query: string;
}

export function SearchContent({ lang, language, query }: Props) {
  const { t } = useTranslation(NAMESPACE);
  const [country] = useCountry();
  const { navigateTo } = useNavigation();
  const formatPrice = useFormatPrice();
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Chip labels are resolved here so the filter state itself stays free of the
  // dictionary — the hook holds values, not copy.
  const chipLabels = useMemo(
    () => ({
      type: (type: SearchTypeFilter) => t(`tabs.${type}`),
      source: (source: SearchSource) => t(`filters.sources.${source}`),
      condition: (condition: ProductCondition) => t(`conditions.${condition}`),
      price: (min?: number, max?: number) => {
        if (min !== undefined && max !== undefined)
          return t("filters.priceBetween", {
            min: formatPrice(min),
            max: formatPrice(max),
          });
        if (min !== undefined) return t("filters.priceFrom", { min: formatPrice(min) });
        return t("filters.priceTo", { max: formatPrice(max ?? 0) });
      },
      offers: t("filters.onlyOffers"),
    }),
    [t, formatPrice],
  );

  const {
    filters,
    page,
    setPage,
    setType,
    setSortBy,
    setPriceRange,
    setHasOffer,
    toggleCategory,
    toggleTag,
    toggleCondition,
    toggleSource,
    conditionsDisabled,
    activeFilters,
    activeCount,
    clearAll,
  } = useSearchFilters(chipLabels);

  const {
    items,
    pageInfo,
    facets,
    suggestions,
    correctedQuery,
    processingTimeMs,
    total,
    loading,
    error,
  } = useSearch({
    query,
    language,
    country,
    page,
    pageSize: SEARCH_PAGE_SIZE,
    filters,
  });

  // A suggestion is a new search, not a filter, so it goes through the URL the
  // same way the search bar does — which also resets this component's state.
  const runSearch = useCallback(
    (term: string) =>
      navigateTo({ route: `/${lang}/search?q=${encodeURIComponent(term)}` }),
    [navigateTo, lang],
  );

  if (!query.trim()) {
    return (
      <div className="text-foreground-secondary py-16 text-center">
        <Title level="h1" size="h5" weight="semibold">
          {t("emptyQuery.title")}
        </Title>
        <Text variant="p" size="sm" color="secondary" className="mt-1">
          {t("emptyQuery.hint")}
        </Text>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-foreground-secondary py-16 text-center">
        <Title level="h1" size="h5" weight="semibold">
          {t("error.title")}
        </Title>
        <Text variant="p" size="sm" color="secondary" className="mt-1">
          {t("error.hint")}
        </Text>
      </div>
    );
  }

  const typeCounts = facets?.types ?? [];
  const countFor = (name: string) =>
    typeCounts.find((f) => f.name === name)?.count ?? 0;
  const goodsCount = countFor("PRODUCT") + countFor("STORE_PRODUCT");
  const servicesCount = countFor("SERVICE");

  const tabs: Tab[] = TAB_KEYS.map((key) => ({
    key,
    label: t(`tabs.${key}`),
    count:
      typeCounts.length === 0
        ? undefined
        : key === "ALL"
          ? goodsCount + servicesCount
          : key === "PRODUCTS"
            ? goodsCount
            : servicesCount,
  }));

  // Source and condition are not engine-side filters, so they are applied to
  // the page that came back — and the toolbar has to say so, because the
  // engine's totals still describe the unnarrowed result set.
  const visibleItems = narrowItems(items, filters);
  const sourceCounts = countSources(items);
  const conditionCounts = countConditions(items, filters.sources);
  const narrowed = filters.sources.length > 0 || filters.conditions.length > 0;

  const from = total === 0 ? 0 : (page - 1) * SEARCH_PAGE_SIZE + 1;
  const showingLabel = narrowed
    ? t("results.narrowed", {
        count: String(visibleItems.length),
        page: String(items.length),
      })
    : t("results.showing", {
        from: String(from),
        to: String(Math.min(page * SEARCH_PAGE_SIZE, total)),
        total: String(total),
      });

  // Nothing anywhere for this term is a different failure from nothing left
  // after filtering: the first needs a way out of the term, the second a way
  // out of the filters.
  const isZeroResults = !loading && total === 0 && activeCount === 0;

  const rail = (
    <SearchFacetsRail
      facets={facets}
      filters={filters}
      activeCount={activeCount}
      sourceCounts={sourceCounts}
      conditionCounts={conditionCounts}
      conditionsDisabled={conditionsDisabled}
      onToggleSource={toggleSource}
      onToggleCondition={toggleCondition}
      onToggleCategory={toggleCategory}
      onToggleTag={toggleTag}
      onPriceChange={setPriceRange}
      onHasOfferChange={setHasOffer}
      onClearAll={clearAll}
    />
  );

  return (
    <section className="flex flex-col gap-6">
      <SearchHeading
        query={query}
        total={total}
        processingTimeMs={processingTimeMs}
        suggestions={isZeroResults ? [] : suggestions}
        onPickSuggestion={runSearch}
        showCount={!loading || items.length > 0}
      />

      {correctedQuery && correctedQuery !== query && (
        <SearchDidYouMean correction={correctedQuery} onPick={runSearch} />
      )}

      {isZeroResults ? (
        <SearchZeroResults
          lang={lang}
          suggestions={suggestions}
          onPickSuggestion={runSearch}
        />
      ) : (
        <>
          <Tabs
            tabs={tabs}
            activeKey={filters.type}
            onSelect={(key) => setType(key as SearchTypeFilter)}
            ariaLabel={t("filters.title")}
            scrollable
          />

          <div className={RAILS}>
            <aside className="hidden lg:block">{rail}</aside>

            <div className="flex min-w-0 flex-col gap-4">
              <SearchToolbar
                showingLabel={showingLabel}
                sortBy={filters.sortBy}
                onSortChange={setSortBy}
                activeCount={activeCount}
                onOpenFilters={() => setFiltersOpen(true)}
              />

              <SearchActiveFilters filters={activeFilters} onClearAll={clearAll} />

              <SearchResultsGrid
                items={visibleItems}
                lang={lang}
                loading={loading}
                filtered={activeCount > 0}
              />

              {pageInfo && pageInfo.totalPages > 1 && (
                <Pagination
                  currentPage={pageInfo.currentPage}
                  totalPages={pageInfo.totalPages}
                  onPageChange={setPage}
                  showItemsPerPage={false}
                />
              )}
            </div>
          </div>
        </>
      )}

      {/* Below `sm` the rail has nowhere to sit, so it opens over the results. */}
      <Modal
        isOpen={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title={t("filters.title")}
        closeLabel={t("filters.close")}
        size="sm"
      >
        {rail}
      </Modal>
    </section>
  );
}

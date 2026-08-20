"use client";
import { useCallback, useMemo, useState } from "react";
import type { SearchFilters, SearchSortBy, SearchTypeFilter } from "../types";

const INITIAL: SearchFilters = {
  type: "ALL",
  sortBy: "RELEVANCE",
  categories: [],
  tags: [],
};

/** One active filter, ready to render as a removable chip. */
export interface ActiveFilter {
  /** Stable across renders — `${kind}:${value}`. */
  key: string;
  label: string;
  remove: () => void;
}

interface Labels {
  /** Reads a type tab's label, so the chip says "Services", not "SERVICES". */
  type: (type: SearchTypeFilter) => string;
  /** Label for the price chip, given whichever bounds are set. */
  price: (min?: number, max?: number) => string;
  offers: string;
}

/**
 * Holds the facet selections for one search term and hands back the derived
 * bits the body needs: the active-filter chips and how many are on.
 *
 * Every change resets to page 1 — page 3 of the old filters is rarely page 3
 * of the new ones, and an out-of-range page comes back empty.
 */
export function useSearchFilters(labels: Labels) {
  const [filters, setFilters] = useState<SearchFilters>(INITIAL);
  const [page, setPage] = useState(1);

  const update = useCallback((patch: Partial<SearchFilters>) => {
    setFilters((current) => ({ ...current, ...patch }));
    setPage(1);
  }, []);

  const toggleInList = useCallback(
    (key: "categories" | "tags", value: string) => {
      setFilters((current) => {
        const list = current[key];
        const next = list.includes(value)
          ? list.filter((v) => v !== value)
          : [...list, value];
        return { ...current, [key]: next };
      });
      setPage(1);
    },
    [],
  );

  const setType = useCallback(
    (type: SearchTypeFilter) => update({ type }),
    [update],
  );
  const setSortBy = useCallback(
    (sortBy: SearchSortBy) => update({ sortBy }),
    [update],
  );

  const clearAll = useCallback(() => {
    setFilters(INITIAL);
    setPage(1);
  }, []);

  // Sort is deliberately absent: it reorders the same result set rather than
  // narrowing it, so it is not something you "clear".
  const activeFilters = useMemo<ActiveFilter[]>(() => {
    const chips: ActiveFilter[] = [];

    if (filters.type !== "ALL") {
      chips.push({
        key: `type:${filters.type}`,
        label: labels.type(filters.type),
        remove: () => update({ type: "ALL" }),
      });
    }

    filters.categories.forEach((value) =>
      chips.push({
        key: `category:${value}`,
        label: value,
        remove: () => toggleInList("categories", value),
      }),
    );

    filters.tags.forEach((value) =>
      chips.push({
        key: `tag:${value}`,
        label: value,
        remove: () => toggleInList("tags", value),
      }),
    );

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      chips.push({
        key: "price",
        label: labels.price(filters.minPrice, filters.maxPrice),
        remove: () => update({ minPrice: undefined, maxPrice: undefined }),
      });
    }

    if (filters.hasOffer) {
      chips.push({
        key: "offers",
        label: labels.offers,
        remove: () => update({ hasOffer: undefined }),
      });
    }

    return chips;
  }, [filters, labels, toggleInList, update]);

  return {
    filters,
    page,
    setPage,
    setType,
    setSortBy,
    setPriceRange: (minPrice?: number, maxPrice?: number) =>
      update({ minPrice, maxPrice }),
    setHasOffer: (hasOffer: boolean) => update({ hasOffer: hasOffer || undefined }),
    toggleCategory: (value: string) => toggleInList("categories", value),
    toggleTag: (value: string) => toggleInList("tags", value),
    activeFilters,
    activeCount: activeFilters.length,
    clearAll,
  };
}

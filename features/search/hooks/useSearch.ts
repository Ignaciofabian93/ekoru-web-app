"use client";
import { useQuery } from "@apollo/client/react";
import { SEARCH } from "@/graphql/search/queries";
import type { Language } from "@/graphql/enums/enums";
import type { SearchFilters, SearchResponse } from "../types";

interface Params {
  query: string;
  /** GraphQL Language enum value (ES | EN | FR) — the user's selected locale. */
  language: Language;
  /** ISO country code (e.g. "CL", "CA") — the user's selected market. */
  country: string;
  page: number;
  pageSize: number;
  /** Facet selections and sort order, applied by the engine rather than here. */
  filters?: SearchFilters;
}

/**
 * Runs the federated catalog search scoped to `language` + `country`. The query
 * is skipped while the term is empty so an empty search bar costs nothing, and
 * the previous page is kept on screen while the next one loads.
 */
export function useSearch({
  query,
  language,
  country,
  page,
  pageSize,
  filters,
}: Params) {
  const trimmed = query.trim();

  const { data, previousData, loading, error } = useQuery<{
    search: SearchResponse;
  }>(SEARCH, {
    variables: {
      input: {
        query: trimmed,
        page,
        pageSize,
        // Omitted keys keep the server's defaults, so an untouched rail sends
        // the same input the page sent before there was a rail at all.
        //
        // Picking a catalog forces `type` to `PRODUCTS` upstream, which is the
        // closest the engine can narrow; marketplace vs store is then sorted
        // out client side, in `narrowItems`.
        ...(filters?.type && filters.type !== "ALL" ? { type: filters.type } : {}),
        ...(filters?.sortBy ? { sortBy: filters.sortBy } : {}),
        ...(filters?.categories?.length ? { categories: filters.categories } : {}),
        ...(filters?.tags?.length ? { tags: filters.tags } : {}),
        ...(filters?.minPrice !== undefined ? { minPrice: filters.minPrice } : {}),
        ...(filters?.maxPrice !== undefined ? { maxPrice: filters.maxPrice } : {}),
        ...(filters?.hasOffer ? { hasOffer: true } : {}),
      },
      language,
      country,
    },
    skip: trimmed.length === 0,
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  const payload = data?.search ?? previousData?.search;

  return {
    items: payload?.items ?? [],
    pageInfo: payload?.pageInfo,
    facets: payload?.facets,
    suggestions: payload?.suggestions ?? [],
    correctedQuery: payload?.correctedQuery ?? null,
    processingTimeMs: payload?.processingTimeMs,
    total: payload?.pageInfo?.totalItems ?? 0,
    loading,
    error,
  };
}

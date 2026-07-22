"use client";
import { useQuery } from "@apollo/client/react";
import { SEARCH } from "@/graphql/search/queries";
import type { Language } from "@/graphql/enums/enums";
import type { SearchResponse } from "../types";

interface Params {
  query: string;
  /** GraphQL Language enum value (ES | EN | FR) — the user's selected locale. */
  language: Language;
  /** ISO country code (e.g. "CL", "CA") — the user's selected market. */
  country: string;
  page: number;
  pageSize: number;
}

/**
 * Runs the federated catalog search scoped to `language` + `country`. The query
 * is skipped while the term is empty so an empty search bar costs nothing, and
 * the previous page is kept on screen while the next one loads.
 */
export function useSearch({ query, language, country, page, pageSize }: Params) {
  const trimmed = query.trim();

  const { data, previousData, loading, error } = useQuery<{
    search: SearchResponse;
  }>(SEARCH, {
    variables: {
      input: { query: trimmed, page, pageSize },
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
    total: payload?.pageInfo?.totalItems ?? 0,
    loading,
    error,
  };
}

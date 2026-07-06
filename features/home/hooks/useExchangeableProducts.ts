"use client";
import { useQuery } from "@apollo/client/react";

import { GET_EXCHANGEABLE_PRODUCTS_HOME } from "@/graphql/home/queries";
import type { Product } from "@/types/product";
import type { PageInfo } from "@/types/general";

interface Params {
  page?: number;
  pageSize?: number;
  filter?: Record<string, unknown>;
  sort?: { field: string; direction: "ASC" | "DESC" };
}

// Fetches exchangeable products for the home highlight. The query already
// defaults `filter` to `{ isExchangeable: true }`, so callers only need to
// override page/pageSize unless they want a narrower selection.
export function useExchangeableProducts({
  page = 1,
  pageSize = 8,
  filter,
  sort,
}: Params = {}) {
  const { data, loading, error, previousData } = useQuery<{
    getExchangeableProducts: { nodes: Product[]; pageInfo: PageInfo };
  }>(GET_EXCHANGEABLE_PRODUCTS_HOME, {
    variables: { page, pageSize, filter, sort },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  // Keep the previous page on screen while the next one loads so the grid
  // doesn't flash empty between fetches.
  const payload = data?.getExchangeableProducts ?? previousData?.getExchangeableProducts;

  return {
    products: payload?.nodes ?? [],
    pageInfo: payload?.pageInfo,
    loading,
    error,
  };
}

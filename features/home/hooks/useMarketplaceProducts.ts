"use client";
import { type DocumentNode } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

import {
  GET_EXCHANGEABLE_PRODUCTS_HOME,
  GET_SALE_PRODUCTS_HOME,
} from "@/graphql/home/queries";
import type { Product } from "@/types/product";
import type { PageInfo } from "@/types/general";

interface Params {
  page?: number;
  pageSize?: number;
  filter?: Record<string, unknown>;
  sort?: { field: string; direction: "ASC" | "DESC" };
}

type Page = { nodes: Product[]; pageInfo: PageInfo };

/**
 * One rail's worth of marketplace products. Both queries default their own
 * `filter` server-side, so callers only override page/pageSize unless they
 * want a narrower selection.
 *
 * @param root The response field the query resolves into — the two queries hang
 * off different roots (`getExchangeableProducts` / `getProducts`).
 */
function useProductRail<K extends string>(
  query: DocumentNode,
  root: K,
  { page = 1, pageSize = 8, filter, sort }: Params,
) {
  const { data, loading, error, previousData } = useQuery<Record<K, Page>>(query, {
    variables: { page, pageSize, filter, sort },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  // Keep the previous page on screen while the next one loads so the rail
  // doesn't flash empty between fetches.
  const payload = data?.[root] ?? previousData?.[root];

  return {
    products: payload?.nodes ?? [],
    pageInfo: payload?.pageInfo,
    loading,
    error,
  };
}

/** Products their sellers are willing to swap. */
export function useExchangeableProducts(params: Params = {}) {
  return useProductRail(
    GET_EXCHANGEABLE_PRODUCTS_HOME,
    "getExchangeableProducts",
    params,
  );
}

/** Products listed for sale only — the ones the swap rail leaves out. */
export function useSaleProducts(params: Params = {}) {
  return useProductRail(GET_SALE_PRODUCTS_HOME, "getProducts", params);
}

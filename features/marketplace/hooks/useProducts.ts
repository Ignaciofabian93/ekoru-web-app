"use client";
import { useQuery } from "@apollo/client/react";

import { GET_PRODUCTS } from "@/graphql/marketplace/queries";
import type { SortInput } from "@/types/product";

import type { MarketplaceProduct, PageInfo } from "../types";

interface Params {
  page: number;
  pageSize: number;
  filter?: Record<string, unknown>;
  sort?: SortInput;
}

export function useProducts({ page, pageSize, filter, sort }: Params) {
  const { data, loading, error, previousData } = useQuery<{
    getProducts: { nodes: MarketplaceProduct[]; pageInfo: PageInfo };
  }>(GET_PRODUCTS, {
    // `filter` and `sort` are what the sort select and the filter modal drive.
    // They were declared on the query and by the callers all along, but never
    // reached the variables — so every control on the marketplace root was
    // inert while the department and category pages (which do pass them)
    // worked.
    variables: { page, pageSize, filter, sort },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  // Fall back to the previous page while a new one is loading so the grid
  // doesn't flash empty between paginations.
  const payload = data?.getProducts ?? previousData?.getProducts;

  return {
    products: payload?.nodes ?? [],
    pageInfo: payload?.pageInfo,
    loading,
    error,
  };
}

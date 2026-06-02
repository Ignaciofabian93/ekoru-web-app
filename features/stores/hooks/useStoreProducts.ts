"use client";
import { useQuery } from "@apollo/client/react";

import { GET_STORE_PRODUCTS } from "@/graphql/stores/queries";

import type { PageInfo, StoreListProduct } from "../types";

interface Params {
  page: number;
  pageSize: number;
  filter?: Record<string, unknown>;
  sort?: { field: string; direction: "ASC" | "DESC" };
}

export function useStoreProducts({ page, pageSize }: Params) {
  const { data, loading, error, previousData } = useQuery<{
    getStoreProducts: { nodes: StoreListProduct[]; pageInfo: PageInfo };
  }>(GET_STORE_PRODUCTS, {
    variables: { page, pageSize },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  // Fall back to the previous page while a new one is loading so the grid
  // doesn't flash empty between paginations.
  const payload = data?.getStoreProducts ?? previousData?.getStoreProducts;

  return {
    products: payload?.nodes ?? [],
    pageInfo: payload?.pageInfo,
    loading,
    error,
  };
}

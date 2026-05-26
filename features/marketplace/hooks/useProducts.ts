"use client";
import { useQuery } from "@apollo/client/react";

import { GET_PRODUCTS } from "@/graphql/marketplace/queries";

import type { MarketplaceProduct, PageInfo } from "../types";

interface Params {
  page: number;
  pageSize: number;
  filter?: Record<string, unknown>;
  sort?: { field: string; direction: "ASC" | "DESC" };
}

export function useProducts({ page, pageSize }: Params) {
  const { data, loading, error, previousData } = useQuery<{
    getProducts: { nodes: MarketplaceProduct[]; pageInfo: PageInfo };
  }>(GET_PRODUCTS, {
    variables: { page, pageSize },
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

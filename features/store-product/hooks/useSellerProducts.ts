"use client";

import { useQuery } from "@apollo/client/react";

import type { PageInfo } from "@/features/marketplace/types";
import { GET_STORE_PRODUCTS_BY_SELLER } from "@/graphql/stores/queries";
import type { StoreProduct } from "@/types/product";

interface Params {
  sellerId: string | undefined;
  excludeProductId?: number | string;
  pageSize?: number;
}

export function useSellerProducts({
  sellerId,
  excludeProductId,
  pageSize = 8,
}: Params) {
  const { data, loading, error } = useQuery<{
    getStoreProductsBySeller: { nodes: StoreProduct[]; pageInfo: PageInfo } | null;
  }>(GET_STORE_PRODUCTS_BY_SELLER, {
    variables: {
      sellerId: sellerId ?? "",
      page: 1,
      pageSize,
    },
    skip: !sellerId,
    fetchPolicy: "cache-and-network",
  });

  const all = data?.getStoreProductsBySeller?.nodes ?? [];
  const products = excludeProductId
    ? all.filter((p) => String(p.id) !== String(excludeProductId))
    : all;

  return {
    products,
    loading,
    error,
  };
}

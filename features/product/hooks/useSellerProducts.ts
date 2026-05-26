"use client";

import { useQuery } from "@apollo/client/react";

import { GET_PRODUCTS_BY_SELLER } from "@/graphql/marketplace/queries";
import type { MarketplaceProduct, PageInfo } from "@/features/marketplace/types";

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
    getProductsBySeller: { nodes: MarketplaceProduct[]; pageInfo: PageInfo };
  }>(GET_PRODUCTS_BY_SELLER, {
    variables: {
      sellerId: sellerId ?? "",
      page: 1,
      pageSize,
    },
    skip: !sellerId,
    fetchPolicy: "cache-and-network",
  });

  const all = data?.getProductsBySeller.nodes ?? [];
  const products = excludeProductId
    ? all.filter((p) => String(p.id) !== String(excludeProductId))
    : all;

  return {
    products,
    loading,
    error,
  };
}

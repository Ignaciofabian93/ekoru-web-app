"use client";

import { useQuery } from "@apollo/client/react";

import { GET_PRODUCT_BY_ID } from "@/graphql/marketplace/queries";
import type { Product } from "@/types/product";

export function useProduct(id: string | number | undefined) {
  const productId = id !== undefined ? String(id) : "";

  const { data, loading, error } = useQuery<{ getProductById: Product | null }>(
    GET_PRODUCT_BY_ID,
    {
      variables: { id: productId },
      skip: !productId,
      fetchPolicy: "cache-and-network",
      notifyOnNetworkStatusChange: true,
    },
  );

  return {
    product: data?.getProductById ?? null,
    loading,
    error,
  };
}

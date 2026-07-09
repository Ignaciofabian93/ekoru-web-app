"use client";

import { useQuery } from "@apollo/client/react";

import type { StoreProduct } from "@/types/product";
import { GET_STORE_PRODUCT_BY_ID } from "@/graphql/stores/queries";

export function useStoreProduct(id: string | number | undefined) {
  const productId = id !== undefined ? String(id) : "";

  const { data, loading, error } = useQuery<{ getStoreProductById: StoreProduct | null }>(
    GET_STORE_PRODUCT_BY_ID,
    {
      variables: { id: productId },
      skip: !productId,
      fetchPolicy: "cache-and-network",
      notifyOnNetworkStatusChange: true,
    },
  );

  return {
    product: data?.getStoreProductById ?? null,
    loading,
    error,
  };
}

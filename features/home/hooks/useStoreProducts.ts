"use client";
import { useQuery } from "@apollo/client/react";
import { GET_STORE_PRODUCTS } from "@/graphql/stores/queries";
import type { StoreProduct } from "@/types/product";

export function useStoreProductsHomeData({
  countyIds,
  skip = false,
}: {
  /** Only products from stores located in these comunas ("near you"). */
  countyIds?: number[];
  skip?: boolean;
} = {}) {
  const { data, loading, error, previousData } = useQuery<{
    getStoreProducts: { nodes: StoreProduct[] };
  }>(GET_STORE_PRODUCTS, {
    variables: {
      page: 1,
      pageSize: 20,
      enablePagination: false,
      filter: countyIds ? { countyIds } : undefined,
    },
    skip,
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  const payload = data?.getStoreProducts ?? previousData?.getStoreProducts;

  return {
    storeProducts: payload?.nodes ?? [],
    loading,
    error,
  };
}

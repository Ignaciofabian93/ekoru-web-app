"use client";
import { useQuery } from "@apollo/client/react";
import { useMemo } from "react";
import type { PageInfo } from "@/features/marketplace/types";
import type { SellerStoreProduct } from "@/features/seller/types";
import { GET_STORE_PRODUCTS_BY_SELLER } from "@/graphql/stores/queries";
import { useSeller } from "@/store/useAuthStore";
import type { ListingStatus } from "./useMyListings";

interface Params {
  status: ListingStatus;
  pageSize?: number;
  /** Skip the query when the seller doesn't sell retail products. */
  enabled?: boolean;
}

/**
 * The current seller's own store (retail) products for the listings dashboard.
 * Mirrors {@link useMyListings}: fetches the seller's catalog once and splits it
 * into active / drafts client-side off `isActive`.
 */
export function useMyStoreListings({ status, pageSize = 100, enabled = true }: Params) {
  const seller = useSeller();
  const sellerId = seller?.id;

  const { data, loading, error } = useQuery<{
    getStoreProductsBySeller: {
      nodes: SellerStoreProduct[];
      pageInfo: PageInfo;
    } | null;
  }>(GET_STORE_PRODUCTS_BY_SELLER, {
    variables: { sellerId: sellerId ?? "", page: 1, pageSize },
    skip: !sellerId || !enabled,
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  const allProducts: SellerStoreProduct[] = useMemo(
    () => data?.getStoreProductsBySeller?.nodes ?? [],
    [data],
  );

  const products = useMemo(() => {
    if (status === "active") return allProducts.filter((p) => p.isActive !== false);
    if (status === "drafts") return allProducts.filter((p) => p.isActive === false);
    return [];
  }, [allProducts, status]);

  const counts = useMemo(
    () => ({
      active: allProducts.filter((p) => p.isActive !== false).length,
      drafts: allProducts.filter((p) => p.isActive === false).length,
      sold: 0,
    }),
    [allProducts],
  );

  return { sellerId, products, totalCount: products.length, counts, loading, error };
}

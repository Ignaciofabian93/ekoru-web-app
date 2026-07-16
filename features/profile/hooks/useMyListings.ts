"use client";
import { useQuery } from "@apollo/client/react";
import { useMemo } from "react";
import { GET_SELLER_STOREFRONT } from "@/graphql/marketplace/queries";
import { useSeller } from "@/store/useAuthStore";
import type {
  SellerStorefrontPayload,
  SellerStorefrontProduct,
} from "@/features/seller/types";

export type ListingStatus = "active" | "sold" | "drafts";

interface Params {
  status: ListingStatus;
  pageSize?: number;
  /** Skip the query when this kind of listing doesn't apply to the seller. */
  enabled?: boolean;
}

export function useMyListings({ status, pageSize = 100, enabled = true }: Params) {
  const seller = useSeller();
  const sellerId = seller?.id;

  const { data, loading, error } = useQuery<{
    getProductsBySeller: SellerStorefrontPayload | null;
  }>(GET_SELLER_STOREFRONT, {
    variables: {
      sellerId: sellerId ?? "",
      page: 1,
      pageSize,
    },
    skip: !sellerId || !enabled,
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  const allProducts: SellerStorefrontProduct[] = useMemo(
    () => data?.getProductsBySeller?.nodes ?? [],
    [data],
  );

  // The schema only exposes `isActive`. We treat:
  //   active = isActive,
  //   drafts = !isActive,
  //   sold   = (TODO) needs a backend-side filter; empty for now.
  const products = useMemo(() => {
    if (status === "active") return allProducts.filter((p) => p.isActive);
    if (status === "drafts") return allProducts.filter((p) => !p.isActive);
    return [];
  }, [allProducts, status]);

  const counts = useMemo(
    () => ({
      active: allProducts.filter((p) => p.isActive).length,
      drafts: allProducts.filter((p) => !p.isActive).length,
      sold: 0,
    }),
    [allProducts],
  );

  return {
    sellerId,
    products,
    totalCount: products.length,
    counts,
    loading,
    error,
  };
}

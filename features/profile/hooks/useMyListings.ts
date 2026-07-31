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

  // A completed P2P deal stamps `soldAt` (SALE/EXCHANGE) — it stays in the
  // profile ~a week then is soft-deleted. So:
  //   sold   = soldAt set,
  //   active = live listing (isActive, not sold),
  //   drafts = deactivated, not sold.
  const products = useMemo(() => {
    if (status === "sold") return allProducts.filter((p) => p.soldAt);
    if (status === "active")
      return allProducts.filter((p) => p.isActive && !p.soldAt);
    return allProducts.filter((p) => !p.isActive && !p.soldAt);
  }, [allProducts, status]);

  const counts = useMemo(
    () => ({
      active: allProducts.filter((p) => p.isActive && !p.soldAt).length,
      drafts: allProducts.filter((p) => !p.isActive && !p.soldAt).length,
      sold: allProducts.filter((p) => p.soldAt).length,
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

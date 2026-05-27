"use client";
import { useQuery } from "@apollo/client/react";
import { useMemo } from "react";
import { GET_SELLER_STOREFRONT } from "@/graphql/marketplace/queries";
import { useSeller } from "@/store/useAuthStore";
import { useTranslation } from "@/i18n/context";
import type {
  CategoryGroup,
  SellerStorefrontPayload,
  SellerStorefrontProduct,
} from "@/features/seller/types";
import { NAMESPACE } from "../i18n";

export type ListingStatus = "active" | "sold" | "drafts";

interface Params {
  status: ListingStatus;
  pageSize?: number;
}

export function useMyListings({ status, pageSize = 100 }: Params) {
  const { t } = useTranslation(NAMESPACE);
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
    skip: !sellerId,
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
  const filtered = useMemo(() => {
    if (status === "active") return allProducts.filter((p) => p.isActive);
    if (status === "drafts") return allProducts.filter((p) => !p.isActive);
    return [];
  }, [allProducts, status]);

  const categories: CategoryGroup[] = useMemo(() => {
    const map = new Map<string, CategoryGroup>();
    for (const product of filtered) {
      const cat = product.productCategory;
      const id = cat?.id !== undefined ? String(cat.id) : "uncategorized";
      const name = cat?.translation?.name ?? t("dashboard.listings.uncategorized");
      const href = cat?.translation?.href;
      if (!map.has(id)) {
        map.set(id, { id, name, href, products: [] });
      }
      map.get(id)!.products.push(product);
    }
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [filtered, t]);

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
    categories,
    totalCount: filtered.length,
    counts,
    loading,
    error,
  };
}

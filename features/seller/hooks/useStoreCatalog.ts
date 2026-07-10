"use client";

import { useQuery } from "@apollo/client/react";
import { useMemo } from "react";

import type { PageInfo } from "@/features/stores/types";
import { GET_STORE_PRODUCTS_BY_SELLER } from "@/graphql/stores/queries";
import { useTranslation } from "@/i18n/context";

import { NAMESPACE } from "../i18n";
import type { SellerStoreProduct, StoreCategoryGroup } from "../types";

interface Params {
  sellerId: string | undefined;
  /** Set false to skip the query (e.g. no seller id yet). */
  enabled?: boolean;
  pageSize?: number;
}

/**
 * Retail/service catalog for a business seller. Fetches the store products,
 * groups them by store sub-category, and exposes the seller identity carried by
 * the (public) product relation — the store product→seller relation already
 * includes the full BusinessProfile, so no auth-gated `getSeller` is needed.
 */
export function useStoreCatalog({ sellerId, enabled = true, pageSize = 100 }: Params) {
  const { t } = useTranslation(NAMESPACE);

  const { data, loading, error } = useQuery<{
    getStoreProductsBySeller: {
      nodes: SellerStoreProduct[];
      pageInfo: PageInfo;
    } | null;
  }>(GET_STORE_PRODUCTS_BY_SELLER, {
    variables: {
      sellerId: sellerId ?? "",
      page: 1,
      pageSize,
    },
    skip: !sellerId || !enabled,
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  const products: SellerStoreProduct[] = useMemo(
    () => data?.getStoreProductsBySeller?.nodes ?? [],
    [data],
  );

  // Identity is carried by the public product→seller relation (BusinessProfile).
  const seller = useMemo(
    () => products.find((p) => p.seller)?.seller ?? null,
    [products],
  );

  const categories: StoreCategoryGroup[] = useMemo(() => {
    const map = new Map<string, StoreCategoryGroup>();
    for (const product of products) {
      const cat = product.storeSubCategory;
      const rawId = cat?.id;
      const id = rawId !== null && rawId !== undefined ? String(rawId) : "uncategorized";
      const name = cat?.translation?.name ?? t("catalog.uncategorized");
      const href = cat?.translation?.href ?? undefined;
      if (!map.has(id)) {
        map.set(id, { id, name, href, products: [] });
      }
      map.get(id)!.products.push(product);
    }
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [products, t]);

  return {
    seller,
    products,
    categories,
    totalCount: data?.getStoreProductsBySeller?.pageInfo.totalCount ?? products.length,
    loading,
    error,
  };
}

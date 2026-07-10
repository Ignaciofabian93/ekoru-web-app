"use client";

import { useQuery } from "@apollo/client/react";
import { useMemo } from "react";

import { GET_SELLER_STOREFRONT } from "@/graphql/marketplace/queries";
import { useTranslation } from "@/i18n/context";

import { NAMESPACE } from "../i18n";
import type {
  CategoryGroup,
  SellerStorefrontPayload,
  SellerStorefrontProduct,
} from "../types";

interface Params {
  sellerId: string | undefined;
  /** Set false to skip the query (e.g. no seller id yet). */
  enabled?: boolean;
  pageSize?: number;
}

/**
 * Second-hand marketplace catalog for a PERSON seller. Groups the seller's
 * products by product category and exposes the seller identity carried by the
 * (public) product relation — this is the anonymous-safe way to read a seller's
 * profile, since the by-id `getSeller` query is auth-gated.
 */
export function useMarketplaceCatalog({
  sellerId,
  enabled = true,
  pageSize = 100,
}: Params) {
  const { t } = useTranslation(NAMESPACE);

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

  const products: SellerStorefrontProduct[] = useMemo(
    () => data?.getProductsBySeller?.nodes ?? [],
    [data],
  );

  // Identity is carried by the public product→seller relation (PersonProfile).
  const seller = useMemo(
    () => products.find((p) => p.seller)?.seller ?? null,
    [products],
  );

  const categories: CategoryGroup[] = useMemo(() => {
    const map = new Map<string, CategoryGroup>();
    for (const product of products) {
      const cat = product.productCategory;
      const id = cat?.id !== undefined ? String(cat.id) : "uncategorized";
      const name = cat?.translation?.name ?? t("catalog.uncategorized");
      const href = cat?.translation?.href;
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
    totalCount: data?.getProductsBySeller?.pageInfo.totalCount ?? products.length,
    loading,
    error,
  };
}

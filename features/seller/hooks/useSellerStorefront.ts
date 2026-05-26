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
  pageSize?: number;
}

export function useSellerStorefront({ sellerId, pageSize = 100 }: Params) {
  const { t } = useTranslation(NAMESPACE);

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

  const products: SellerStorefrontProduct[] = useMemo(
    () => data?.getProductsBySeller?.nodes ?? [],
    [data],
  );

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

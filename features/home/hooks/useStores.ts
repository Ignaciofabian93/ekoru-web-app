"use client";
import { useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import type { PageInfo } from "@/types/general";
import { GET_SELLERS } from "@/graphql/users/queries";
import { GET_STORE_SELLER_COUNTS } from "@/graphql/stores/queries";
import type { Seller } from "@/types/user";
import { BusinessType } from "@/graphql/enums/enums";
import type { SupportedLanguage } from "@/constants/settings";

export function useStoresHomeData({
  language,
  countyIds,
  skip = false,
}: {
  language: SupportedLanguage;
  /** Only stores located in these comunas (the "near you" rail). */
  countyIds?: number[];
  skip?: boolean;
}) {
  const { data, loading, error, previousData } = useQuery<{
    getSellers: { nodes: Seller[]; pageInfo: PageInfo };
  }>(GET_SELLERS, {
    variables: {
      language: language.toUpperCase(),
      page: 1,
      pageSize: 20,
      isActive: true,
      businessType: BusinessType.RETAIL,
      countyIds,
    },
    skip,
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  // `Seller` has no product count, so the card footer's comes from the stores
  // subgraph and is joined here by id. Same variables wherever it's called, so
  // the highlight and the "near you" rail share one request. Not awaited: the
  // cards render without it and gain the count when it lands.
  const { data: countsData } = useQuery<{
    getStoreSellers: { sellerId: string; productCount: number }[];
  }>(GET_STORE_SELLER_COUNTS, { skip, fetchPolicy: "cache-first" });

  const productCounts = useMemo(
    () =>
      Object.fromEntries(
        (countsData?.getStoreSellers ?? []).map((row) => [row.sellerId, row.productCount]),
      ) as Record<string, number>,
    [countsData],
  );

  const payload = data?.getSellers ?? previousData?.getSellers;

  return {
    sellers: payload?.nodes ?? [],
    productCounts,
    loading,
    error,
  };
}

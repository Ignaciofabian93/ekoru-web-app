"use client";
import { useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import type { PageInfo } from "@/types/general";
import { GET_SELLERS } from "@/graphql/users/queries";
import { GET_SERVICE_PROVIDER_COUNTS } from "@/graphql/services/queries";
import type { Seller } from "@/types/user";
import { BusinessType } from "@/graphql/enums/enums";
import type { SupportedLanguage } from "@/constants/settings";

export function useServicesHomeData({
  language,
  countyIds,
  skip = false,
}: {
  language: SupportedLanguage;
  /** Only providers located in these comunas (the "near you" rail). */
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
      businessType: BusinessType.SERVICES,
      countyIds,
    },
    skip,
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  // `Seller` has no service count, so the card footer's comes from the
  // services subgraph and is joined here by id. Same variables wherever it's
  // called, so the highlight and the "near you" rail share one request. Not
  // awaited: the cards render without it and gain the count when it lands.
  const { data: countsData } = useQuery<{
    getServiceProviders: { sellerId: string; serviceCount: number }[];
  }>(GET_SERVICE_PROVIDER_COUNTS, { skip, fetchPolicy: "cache-first" });

  const serviceCounts = useMemo(
    () =>
      Object.fromEntries(
        (countsData?.getServiceProviders ?? []).map((row) => [
          row.sellerId,
          row.serviceCount,
        ]),
      ) as Record<string, number>,
    [countsData],
  );

  const payload = data?.getSellers ?? previousData?.getSellers;

  return {
    sellers: payload?.nodes ?? [],
    serviceCounts,
    loading,
    error,
  };
}

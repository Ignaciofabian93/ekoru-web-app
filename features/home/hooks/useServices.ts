"use client";
import { useQuery } from "@apollo/client/react";
import type { PageInfo } from "@/types/general";
import { GET_SELLERS } from "@/graphql/users/queries";
import type { Seller } from "@/types/user";
import { BusinessType } from "@/graphql/enums/enums";
import type { SupportedLanguage } from "@/constants/settings";

export function useServicesHomeData({ language }: { language: SupportedLanguage }) {
  const { data, loading, error, previousData } = useQuery<{
    getSellers: { nodes: Seller[]; pageInfo: PageInfo };
  }>(GET_SELLERS, {
    variables: {
      language: language.toUpperCase(),
      page: 1,
      pageSize: 20,
      isActive: true,
      businessType: BusinessType.SERVICES,
    },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  const payload = data?.getSellers ?? previousData?.getSellers;

  return {
    sellers: payload?.nodes ?? [],
    loading,
    error,
  };
}

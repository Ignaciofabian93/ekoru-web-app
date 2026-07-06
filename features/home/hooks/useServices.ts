"use client";
import { useQuery } from "@apollo/client/react";
import { GET_SERVICES_HOME } from "@/graphql/home/queries";
import type { PageInfo } from "@/types/general";
import type { Service } from "@/types/services";

export function useServices() {
  const { data, loading, error, previousData } = useQuery<{
    getServices: { nodes: Service[]; pageInfo: PageInfo };
  }>(GET_SERVICES_HOME, {
    variables: { page: 1, pageSize: 20, isActive: true },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  const payload = data?.getServices ?? previousData?.getServices;

  return {
    services: payload?.nodes ?? [],
    pageInfo: payload?.pageInfo,
    loading,
    error,
  };
}

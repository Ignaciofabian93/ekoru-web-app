"use client";
import { useQuery } from "@apollo/client/react";
import { useMemo } from "react";

import { GET_SERVICES } from "@/graphql/services/queries";

import type { ServiceNode, ServicesConnection } from "../types";

/** Lists active services across all categories for the services landing grid. */
export function useServices(pageSize = 12) {
  const { data, loading, error } = useQuery<{
    getServices: ServicesConnection;
  }>(GET_SERVICES, {
    variables: { page: 1, pageSize, isActive: true },
    fetchPolicy: "cache-first",
  });

  const services = useMemo<ServiceNode[]>(
    () => data?.getServices.nodes ?? [],
    [data],
  );

  return { services, pageInfo: data?.getServices.pageInfo ?? null, loading, error };
}

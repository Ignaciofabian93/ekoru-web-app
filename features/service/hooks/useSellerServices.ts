"use client";

import { useQuery } from "@apollo/client/react";

import { GET_SERVICES_BY_SELLER } from "@/graphql/services/queries";
import type { PageInfo } from "@/features/marketplace/types";

import type { ServiceDetail } from "../types";

interface Params {
  sellerId: string | undefined;
  excludeServiceId?: string | number;
  pageSize?: number;
}

/** The provider's other live services, for the strip under the detail. */
export function useSellerServices({ sellerId, excludeServiceId, pageSize = 8 }: Params) {
  const { data, loading, error } = useQuery<{
    getServicesBySeller: { nodes: ServiceDetail[]; pageInfo: PageInfo } | null;
  }>(GET_SERVICES_BY_SELLER, {
    variables: {
      sellerId: sellerId ?? "",
      page: 1,
      pageSize,
      isActive: true,
    },
    skip: !sellerId,
    fetchPolicy: "cache-and-network",
  });

  const all = data?.getServicesBySeller?.nodes ?? [];
  const services = excludeServiceId
    ? all.filter((s) => String(s.id) !== String(excludeServiceId))
    : all;

  return { services, loading, error };
}

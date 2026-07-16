"use client";
import { useQuery } from "@apollo/client/react";
import { useMemo } from "react";
import { GET_SERVICES_BY_SELLER } from "@/graphql/services/queries";
import type { ServiceNode } from "@/features/services/types";
import type { PageInfo } from "@/features/marketplace/types";
import { useSeller } from "@/store/useAuthStore";
import type { ListingStatus } from "./useMyListings";

interface Params {
  status: ListingStatus;
  pageSize?: number;
  /** Skip the query when the seller doesn't offer services. */
  enabled?: boolean;
}

/**
 * The current seller's own services for the listings dashboard. Mirrors
 * {@link useMyListings}: fetches the seller's services once and splits them into
 * active / drafts client-side off `isActive`.
 */
export function useMyServiceListings({ status, pageSize = 100, enabled = true }: Params) {
  const seller = useSeller();
  const sellerId = seller?.id;

  const { data, loading, error } = useQuery<{
    getServicesBySeller: { nodes: ServiceNode[]; pageInfo: PageInfo } | null;
  }>(GET_SERVICES_BY_SELLER, {
    variables: { sellerId: sellerId ?? "", page: 1, pageSize },
    skip: !sellerId || !enabled,
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  const allServices: ServiceNode[] = useMemo(
    () => data?.getServicesBySeller?.nodes ?? [],
    [data],
  );

  const services = useMemo(() => {
    if (status === "active") return allServices.filter((s) => s.isActive !== false);
    if (status === "drafts") return allServices.filter((s) => s.isActive === false);
    return [];
  }, [allServices, status]);

  const counts = useMemo(
    () => ({
      active: allServices.filter((s) => s.isActive !== false).length,
      drafts: allServices.filter((s) => s.isActive === false).length,
      sold: 0,
    }),
    [allServices],
  );

  return { sellerId, services, totalCount: services.length, counts, loading, error };
}

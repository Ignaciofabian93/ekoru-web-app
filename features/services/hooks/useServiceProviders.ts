"use client";
import { useQuery } from "@apollo/client/react";
import { useMemo } from "react";

import { GET_SERVICE_PROVIDERS } from "@/graphql/services/queries";

import type { ServiceProviderRow } from "../types";

/**
 * The providers row on /services: businesses with active services, most
 * services first, narrowed to one service category when `categoryId` is set.
 */
export function useServiceProviders({
  categoryId,
  skip = false,
}: {
  categoryId?: number;
  skip?: boolean;
}) {
  const { data, loading, error } = useQuery<{
    getServiceProviders: ServiceProviderRow[];
  }>(GET_SERVICE_PROVIDERS, {
    variables: { categoryId: categoryId !== undefined ? String(categoryId) : null },
    skip,
    fetchPolicy: "cache-first",
  });

  const providers = useMemo(() => data?.getServiceProviders ?? [], [data]);

  return { providers, loading: skip || loading, error };
}

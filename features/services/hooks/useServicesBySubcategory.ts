"use client";
import { useQuery } from "@apollo/client/react";
import { useMemo } from "react";

import { GET_SERVICES_BY_SUBCATEGORY } from "@/graphql/services/queries";

import type { ServiceNode, ServicesConnection } from "../types";

/**
 * Lists active services for a subcategory. `subcategoryId` comes from
 * `getServiceSubCategoryBySlug`, so pass `null`/`undefined` until it resolves —
 * the query stays skipped to avoid firing with an empty id.
 */
export function useServicesBySubcategory(subcategoryId: number | null | undefined) {
  const hasId = subcategoryId !== null && subcategoryId !== undefined;

  const { data, loading, error } = useQuery<{
    getServicesBySubCategory: ServicesConnection;
  }>(GET_SERVICES_BY_SUBCATEGORY, {
    variables: { subcategoryId: String(subcategoryId), pageSize: 12, isActive: true },
    fetchPolicy: "cache-first",
    skip: !hasId,
  });

  const services = useMemo<ServiceNode[]>(
    () => data?.getServicesBySubCategory.nodes ?? [],
    [data],
  );

  return {
    services,
    pageInfo: data?.getServicesBySubCategory.pageInfo ?? null,
    loading,
    error,
  };
}

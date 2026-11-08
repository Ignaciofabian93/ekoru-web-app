"use client";
import { useQuery } from "@apollo/client/react";

import {
  GET_SERVICE_CATEGORY_SERVICES_BY_SLUG,
  GET_SERVICES,
} from "@/graphql/services/queries";

import type { Language, ServicesConnection } from "../types";

interface Params {
  /** Narrows the list to one service category (the category row on /services). */
  categorySlug?: string;
  language: Language;
  page: number;
  pageSize?: number;
  /** Hold the request, e.g. while a ?category= link waits for the catalog. */
  skip?: boolean;
}

/** The active services on /services, across every category or within one. */
export function useServices({
  categorySlug,
  language,
  page,
  pageSize = 12,
  skip = false,
}: Params) {
  const byCategory = Boolean(categorySlug);
  const shared = {
    fetchPolicy: "cache-and-network" as const,
    notifyOnNetworkStatusChange: true,
  };

  const all = useQuery<{ getServices: ServicesConnection }>(GET_SERVICES, {
    ...shared,
    variables: { page, pageSize, isActive: true },
    skip: skip || byCategory,
  });

  const inCategory = useQuery<{
    getServiceCategoryServicesBySlug: { services: ServicesConnection } | null;
  }>(GET_SERVICE_CATEGORY_SERVICES_BY_SLUG, {
    ...shared,
    variables: {
      slug: categorySlug,
      language,
      page,
      pageSize,
      isActive: true,
      // The page already has the category's name from the catalog.
      requireServiceCategoryFetch: false,
    },
    skip: skip || !byCategory,
  });

  // Keep the previous page on screen while the next one loads.
  const payload = byCategory
    ? (inCategory.data?.getServiceCategoryServicesBySlug?.services ??
      inCategory.previousData?.getServiceCategoryServicesBySlug?.services)
    : (all.data?.getServices ?? all.previousData?.getServices);
  const active = byCategory ? inCategory : all;

  return {
    services: payload?.nodes ?? [],
    pageInfo: payload?.pageInfo ?? null,
    loading: skip || active.loading,
    error: active.error,
  };
}

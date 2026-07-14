"use client";
import type { SupportedLanguage } from "@/constants/settings";
import { GET_SERVICE_CATEGORY_SERVICES_BY_SLUG } from "@/graphql/services/queries";
import { useQuery } from "@apollo/client/react";
import { useState } from "react";

import type { ServiceCategoryDetail, ServicesConnection } from "../types";

const DEFAULT_PAGE_SIZE = 12;

export function useServicesByCategory({
  slug,
  language,
}: {
  slug: string;
  language: SupportedLanguage;
}) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  // The category header and subcategory list only need to travel once;
  // pagination keeps serving them from the cache.
  const requireServiceCategoryFetch = page === 1;

  const { data, loading, error, previousData } = useQuery<{
    getServiceCategoryServicesBySlug: {
      serviceCategory?: ServiceCategoryDetail;
      services: ServicesConnection;
    } | null;
  }>(GET_SERVICE_CATEGORY_SERVICES_BY_SLUG, {
    variables: {
      slug,
      language: language.toUpperCase(),
      page,
      pageSize,
      isActive: true,
      requireServiceCategoryFetch,
    },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  const payload =
    data?.getServiceCategoryServicesBySlug ??
    previousData?.getServiceCategoryServicesBySlug;

  return {
    services: payload?.services.nodes ?? [],
    pageInfo: payload?.services.pageInfo,
    serviceCategory:
      data?.getServiceCategoryServicesBySlug?.serviceCategory ??
      previousData?.getServiceCategoryServicesBySlug?.serviceCategory ??
      null,
    loading,
    error,
    pageSize,
    handlePageChange: setPage,
    handlePageSizeChange: (size: number) => {
      setPageSize(size);
      setPage(1);
    },
  };
}

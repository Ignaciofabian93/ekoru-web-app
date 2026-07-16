"use client";
import type { SupportedLanguage } from "@/constants/settings";
import { GET_STORE_CATEGORY_PRODUCTS_BY_SLUG } from "@/graphql/stores/queries";
import { useQuery } from "@apollo/client/react";

import type { PageInfo, StoreCategoryDetail } from "../types";
import { useStoreFilters } from "./useStoreFilters";
import type { StoreProduct } from "@/types/product";

export function useProductsByStoreCategory({
  slug,
  language,
}: {
  slug: string;
  language: SupportedLanguage;
}) {
  const {
    filters,
    sort,
    page,
    pageSize,
    setField,
    setSort,
    setPage,
    setPageSize,
    reset,
    filterInput,
    sortInput,
  } = useStoreFilters();

  // The category tree only needs to travel once. Filter/sort changes reset to
  // page 1, so the tree is re-included exactly when it is already cached.
  const requireStoreCategoryFetch = page === 1;

  const { data, loading, error, previousData } = useQuery<{
    getStoreCategoryProductsBySlug: {
      storeCategory?: StoreCategoryDetail;
      products: { nodes: StoreProduct[]; pageInfo: PageInfo };
    };
  }>(GET_STORE_CATEGORY_PRODUCTS_BY_SLUG, {
    variables: {
      slug,
      language: language.toUpperCase(),
      page,
      pageSize,
      filter: filterInput,
      sort: sortInput,
      requireStoreCategoryFetch,
    },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  return {
    products:
      data?.getStoreCategoryProductsBySlug.products.nodes ??
      previousData?.getStoreCategoryProductsBySlug.products.nodes ??
      [],
    pageInfo:
      data?.getStoreCategoryProductsBySlug.products.pageInfo ??
      previousData?.getStoreCategoryProductsBySlug.products.pageInfo,
    storeCategory:
      data?.getStoreCategoryProductsBySlug.storeCategory ??
      previousData?.getStoreCategoryProductsBySlug.storeCategory ??
      null,
    loading,
    error,
    filters,
    sort,
    pageSize,
    setField,
    setSort,
    reset,
    handlePageChange: setPage,
    handlePageSizeChange: setPageSize,
  };
}

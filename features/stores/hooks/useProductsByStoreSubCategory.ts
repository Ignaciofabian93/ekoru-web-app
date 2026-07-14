"use client";
import type { SupportedLanguage } from "@/constants/settings";
import { GET_STORE_SUB_CATEGORY_PRODUCTS_BY_SLUG } from "@/graphql/stores/queries";
import { useQuery } from "@apollo/client/react";

import type {
  PageInfo,
  StoreListProduct,
  StoreSubCategoryDetail,
} from "../types";
import { useStoreFilters } from "./useStoreFilters";

export function useProductsByStoreSubCategory({
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

  // The sub category header only needs to travel once. Filter/sort changes
  // reset to page 1, so it is re-included exactly when it is already cached.
  const requireStoreSubCategoryFetch = page === 1;

  const { data, loading, error, previousData } = useQuery<{
    getStoreSubCategoryProductsBySlug: {
      storeSubCategory?: StoreSubCategoryDetail;
      products: { nodes: StoreListProduct[]; pageInfo: PageInfo };
    };
  }>(GET_STORE_SUB_CATEGORY_PRODUCTS_BY_SLUG, {
    variables: {
      slug,
      language: language.toUpperCase(),
      page,
      pageSize,
      filter: filterInput,
      sort: sortInput,
      requireStoreSubCategoryFetch,
    },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  return {
    products:
      data?.getStoreSubCategoryProductsBySlug.products.nodes ??
      previousData?.getStoreSubCategoryProductsBySlug.products.nodes ??
      [],
    pageInfo:
      data?.getStoreSubCategoryProductsBySlug.products.pageInfo ??
      previousData?.getStoreSubCategoryProductsBySlug.products.pageInfo,
    storeSubCategory:
      data?.getStoreSubCategoryProductsBySlug.storeSubCategory ??
      previousData?.getStoreSubCategoryProductsBySlug.storeSubCategory ??
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

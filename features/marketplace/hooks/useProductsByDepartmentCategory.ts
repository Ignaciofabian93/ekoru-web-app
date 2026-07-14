import type { SupportedLanguage } from "@/constants/settings";
import { GET_DEPARTMENT_CATEGORY_PRODUCTS_BY_SLUG } from "@/graphql/marketplace/queries";
import type { DepartmentCategory, Product } from "@/types/product";
import { useQuery } from "@apollo/client/react";

import type { PageInfo } from "../types";
import { useProductFilters } from "./useProductFilters";

export function useProductsByDepartmentCategory({
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
  } = useProductFilters();

  // The category tree only needs to travel once. Filter/sort changes reset to
  // page 1, so the tree is re-included exactly when it is already cached.
  const requireDepartmentCategoryFetch = page === 1;

  const { data, loading, error, previousData } = useQuery<{
    getDepartmentCategoryProductsBySlug: {
      departmentCategory?: DepartmentCategory;
      products: { nodes: Product[]; pageInfo: PageInfo };
    };
  }>(GET_DEPARTMENT_CATEGORY_PRODUCTS_BY_SLUG, {
    variables: {
      slug,
      language: language.toUpperCase(),
      page,
      pageSize,
      filter: filterInput,
      sort: sortInput,
      requireDepartmentCategoryFetch,
    },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  return {
    products:
      data?.getDepartmentCategoryProductsBySlug.products.nodes ??
      previousData?.getDepartmentCategoryProductsBySlug.products.nodes ??
      [],
    pageInfo:
      data?.getDepartmentCategoryProductsBySlug.products.pageInfo ??
      previousData?.getDepartmentCategoryProductsBySlug.products.pageInfo,
    departmentCategory:
      data?.getDepartmentCategoryProductsBySlug.departmentCategory ??
      previousData?.getDepartmentCategoryProductsBySlug.departmentCategory ??
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

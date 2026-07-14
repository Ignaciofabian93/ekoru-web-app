import type { SupportedLanguage } from "@/constants/settings";
import { GET_DEPARTMENT_PRODUCTS_BY_SLUG } from "@/graphql/marketplace/queries";
import type { Department, Product } from "@/types/product";
import { useQuery } from "@apollo/client/react";

import type { PageInfo } from "../types";
import { useProductFilters } from "./useProductFilters";

export function useProductsByDepartment({
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
  const requireDepartmentFetch = page === 1;

  const { data, loading, error, previousData } = useQuery<{
    getDepartmentProductsBySlug: {
      department?: Department;
      products: { nodes: Product[]; pageInfo: PageInfo };
    };
  }>(GET_DEPARTMENT_PRODUCTS_BY_SLUG, {
    variables: {
      slug,
      language: language.toUpperCase(),
      page,
      pageSize,
      filter: filterInput,
      sort: sortInput,
      requireDepartmentFetch,
    },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  return {
    products:
      data?.getDepartmentProductsBySlug.products.nodes ??
      previousData?.getDepartmentProductsBySlug.products.nodes ??
      [],
    pageInfo:
      data?.getDepartmentProductsBySlug.products.pageInfo ??
      previousData?.getDepartmentProductsBySlug.products.pageInfo,
    department:
      data?.getDepartmentProductsBySlug.department ??
      previousData?.getDepartmentProductsBySlug.department ??
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

import type { SupportedLanguage } from "@/constants/settings";
import { GET_PRODUCT_CATEGORY_PRODUCTS_BY_SLUG } from "@/graphql/marketplace/queries";
import type { Product, ProductCategory } from "@/types/product";
import { useQuery } from "@apollo/client/react";

import type { PageInfo } from "../types";
import { useProductFilters } from "./useProductFilters";

export function useProductsByProductCategory({
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

  // The category header only needs to travel once. Filter/sort changes reset
  // to page 1, so it is re-included exactly when it is already cached.
  const requireProductCategoryFetch = page === 1;

  const { data, loading, error, previousData } = useQuery<{
    getProductCategoryProductsBySlug: {
      productCategory?: ProductCategory;
      products: { nodes: Product[]; pageInfo: PageInfo };
    };
  }>(GET_PRODUCT_CATEGORY_PRODUCTS_BY_SLUG, {
    variables: {
      slug,
      language: language.toUpperCase(),
      page,
      pageSize,
      filter: filterInput,
      sort: sortInput,
      requireProductCategoryFetch,
    },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  return {
    products:
      data?.getProductCategoryProductsBySlug.products.nodes ??
      previousData?.getProductCategoryProductsBySlug.products.nodes ??
      [],
    pageInfo:
      data?.getProductCategoryProductsBySlug.products.pageInfo ??
      previousData?.getProductCategoryProductsBySlug.products.pageInfo,
    productCategory:
      data?.getProductCategoryProductsBySlug.productCategory ??
      previousData?.getProductCategoryProductsBySlug.productCategory ??
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

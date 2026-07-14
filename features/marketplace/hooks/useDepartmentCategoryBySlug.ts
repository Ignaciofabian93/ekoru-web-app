"use client";
import { useQuery } from "@apollo/client/react";
import { useMemo } from "react";

import {
  GET_DEPARTMENT_CATEGORY_BY_SLUG,
  GET_PRODUCTS_BY_DEPARTMENT_CATEGORY,
} from "@/graphql/marketplace/queries";
import type { SortInput } from "@/types/product";

import type {
  CatalogProductCategory,
  Language,
  MarketplaceProduct,
  PageInfo,
} from "../types";

interface Params {
  slug: string;
  language: Language;
  page: number;
  pageSize: number;
  filter?: Record<string, unknown>;
  sort?: SortInput;
}

// Matches the inline selection set on GET_DEPARTMENT_CATEGORY_BY_SLUG.
type DepartmentCategoryResult = {
  id: number;
  translation: { id: number; name: string; slug: string; href: string };
  productCategory: Array<{
    id: number;
    translation: { id: number; name: string; slug: string; href: string };
  }>;
};

export interface NormalizedDepartmentCategory {
  id: number;
  name: string;
  slug: string;
  href: string;
  productCategories: CatalogProductCategory[];
}

export function useDepartmentCategoryBySlug({
  slug,
  language,
  page,
  pageSize,
  filter,
  sort,
}: Params) {
  const categoryQuery = useQuery<{
    getDepartmentCategoryBySlug: DepartmentCategoryResult | null;
  }>(GET_DEPARTMENT_CATEGORY_BY_SLUG, {
    variables: { slug, language },
    fetchPolicy: "cache-first",
  });

  const raw = categoryQuery.data?.getDepartmentCategoryBySlug ?? null;

  const category = useMemo<NormalizedDepartmentCategory | null>(() => {
    if (!raw) return null;
    return {
      id: raw.id,
      name: raw.translation.name,
      slug: raw.translation.slug,
      href: raw.translation.href,
      productCategories: raw.productCategory.map((p) => ({
        id: p.id,
        name: p.translation.name,
        slug: p.translation.slug,
        href: p.translation.href,
      })),
    };
  }, [raw]);

  const categoryId = raw?.id;

  const productsQuery = useQuery<{
    getProductsByDepartmentCategory: {
      nodes: MarketplaceProduct[];
      pageInfo: PageInfo;
    };
  }>(GET_PRODUCTS_BY_DEPARTMENT_CATEGORY, {
    variables: {
      departmentCategoryId: categoryId !== undefined ? String(categoryId) : "",
      page,
      pageSize,
      filter,
      sort,
    },
    skip: categoryId === undefined,
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  const payload =
    productsQuery.data?.getProductsByDepartmentCategory ??
    productsQuery.previousData?.getProductsByDepartmentCategory;

  return {
    category,
    categoryLoading: categoryQuery.loading,
    products: payload?.nodes ?? [],
    pageInfo: payload?.pageInfo,
    productsLoading: productsQuery.loading,
    error: categoryQuery.error ?? productsQuery.error,
  };
}

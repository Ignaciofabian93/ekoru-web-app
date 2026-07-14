"use client";
import { useQuery } from "@apollo/client/react";
import { useMemo } from "react";

import {
  GET_DEPARTMENT_BY_SLUG,
  GET_PRODUCTS_BY_DEPARTMENT,
} from "@/graphql/marketplace/queries";
import type { SortInput } from "@/types/product";

import type {
  CatalogDepartmentCategory,
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

// Matches DEPARTMENT_FIELDS_FRAGMENT (translation + nested departmentCategory).
type DepartmentBySlugResult = {
  id: number;
  translation: { id: number; name: string; slug: string; href: string };
  departmentCategory: Array<{
    id: number;
    translation: { id: number; name: string; slug: string; href: string };
    productCategory: Array<{
      id: number;
      translation: { id: number; name: string; slug: string; href: string };
    }>;
  }>;
};

export interface NormalizedDepartment {
  id: number;
  name: string;
  slug: string;
  href: string;
  categories: CatalogDepartmentCategory[];
}

export function useDepartmentBySlug({
  slug,
  language,
  page,
  pageSize,
  filter,
  sort,
}: Params) {
  const departmentQuery = useQuery<{
    getDepartmentBySlug: DepartmentBySlugResult | null;
  }>(GET_DEPARTMENT_BY_SLUG, {
    variables: { slug, language },
    fetchPolicy: "cache-first",
  });

  const raw = departmentQuery.data?.getDepartmentBySlug ?? null;

  const department = useMemo<NormalizedDepartment | null>(() => {
    if (!raw) return null;
    return {
      id: raw.id,
      name: raw.translation.name,
      slug: raw.translation.slug,
      href: raw.translation.href,
      categories: raw.departmentCategory.map((c) => ({
        id: c.id,
        name: c.translation.name,
        slug: c.translation.slug,
        href: c.translation.href,
        productCategories: c.productCategory.map((p) => ({
          id: p.id,
          name: p.translation.name,
          slug: p.translation.slug,
          href: p.translation.href,
        })),
      })),
    };
  }, [raw]);

  const departmentId = raw?.id;

  const productsQuery = useQuery<{
    getProductsByDepartment: { nodes: MarketplaceProduct[]; pageInfo: PageInfo };
  }>(GET_PRODUCTS_BY_DEPARTMENT, {
    variables: {
      departmentId: departmentId !== undefined ? String(departmentId) : "",
      page,
      pageSize,
      filter,
      sort,
    },
    skip: departmentId === undefined,
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  const payload =
    productsQuery.data?.getProductsByDepartment ??
    productsQuery.previousData?.getProductsByDepartment;

  return {
    department,
    departmentLoading: departmentQuery.loading,
    products: payload?.nodes ?? [],
    pageInfo: payload?.pageInfo,
    productsLoading: productsQuery.loading,
    error: departmentQuery.error ?? productsQuery.error,
  };
}

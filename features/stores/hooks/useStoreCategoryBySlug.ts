"use client";
import { useQuery } from "@apollo/client/react";
import { useMemo } from "react";

import {
  GET_STORE_CATEGORY_BY_SLUG,
  GET_STORE_PRODUCTS_BY_CATEGORY,
} from "@/graphql/stores/queries";

import type {
  Language,
  PageInfo,
  StoreCatalogSubItem,
  StoreListProduct,
} from "../types";

interface Params {
  slug: string;
  language: Language;
  page: number;
  pageSize: number;
  filter?: Record<string, unknown>;
  sort?: { field: string; direction: "ASC" | "DESC" };
}

// Matches STORE_CATEGORY_FIELDS_FRAGMENT (translation + nested storeSubCategory).
type StoreCategoryResult = {
  id: number;
  translation: { id: number; name: string; slug: string; href: string };
  storeSubCategory: Array<{
    id: number;
    translation: { id: number; name: string; slug: string; href: string };
  }>;
};

export interface NormalizedStoreCategory {
  id: number;
  name: string;
  slug: string;
  href: string;
  subCategoryItems: StoreCatalogSubItem[];
}

export function useStoreCategoryBySlug({
  slug,
  language,
  page,
  pageSize,
  filter,
  sort,
}: Params) {
  const categoryQuery = useQuery<{
    getStoreCategoryBySlug: StoreCategoryResult | null;
  }>(GET_STORE_CATEGORY_BY_SLUG, {
    variables: { slug, language },
    fetchPolicy: "cache-first",
  });

  const raw = categoryQuery.data?.getStoreCategoryBySlug ?? null;

  const category = useMemo<NormalizedStoreCategory | null>(() => {
    if (!raw) return null;
    return {
      id: raw.id,
      name: raw.translation.name,
      slug: raw.translation.slug,
      href: raw.translation.href,
      subCategoryItems: raw.storeSubCategory.map((s) => ({
        id: s.id,
        name: s.translation.name,
        slug: s.translation.slug,
        href: s.translation.href,
      })),
    };
  }, [raw]);

  const categoryId = raw?.id;

  const productsQuery = useQuery<{
    getProductsByStoreCategory: {
      nodes: StoreListProduct[];
      pageInfo: PageInfo;
    };
  }>(GET_STORE_PRODUCTS_BY_CATEGORY, {
    variables: {
      categoryId: categoryId !== undefined ? String(categoryId) : "",
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
    productsQuery.data?.getProductsByStoreCategory ??
    productsQuery.previousData?.getProductsByStoreCategory;

  return {
    category,
    categoryLoading: categoryQuery.loading,
    products: payload?.nodes ?? [],
    pageInfo: payload?.pageInfo,
    productsLoading: productsQuery.loading,
    error: categoryQuery.error ?? productsQuery.error,
  };
}

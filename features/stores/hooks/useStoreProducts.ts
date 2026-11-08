"use client";
import { useQuery } from "@apollo/client/react";

import {
  GET_STORE_PRODUCTS,
  GET_STORE_PRODUCTS_BY_CATEGORY,
} from "@/graphql/stores/queries";

import type { PageInfo, StoreSortInput } from "../types";
import type { StoreProduct } from "@/types/product";

type Payload = { nodes: StoreProduct[]; pageInfo: PageInfo };

interface Params {
  /** Narrows the grid to one store category (the category row on /stores). */
  categoryId?: number;
  page: number;
  pageSize: number;
  filter?: Record<string, unknown>;
  sort?: StoreSortInput;
  /** Hold the request, e.g. while a ?category= link waits for the catalog. */
  skip?: boolean;
}

/** The product grid on /stores, across every category or within one. */
export function useStoreProducts({
  categoryId,
  page,
  pageSize,
  filter,
  sort,
  skip = false,
}: Params) {
  const byCategory = categoryId !== undefined;
  const shared = {
    fetchPolicy: "cache-and-network" as const,
    notifyOnNetworkStatusChange: true,
  };

  const all = useQuery<{ getStoreProducts: Payload }>(GET_STORE_PRODUCTS, {
    ...shared,
    variables: { page, pageSize, filter, sort },
    skip: skip || byCategory,
  });

  const inCategory = useQuery<{ getProductsByStoreCategory: Payload }>(
    GET_STORE_PRODUCTS_BY_CATEGORY,
    {
      ...shared,
      variables: { categoryId: String(categoryId), page, pageSize, filter, sort },
      skip: skip || !byCategory,
    },
  );

  // Fall back to the previous page while a new one is loading so the grid
  // doesn't flash empty between paginations.
  const payload = byCategory
    ? (inCategory.data?.getProductsByStoreCategory ??
      inCategory.previousData?.getProductsByStoreCategory)
    : (all.data?.getStoreProducts ?? all.previousData?.getStoreProducts);
  const active = byCategory ? inCategory : all;

  return {
    products: payload?.nodes ?? [],
    pageInfo: payload?.pageInfo,
    loading: skip || active.loading,
    error: active.error,
  };
}

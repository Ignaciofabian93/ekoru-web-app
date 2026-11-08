"use client";
import { useQuery } from "@apollo/client/react";
import { useMemo } from "react";

import { GET_STORE_SELLERS } from "@/graphql/stores/queries";

import type { StoreSellerRow } from "../types";

/**
 * The stores row on /stores: businesses with visible products, most products
 * first, narrowed to one store category when `categoryId` is set.
 */
export function useStoreSellers({
  categoryId,
  skip = false,
}: {
  categoryId?: number;
  skip?: boolean;
}) {
  const { data, loading, error } = useQuery<{ getStoreSellers: StoreSellerRow[] }>(
    GET_STORE_SELLERS,
    {
      variables: { categoryId: categoryId !== undefined ? String(categoryId) : null },
      skip,
      fetchPolicy: "cache-first",
    },
  );

  const sellers = useMemo(() => data?.getStoreSellers ?? [], [data]);

  return { sellers, loading: skip || loading, error };
}

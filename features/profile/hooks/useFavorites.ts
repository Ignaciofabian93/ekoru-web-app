"use client";

import { useQuery } from "@apollo/client/react";

import { GET_MY_FAVORITES } from "@/graphql/marketplace/queries";
import { GET_MY_FAVORITE_SERVICES } from "@/graphql/services/queries";
import { GET_MY_FAVORITE_STORE_PRODUCTS } from "@/graphql/stores/queries";
import type { PageInfo } from "@/features/marketplace/types";
import type { ServiceNode } from "@/features/services/types";
import type { StoreListProduct } from "@/features/stores/types";
import type { Product } from "@/types/product";

export type FavoritesTab = "products" | "stores" | "services";

type Connection<T> = { nodes: T[]; pageInfo: PageInfo };

/**
 * Loads the active favorites tab (marketplace products, store products, or
 * services). Each tab returns the full node shape its regular catalog card
 * renders, so favorites look and behave exactly like the marketplace, stores
 * and services grids (flip, impact, add to cart, favorite toggle). Inactive
 * tabs are skipped so we only hit the subgraph in view.
 */
export function useFavorites(tab: FavoritesTab, page: number, pageSize = 12) {
  const products = useQuery<{ getMyFavorites: Connection<Product> }>(
    GET_MY_FAVORITES,
    {
      variables: { page, pageSize },
      skip: tab !== "products",
      fetchPolicy: "cache-and-network",
      notifyOnNetworkStatusChange: true,
    },
  );
  const stores = useQuery<{
    getMyFavoriteStoreProducts: Connection<StoreListProduct>;
  }>(GET_MY_FAVORITE_STORE_PRODUCTS, {
    variables: { page, pageSize },
    skip: tab !== "stores",
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });
  const services = useQuery<{ getMyFavoriteServices: Connection<ServiceNode> }>(
    GET_MY_FAVORITE_SERVICES,
    {
      variables: { page, pageSize },
      skip: tab !== "services",
      fetchPolicy: "cache-and-network",
      notifyOnNetworkStatusChange: true,
    },
  );

  if (tab === "stores") {
    const payload =
      stores.data?.getMyFavoriteStoreProducts ??
      stores.previousData?.getMyFavoriteStoreProducts;
    return {
      products: [] as Product[],
      storeProducts: payload?.nodes ?? [],
      services: [] as ServiceNode[],
      pageInfo: payload?.pageInfo,
      loading: stores.loading,
      isEmpty: !stores.loading && (payload?.nodes ?? []).length === 0,
    };
  }

  if (tab === "services") {
    const payload =
      services.data?.getMyFavoriteServices ??
      services.previousData?.getMyFavoriteServices;
    return {
      products: [] as Product[],
      storeProducts: [] as StoreListProduct[],
      services: payload?.nodes ?? [],
      pageInfo: payload?.pageInfo,
      loading: services.loading,
      isEmpty: !services.loading && (payload?.nodes ?? []).length === 0,
    };
  }

  const payload =
    products.data?.getMyFavorites ?? products.previousData?.getMyFavorites;
  return {
    products: payload?.nodes ?? [],
    storeProducts: [] as StoreListProduct[],
    services: [] as ServiceNode[],
    pageInfo: payload?.pageInfo,
    loading: products.loading,
    isEmpty: !products.loading && (payload?.nodes ?? []).length === 0,
  };
}

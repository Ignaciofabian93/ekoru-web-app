"use client";

import { useQuery } from "@apollo/client/react";

import { GET_MY_FAVORITES } from "@/graphql/marketplace/queries";
import { GET_MY_FAVORITE_SERVICES } from "@/graphql/services/queries";
import { GET_MY_FAVORITE_STORE_PRODUCTS } from "@/graphql/stores/queries";
import type { PageInfo } from "@/features/marketplace/types";
import type { FavoriteSource } from "@/hooks/useToggleFavorite";

export type FavoritesTab = "products" | "stores" | "services";

/** Normalized shape the favorites grid renders, regardless of source. */
export interface FavoriteCardItem {
  id: number;
  source: FavoriteSource;
  name: string;
  image?: string;
  price?: number;
  subtitle?: string;
}

interface ProductNode {
  id: number;
  name: string;
  price: number;
  images?: string[] | null;
  productCategory?: { translation?: { name?: string | null } | null } | null;
}

interface StoreNode {
  id: number;
  name: string;
  price: number;
  hasOffer?: boolean | null;
  offerPrice?: number | null;
  images?: string[] | null;
  brand?: string | null;
}

interface ServiceNode {
  id: string | number;
  name: string;
  basePrice?: number | null;
  images?: string[] | null;
  serviceCategory?: { subCategory?: string | null } | null;
}

type Connection<T> = { nodes: T[]; pageInfo: PageInfo };

/**
 * Loads the active favorites tab (marketplace products, store products, or
 * services) and normalizes the rows into a single card shape. Inactive tabs are
 * skipped so we only hit the subgraph in view.
 */
export function useFavorites(tab: FavoritesTab, page: number, pageSize = 12) {
  const products = useQuery<{ getMyFavorites: Connection<ProductNode> }>(
    GET_MY_FAVORITES,
    {
      variables: { page, pageSize },
      skip: tab !== "products",
      fetchPolicy: "cache-and-network",
      notifyOnNetworkStatusChange: true,
    },
  );
  const stores = useQuery<{
    getMyFavoriteStoreProducts: Connection<StoreNode>;
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
    const items: FavoriteCardItem[] = (payload?.nodes ?? []).map((n) => ({
      id: n.id,
      source: "store",
      name: n.name,
      image: n.images?.[0],
      price: n.hasOffer && n.offerPrice ? n.offerPrice : n.price,
      subtitle: n.brand ?? undefined,
    }));
    return { items, pageInfo: payload?.pageInfo, loading: stores.loading };
  }

  if (tab === "services") {
    const payload =
      services.data?.getMyFavoriteServices ??
      services.previousData?.getMyFavoriteServices;
    const items: FavoriteCardItem[] = (payload?.nodes ?? []).map((n) => ({
      id: Number(n.id),
      source: "service",
      name: n.name,
      image: n.images?.[0],
      price: n.basePrice ?? undefined,
      subtitle: n.serviceCategory?.subCategory ?? undefined,
    }));
    return { items, pageInfo: payload?.pageInfo, loading: services.loading };
  }

  const payload =
    products.data?.getMyFavorites ?? products.previousData?.getMyFavorites;
  const items: FavoriteCardItem[] = (payload?.nodes ?? []).map((n) => ({
    id: n.id,
    source: "marketplace",
    name: n.name,
    image: n.images?.[0],
    price: n.price,
    subtitle: n.productCategory?.translation?.name ?? undefined,
  }));
  return { items, pageInfo: payload?.pageInfo, loading: products.loading };
}

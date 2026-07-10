"use client";

import { useQuery } from "@apollo/client/react";

import type { SupportedLanguage } from "@/constants/settings";
import { GET_SELLER } from "@/graphql/users/queries";
import type { Seller } from "@/types/user";

interface Params {
  sellerId: string | undefined;
  lang: SupportedLanguage;
}

/**
 * Fetches the seller's identity/profile directly via `getSeller` (person or
 * business). Identity is independent of the catalog, so a seller with zero
 * products still resolves instead of collapsing to "not found".
 *
 * Note: `getSeller` is auth-gated on the users subgraph (the viewer must be an
 * authenticated seller/admin), so the seller page assumes a logged-in session.
 */
export function useSellerProfile({ sellerId, lang }: Params) {
  const { data, loading, error } = useQuery<{ getSeller: Seller | null }>(GET_SELLER, {
    variables: { id: sellerId ?? "", language: lang.toUpperCase() },
    skip: !sellerId,
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  return {
    seller: data?.getSeller ?? null,
    loading,
    error,
  };
}

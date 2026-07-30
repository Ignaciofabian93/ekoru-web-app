"use client";

import { useQuery } from "@apollo/client/react";

import type { SupportedLanguage } from "@/constants/settings";
import { GET_SELLER } from "@/graphql/users/queries";
import { isUnauthorizedError } from "@/lib/apollo/errors";
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
 * authenticated seller/admin), so an anonymous visitor gets `requiresAuth`
 * rather than an error — the screen invites a sign-in instead of reporting a
 * failure it can't act on.
 */
export function useSellerProfile({ sellerId, lang }: Params) {
  const { data, loading, error } = useQuery<{ getSeller: Seller | null }>(GET_SELLER, {
    variables: { id: sellerId ?? "", language: lang.toUpperCase() },
    skip: !sellerId,
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  const requiresAuth = isUnauthorizedError(error);

  return {
    seller: data?.getSeller ?? null,
    loading,
    requiresAuth,
    // An auth failure is reported on its own channel, so `error` stays for
    // genuine faults the visitor can't fix by signing in.
    error: requiresAuth ? undefined : error,
  };
}

"use client";
import { useQuery } from "@apollo/client/react";

import { DEALS_BADGE } from "@/graphql/deals/badge";
import { useIsAuthenticated } from "@/store/useAuthStore";

interface BadgeDeal {
  id: number;
  status: string;
  sellerConfirmedAt?: string | null;
  buyerConfirmedAt?: string | null;
}

/**
 * How many deals currently need the signed-in user's action — shown as a badge
 * on the avatar dropdown's "Deals" entry (like the cart count). Polls in the
 * background so a new purchase request surfaces without opening the page.
 *
 * Counts: incoming requests to accept (seller PROPOSED) + accepted deals still
 * awaiting my confirmation (either side).
 *
 * `enabled` exists for always-mounted consumers: the Drawer sits in the layout
 * tree on every page, so it defers until first opened rather than starting a
 * second 30s poll alongside the avatar dropdown's on every page load.
 */
export function useDealsBadge(enabled: boolean = true): number {
  const isAuthed = useIsAuthenticated();
  const { data } = useQuery<{
    myDealsAsSeller: BadgeDeal[];
    myDealsAsBuyer: BadgeDeal[];
  }>(DEALS_BADGE, {
    skip: !isAuthed || !enabled,
    fetchPolicy: "cache-and-network",
    pollInterval: 30000,
  });

  if (!data) return 0;

  const sellerPending = data.myDealsAsSeller.filter(
    (d) =>
      d.status === "PROPOSED" ||
      (d.status === "ACCEPTED" && !d.sellerConfirmedAt),
  ).length;
  const buyerPending = data.myDealsAsBuyer.filter(
    (d) => d.status === "ACCEPTED" && !d.buyerConfirmedAt,
  ).length;

  return sellerPending + buyerPending;
}

"use client";
import { useQuery } from "@apollo/client/react";

import { P2P_DEAL_SETTINGS } from "@/graphql/deals/queries";

export interface DealSettings {
  /** Price gap (CLP) at or above which an exchange requires a cash top-up. */
  compensationThresholdClp: number;
  confirmWindowHours: number;
  /** Eco-points each side earns when the deal completes. */
  completionPoints: number;
}

/**
 * The server's P2P deal rules. The client must not guess these: whether a price
 * gap turns into a cash compensation is decided by the transactions subgraph, so
 * a hardcoded threshold here would promise the user a top-up the deal never
 * records. Falls back to the same defaults the service ships with.
 */
const FALLBACK: DealSettings = {
  compensationThresholdClp: 5000,
  confirmWindowHours: 72,
  completionPoints: 10,
};

export function useDealSettings(): DealSettings {
  const { data } = useQuery<{ p2pDealSettings: DealSettings }>(
    P2P_DEAL_SETTINGS,
    { fetchPolicy: "cache-first" },
  );
  return data?.p2pDealSettings ?? FALLBACK;
}

"use client";
import { useQuery } from "@apollo/client/react";

import { MY_IMPACT_YEAR, MY_IMPACT_YEARS } from "@/graphql/impact/queries";
import { useIsAuthenticated } from "@/store/useAuthStore";
import type { SellerImpactYear } from "../types";

/**
 * The signed-in seller's environmental savings for one year.
 *
 * Every figure is a stored snapshot taken when each deal completed, so the
 * numbers are stable — reopening a past year always shows what it showed then,
 * regardless of how the impact catalogue has been edited since. That means no
 * polling: the data for a closed year cannot change.
 */
export function useImpactYear(year: number | undefined, language: string) {
  const isAuthed = useIsAuthenticated();

  const years = useQuery<{ myImpactYears: number[] }>(MY_IMPACT_YEARS, {
    skip: !isAuthed,
    fetchPolicy: "cache-and-network",
  });

  const summary = useQuery<{ myImpactYear: SellerImpactYear }>(MY_IMPACT_YEAR, {
    variables: { year, language: language.toUpperCase() },
    skip: !isAuthed,
    fetchPolicy: "cache-and-network",
  });

  return {
    availableYears: years.data?.myImpactYears ?? [],
    impact: summary.data?.myImpactYear ?? null,
    // `cache-and-network` re-reports loading on refetch; only show the skeleton
    // when there is nothing to display yet.
    loading: summary.loading && !summary.data,
  };
}

"use client";
import { useQuery } from "@apollo/client/react";
import { useMemo } from "react";
import type { SupportedLanguage } from "@/constants/settings";
import { GET_COUNTIES_NEAR } from "@/graphql/location/queries";
import type { ExploreLocation } from "@/hooks/useExploreLocation";

export type NearbyCounty = {
  id: number;
  county: string;
  cityId: number;
  distanceKm: number;
};

/**
 * The comunas within `radiusKm` of where the visitor is exploring, as the ids
 * the catalogue listings filter by.
 *
 * A geolocated comuna searches from the visitor's own position; a picked one
 * from that comuna's reference point. A location with neither (a comuna
 * stored before positions were kept) has no origin, and `hasOrigin` says so,
 * so the caller can ask for the location again instead of showing nothing.
 */
export function useNearbyCounties({
  location,
  radiusKm,
  language,
}: {
  location: ExploreLocation | null;
  radiusKm: number;
  language: SupportedLanguage;
}) {
  const hasPoint = location?.latitude !== undefined && location.longitude !== undefined;
  const hasOrigin = !!location && (location.countyId !== undefined || hasPoint);

  const { data, previousData, loading, error } = useQuery<{
    countiesNear: NearbyCounty[];
  }>(GET_COUNTIES_NEAR, {
    variables: {
      radiusKm,
      // The point is more precise than the comuna's centre; with both, the
      // backend searches from the point and still includes the comuna.
      countyId: location?.countyId,
      latitude: hasPoint ? location.latitude : undefined,
      longitude: hasPoint ? location.longitude : undefined,
      language: language.toUpperCase(),
    },
    skip: !hasOrigin,
  });

  // Keeps the previous radius's comunas while the next ones load, so the
  // rails below don't drop to their skipped (empty) state in between.
  const counties = (data ?? previousData)?.countiesNear;
  const countyIds = useMemo(() => counties?.map((c) => c.id), [counties]);

  return { hasOrigin, counties, countyIds, loading, error };
}

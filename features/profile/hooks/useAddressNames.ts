"use client";
import { useQuery } from "@apollo/client/react";

import {
  GET_CITIES_BY_REGION,
  GET_COUNTIES_BY_CITY,
  GET_REGIONS_BY_COUNTRY,
} from "@/graphql/location/queries";

import type { SaleAddress } from "./useMySales";

/**
 * Names for an order address, which transactions stores as location ids. Uses
 * the same lists the checkout address form loads, so they are usually cached
 * already. Skipped until the address is shown.
 */
export function useAddressNames(address: SaleAddress | null | undefined, enabled: boolean) {
  const skip = !enabled || !address;
  const regions = useQuery<{ regionsByCountryId: { id: number; region: string }[] }>(
    GET_REGIONS_BY_COUNTRY,
    { variables: { countryId: address?.countryId }, skip },
  );
  const cities = useQuery<{ citiesByRegionId: { id: number; city: string }[] }>(
    GET_CITIES_BY_REGION,
    { variables: { regionId: address?.regionId }, skip },
  );
  const counties = useQuery<{ countiesByCityId: { id: number; county: string }[] }>(
    GET_COUNTIES_BY_CITY,
    { variables: { cityId: address?.cityId }, skip },
  );

  if (!address) return null;
  return {
    region: regions.data?.regionsByCountryId.find((r) => r.id === address.regionId)?.region,
    city: cities.data?.citiesByRegionId.find((c) => c.id === address.cityId)?.city,
    county: counties.data?.countiesByCityId.find((c) => c.id === address.countyId)?.county,
  };
}

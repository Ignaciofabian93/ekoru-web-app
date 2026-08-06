"use client";
import { useCallback, useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";

import {
  ADD_BUSINESS_ADDRESS,
  DELETE_BUSINESS_ADDRESS,
  GET_MY_BUSINESS_ADDRESSES,
  SET_PRIMARY_BUSINESS_ADDRESS,
  UPDATE_BUSINESS_ADDRESS,
} from "@/graphql/auth/business-address";
import {
  GET_CITIES_BY_REGION,
  GET_COUNTIES_BY_CITY,
  GET_COUNTRIES,
  GET_REGIONS_BY_COUNTRY,
} from "@/graphql/location/queries";
import { useTranslation } from "@/i18n/context";
import { useToast } from "@/hooks/useToast";
import type { City, Country, County, Region } from "@/types/location";
import type { BusinessAddress } from "@/types/user";
import { NAMESPACE } from "../i18n";

/** The add/edit form for a single business location (`id: null` = new). */
export interface AddressForm {
  id: number | null;
  label: string;
  address: string;
  reference: string;
  zipCode: string;
  phone: string;
  countryId: number | null;
  regionId: number | null;
  cityId: number | null;
  countyId: number | null;
  isPrimary: boolean;
}

const EMPTY_FORM: AddressForm = {
  id: null,
  label: "",
  address: "",
  reference: "",
  zipCode: "",
  phone: "",
  countryId: null,
  regionId: null,
  cityId: null,
  countyId: null,
  isPrimary: false,
};

export function useBusinessAddresses() {
  const { t } = useTranslation(NAMESPACE);
  const toast = useToast();

  const { data, loading, refetch } = useQuery<{
    me: { profile?: { addresses?: BusinessAddress[] } | null } | null;
  }>(GET_MY_BUSINESS_ADDRESSES, { fetchPolicy: "cache-and-network" });
  const addresses = useMemo(
    () => data?.me?.profile?.addresses ?? [],
    [data],
  );

  // null = list view; an object = the add/edit form is open.
  const [editing, setEditing] = useState<AddressForm | null>(null);

  const startAdd = useCallback(() => setEditing({ ...EMPTY_FORM }), []);
  const startEdit = useCallback(
    (a: BusinessAddress) =>
      setEditing({
        id: a.id,
        label: a.label ?? "",
        address: a.address,
        reference: a.reference ?? "",
        zipCode: a.zipCode ?? "",
        phone: a.phone ?? "",
        countryId: a.country?.id ?? null,
        regionId: a.region?.id ?? null,
        cityId: a.city?.id ?? null,
        countyId: a.county?.id ?? null,
        isPrimary: a.isPrimary,
      }),
    [],
  );
  const cancel = useCallback(() => setEditing(null), []);
  const setField = useCallback(
    <K extends keyof AddressForm>(key: K, value: AddressForm[K]) =>
      setEditing((prev) => (prev ? { ...prev, [key]: value } : prev)),
    [],
  );

  // ── Location cascade (scoped to the open form) ───────────────────────
  const { data: countriesData } = useQuery<{ countries: Country[] }>(
    GET_COUNTRIES,
    { fetchPolicy: "cache-first" },
  );
  const countries = useMemo(
    () => countriesData?.countries ?? [],
    [countriesData],
  );

  const { data: regionsData } = useQuery<{ regionsByCountryId: Region[] }>(
    GET_REGIONS_BY_COUNTRY,
    {
      variables: { countryId: editing?.countryId },
      skip: !editing?.countryId,
      fetchPolicy: "cache-first",
    },
  );
  const regions = useMemo(
    () => regionsData?.regionsByCountryId ?? [],
    [regionsData],
  );

  const { data: citiesData } = useQuery<{ citiesByRegionId: City[] }>(
    GET_CITIES_BY_REGION,
    {
      variables: { regionId: editing?.regionId },
      skip: !editing?.regionId,
      fetchPolicy: "cache-first",
    },
  );
  const cities = useMemo(() => citiesData?.citiesByRegionId ?? [], [citiesData]);

  const { data: countiesData } = useQuery<{ countiesByCityId: County[] }>(
    GET_COUNTIES_BY_CITY,
    {
      variables: { cityId: editing?.cityId },
      skip: !editing?.cityId,
      fetchPolicy: "cache-first",
    },
  );
  const counties = useMemo(
    () => countiesData?.countiesByCityId ?? [],
    [countiesData],
  );

  const setCountry = useCallback(
    (countryId: number) =>
      setEditing((prev) =>
        prev
          ? { ...prev, countryId, regionId: null, cityId: null, countyId: null }
          : prev,
      ),
    [],
  );
  const setRegion = useCallback(
    (regionId: number) =>
      setEditing((prev) =>
        prev ? { ...prev, regionId, cityId: null, countyId: null } : prev,
      ),
    [],
  );
  const setCity = useCallback(
    (cityId: number) =>
      setEditing((prev) => (prev ? { ...prev, cityId, countyId: null } : prev)),
    [],
  );
  const setCounty = useCallback(
    (countyId: number) =>
      setEditing((prev) => (prev ? { ...prev, countyId } : prev)),
    [],
  );

  // ── Mutations ────────────────────────────────────────────────────────
  const [addAddr, { loading: adding }] = useMutation(ADD_BUSINESS_ADDRESS);
  const [updateAddr, { loading: updating }] = useMutation(
    UPDATE_BUSINESS_ADDRESS,
  );
  const [deleteAddr] = useMutation(DELETE_BUSINESS_ADDRESS);
  const [setPrimaryAddr] = useMutation(SET_PRIMARY_BUSINESS_ADDRESS);

  const saving = adding || updating;

  const save = useCallback(async () => {
    if (!editing) return;
    if (!editing.address.trim()) {
      toast.error(t("editProfile.locations.error"));
      return;
    }
    const base = {
      label: editing.label || undefined,
      address: editing.address,
      reference: editing.reference || undefined,
      zipCode: editing.zipCode || undefined,
      phone: editing.phone || undefined,
      countryId: editing.countryId ?? undefined,
      regionId: editing.regionId ?? undefined,
      cityId: editing.cityId ?? undefined,
      countyId: editing.countyId ?? undefined,
      isPrimary: editing.isPrimary,
    };
    try {
      if (editing.id === null) {
        await addAddr({ variables: { input: base } });
      } else {
        await updateAddr({ variables: { input: { id: editing.id, ...base } } });
      }
      await refetch();
      setEditing(null);
      toast.success(t("editProfile.locations.savedSuccess"));
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : t("editProfile.locations.error"),
      );
    }
  }, [editing, addAddr, updateAddr, refetch, toast, t]);

  const remove = useCallback(
    async (id: number) => {
      try {
        await deleteAddr({ variables: { id } });
        await refetch();
        toast.success(t("editProfile.locations.deletedSuccess"));
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : t("editProfile.locations.error"),
        );
      }
    },
    [deleteAddr, refetch, toast, t],
  );

  const setPrimary = useCallback(
    async (id: number) => {
      try {
        await setPrimaryAddr({ variables: { id } });
        await refetch();
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : t("editProfile.locations.error"),
        );
      }
    },
    [setPrimaryAddr, refetch, toast, t],
  );

  return {
    addresses,
    loading,
    editing,
    startAdd,
    startEdit,
    cancel,
    setField,
    countries,
    regions,
    cities,
    counties,
    setCountry,
    setRegion,
    setCity,
    setCounty,
    save,
    remove,
    setPrimary,
    saving,
  };
}

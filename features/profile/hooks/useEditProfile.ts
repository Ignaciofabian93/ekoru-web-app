"use client";
import { useCallback, useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  UPDATE_BUSINESS_PROFILE,
  UPDATE_PERSON_PROFILE,
  UPDATE_SELLER,
} from "@/graphql/auth/profile";
import {
  GET_CITIES_BY_REGION,
  GET_COUNTIES_BY_CITY,
  GET_COUNTRIES,
  GET_REGIONS_BY_COUNTRY,
} from "@/graphql/location/queries";
import { useTranslation } from "@/i18n/context";
import { useToast } from "@/hooks/useToast";
import useAuthStore, {
  useBusinessProfile,
  usePersonProfile,
  useSeller,
} from "@/store/useAuthStore";
import type { City, Country, County, Region } from "@/types/location";
import {
  findPhoneCodeByCountryName,
  PHONE_CODES,
  splitPhone,
} from "../constants/phoneCodes";
import { NAMESPACE } from "../i18n";

export interface EditProfileForm {
  // Person
  firstName: string;
  lastName: string;
  displayName: string;
  bio: string;
  // Business
  businessName: string;
  description: string;
  // Shared contact
  phoneDial: string;
  phoneLocal: string;
  website: string;
  // Location
  countryId: number | null;
  regionId: number | null;
  cityId: number | null;
  countyId: number | null;
  address: string;
}

export function useEditProfile() {
  const { t } = useTranslation(NAMESPACE);
  const toast = useToast();
  const seller = useSeller();
  const personProfile = usePersonProfile();
  const businessProfile = useBusinessProfile();
  const setSeller = useAuthStore((s) => s.setSeller);
  const isBusiness = seller?.sellerType !== "PERSON";

  const [form, setForm] = useState<EditProfileForm>(() => {
    const { dial, local } = splitPhone(seller?.phone);
    return {
      firstName: personProfile?.firstName ?? "",
      lastName: personProfile?.lastName ?? "",
      displayName: personProfile?.displayName ?? "",
      bio: personProfile?.bio ?? "",
      businessName: businessProfile?.businessName ?? "",
      description: businessProfile?.description ?? "",
      phoneDial: dial || findPhoneCodeByCountryName(seller?.country?.country)?.dial || "",
      phoneLocal: local,
      website: seller?.website ?? "",
      countryId: seller?.countryId ?? null,
      regionId: seller?.regionId ?? null,
      cityId: seller?.cityId ?? null,
      countyId: seller?.countyId ?? null,
      address: seller?.address ?? "",
    };
  });

  const setField = useCallback(
    <K extends keyof EditProfileForm>(key: K, value: EditProfileForm[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  // ── Countries ────────────────────────────────────────────────────
  const { data: countriesData } = useQuery<{ countries: Country[] }>(GET_COUNTRIES, {
    fetchPolicy: "cache-first",
  });
  const countries = useMemo(() => countriesData?.countries ?? [], [countriesData]);

  // ── Regions cascade ──────────────────────────────────────────────
  const { data: regionsData } = useQuery<{ regionsByCountryId: Region[] }>(
    GET_REGIONS_BY_COUNTRY,
    {
      variables: { countryId: form.countryId },
      skip: form.countryId === null,
      fetchPolicy: "cache-first",
    },
  );
  const regions = useMemo(() => regionsData?.regionsByCountryId ?? [], [regionsData]);

  // ── Cities cascade ───────────────────────────────────────────────
  const { data: citiesData } = useQuery<{ citiesByRegionId: City[] }>(
    GET_CITIES_BY_REGION,
    {
      variables: { regionId: form.regionId },
      skip: form.regionId === null,
      fetchPolicy: "cache-first",
    },
  );
  const cities = useMemo(() => citiesData?.citiesByRegionId ?? [], [citiesData]);

  // ── Counties cascade ─────────────────────────────────────────────
  const { data: countiesData } = useQuery<{ countiesByCityId: County[] }>(
    GET_COUNTIES_BY_CITY,
    {
      variables: { cityId: form.cityId },
      skip: form.cityId === null,
      fetchPolicy: "cache-first",
    },
  );
  const counties = useMemo(() => countiesData?.countiesByCityId ?? [], [countiesData]);

  // When the user picks a country we also reset the location cascade and try
  // to derive the matching phone dial prefix. This keeps the phone area code
  // in sync with the country without an effect.
  const setCountry = useCallback(
    (countryId: number) => {
      const country = countries.find((c) => c.id === countryId);
      const dial = findPhoneCodeByCountryName(country?.country)?.dial;
      setForm((prev) => ({
        ...prev,
        countryId,
        regionId: null,
        cityId: null,
        countyId: null,
        phoneDial: dial ?? prev.phoneDial,
      }));
    },
    [countries],
  );

  const setRegion = useCallback((regionId: number) => {
    setForm((prev) => ({ ...prev, regionId, cityId: null, countyId: null }));
  }, []);

  const setCity = useCallback((cityId: number) => {
    setForm((prev) => ({ ...prev, cityId, countyId: null }));
  }, []);

  const setCounty = useCallback((countyId: number) => {
    setForm((prev) => ({ ...prev, countyId }));
  }, []);

  // ── Mutations ────────────────────────────────────────────────────
  const [updateSeller, { loading: sellerLoading }] = useMutation(UPDATE_SELLER);
  const [updatePersonProfile, { loading: personLoading }] =
    useMutation(UPDATE_PERSON_PROFILE);
  const [updateBusinessProfile, { loading: businessLoading }] = useMutation(
    UPDATE_BUSINESS_PROFILE,
  );

  const loading = sellerLoading || personLoading || businessLoading;

  const handleSave = useCallback(async () => {
    if (!seller) return;
    const phone = form.phoneLocal
      ? `+${form.phoneDial}${form.phoneLocal.replace(/\D/g, "")}`
      : "";

    try {
      const sellerInput = {
        id: seller.id,
        phone: phone || undefined,
        website: form.website || undefined,
        address: form.address || undefined,
        countryId: form.countryId ?? undefined,
        regionId: form.regionId ?? undefined,
        cityId: form.cityId ?? undefined,
        countyId: form.countyId ?? undefined,
      };

      await updateSeller({ variables: { input: sellerInput } });

      if (isBusiness && businessProfile) {
        await updateBusinessProfile({
          variables: {
            input: {
              id: businessProfile.id,
              businessName: form.businessName,
              description: form.description,
            },
          },
        });
      } else if (personProfile) {
        await updatePersonProfile({
          variables: {
            input: {
              id: personProfile.id,
              firstName: form.firstName,
              lastName: form.lastName,
              displayName: form.displayName,
              bio: form.bio,
            },
          },
        });
      }

      // Optimistic local cache update — keeps UI in sync without a full refetch.
      if (personProfile && !isBusiness) {
        setSeller({
          ...seller,
          phone,
          website: form.website,
          address: form.address,
          countryId: form.countryId ?? undefined,
          regionId: form.regionId ?? undefined,
          cityId: form.cityId ?? undefined,
          countyId: form.countyId ?? undefined,
          profile: {
            ...personProfile,
            firstName: form.firstName,
            lastName: form.lastName,
            displayName: form.displayName,
            bio: form.bio,
          },
        });
      } else if (businessProfile && isBusiness) {
        setSeller({
          ...seller,
          phone,
          website: form.website,
          address: form.address,
          countryId: form.countryId ?? undefined,
          regionId: form.regionId ?? undefined,
          cityId: form.cityId ?? undefined,
          countyId: form.countyId ?? undefined,
          profile: {
            ...businessProfile,
            businessName: form.businessName,
            description: form.description,
          },
        });
      }

      toast.success(t("editProfile.feedback.success"));
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : t("editProfile.feedback.error"),
      );
    }
  }, [
    seller,
    personProfile,
    businessProfile,
    isBusiness,
    form,
    updateSeller,
    updatePersonProfile,
    updateBusinessProfile,
    setSeller,
    toast,
    t,
  ]);

  return {
    isBusiness,
    form,
    setField,
    countries,
    regions,
    cities,
    counties,
    phoneCodes: PHONE_CODES,
    setCountry,
    setRegion,
    setCity,
    setCounty,
    loading,
    handleSave,
  };
}

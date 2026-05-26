"use client";
import { useQuery } from "@apollo/client/react";
import { useEffect, useMemo } from "react";

import Input from "@/components/Input/Input";
import { Select, type Option } from "@/components/Select/Select";
import { Title } from "@/components/Title/Title";
import {
  GET_CITIES_BY_REGION,
  GET_COUNTIES_BY_CITY,
  GET_COUNTRIES,
  GET_REGIONS_BY_COUNTRY,
} from "@/graphql/location/queries";
import { useTranslation } from "@/i18n/context";
import type { City, Country, County, Region } from "@/types/location";
import type { ShippingAddressInput } from "@/types/checkout";

type Props = {
  value: Partial<ShippingAddressInput>;
  onChange: <K extends keyof ShippingAddressInput>(
    key: K,
    value: ShippingAddressInput[K] | undefined,
  ) => void;
};

export function ShippingAddressForm({ value, onChange }: Props) {
  const { t } = useTranslation("cart");

  const { data: countriesData } = useQuery<{ countries: Country[] }>(GET_COUNTRIES);
  const { data: regionsData } = useQuery<{ regionsByCountryId: Region[] }>(
    GET_REGIONS_BY_COUNTRY,
    {
      variables: { countryId: value.countryId },
      skip: !value.countryId,
    },
  );
  const { data: citiesData } = useQuery<{ citiesByRegionId: City[] }>(GET_CITIES_BY_REGION, {
    variables: { regionId: value.regionId },
    skip: !value.regionId,
  });
  const { data: countiesData } = useQuery<{ countiesByCityId: County[] }>(
    GET_COUNTIES_BY_CITY,
    {
      variables: { cityId: value.cityId },
      skip: !value.cityId,
    },
  );

  const countries = useMemo<Country[]>(
    () => countriesData?.countries ?? [],
    [countriesData],
  );
  const regions = useMemo<Region[]>(
    () => regionsData?.regionsByCountryId ?? [],
    [regionsData],
  );
  const cities = useMemo<City[]>(
    () => citiesData?.citiesByRegionId ?? [],
    [citiesData],
  );
  const counties = useMemo<County[]>(
    () => countiesData?.countiesByCityId ?? [],
    [countiesData],
  );

  // Default to Chile when we can identify it (single country, or named match).
  useEffect(() => {
    if (value.countryId || countries.length === 0) return;
    const chile = countries.find((c) => c.country.toLowerCase() === "chile") ?? countries[0];
    if (chile) onChange("countryId", chile.id);
  }, [countries, value.countryId, onChange]);

  const countryOptions: Option[] = useMemo(
    () => countries.map((c) => ({ value: c.id, label: c.country })),
    [countries],
  );
  const regionOptions: Option[] = useMemo(
    () => regions.map((r) => ({ value: r.id, label: r.region })),
    [regions],
  );
  const cityOptions: Option[] = useMemo(
    () => cities.map((c) => ({ value: c.id, label: c.city })),
    [cities],
  );
  const countyOptions: Option[] = useMemo(
    () => counties.map((c) => ({ value: c.id, label: c.county })),
    [counties],
  );

  return (
    <section
      aria-label={t("a11y.checkoutForm")}
      className="flex flex-col gap-3"
    >
      <Title level="h3" size="h5" weight="semibold">
        {t("checkout.shipping.addressTitle")}
      </Title>

      <Input
        label={t("checkout.shipping.form.recipientName")}
        value={value.recipientName ?? ""}
        onChangeText={(v) => onChange("recipientName", v)}
        maxLength={120}
        required
      />

      <Input
        label={t("checkout.shipping.form.phone")}
        placeholder={t("checkout.shipping.form.phonePlaceholder")}
        value={value.phone ?? ""}
        onChangeText={(v) => onChange("phone", v)}
        maxLength={20}
        required
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Select
          label={t("checkout.shipping.form.country")}
          options={countryOptions}
          value={value.countryId}
          onChange={(v) => {
            onChange("countryId", Number(v));
            onChange("regionId", undefined);
            onChange("cityId", undefined);
            onChange("countyId", undefined);
          }}
        />
        <Select
          label={t("checkout.shipping.form.region")}
          options={regionOptions}
          value={value.regionId}
          disabled={!value.countryId}
          onChange={(v) => {
            onChange("regionId", Number(v));
            onChange("cityId", undefined);
            onChange("countyId", undefined);
          }}
        />
        <Select
          label={t("checkout.shipping.form.city")}
          options={cityOptions}
          value={value.cityId}
          disabled={!value.regionId}
          onChange={(v) => {
            onChange("cityId", Number(v));
            onChange("countyId", undefined);
          }}
        />
        <Select
          label={t("checkout.shipping.form.county")}
          options={countyOptions}
          value={value.countyId}
          disabled={!value.cityId}
          onChange={(v) => onChange("countyId", Number(v))}
        />
      </div>

      <Input
        label={t("checkout.shipping.form.address")}
        placeholder={t("checkout.shipping.form.addressPlaceholder")}
        value={value.street ?? ""}
        onChangeText={(v) => onChange("street", v)}
        maxLength={200}
        required
      />

      <Input
        label={t("checkout.shipping.form.addressReference")}
        placeholder={t("checkout.shipping.form.addressReferencePlaceholder")}
        value={value.reference ?? ""}
        onChangeText={(v) => onChange("reference", v)}
        maxLength={200}
      />

      <Input
        label={t("checkout.shipping.form.zipCode")}
        value={value.zipCode ?? ""}
        onChangeText={(v) => onChange("zipCode", v)}
        maxLength={20}
      />
    </section>
  );
}

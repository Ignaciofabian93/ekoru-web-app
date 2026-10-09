"use client";
import { useQuery } from "@apollo/client/react";
import { useEffect, useMemo } from "react";

import { Input } from "@/components/Primitives/Inputs";
import { Select, type Option } from "@/components/Primitives/Select";
import {
  GET_CITIES_BY_REGION,
  GET_COUNTIES_BY_CITY,
  GET_COUNTRIES,
  GET_REGIONS_BY_COUNTRY,
} from "@/graphql/location/queries";
import { useTranslation } from "@/i18n/context";
import type { City, Country, County, Region } from "@/types/location";

import type { EventDraft, EventLocationType } from "../hooks/useCommunityEvents";
import { NAMESPACE } from "../i18n";

type Props = {
  draft: EventDraft;
  onChange: <K extends keyof EventDraft>(key: K, value: EventDraft[K]) => void;
};

const MODES: EventLocationType[] = ["IN_PERSON", "ONLINE", "HYBRID"];

/**
 * Where the event happens. In person (and hybrid) asks for the comuna through
 * the same country → region → city → comuna cascade checkout uses, plus a
 * street address; online (and hybrid) asks for the join link.
 */
export function EventLocationFields({ draft, onChange }: Props) {
  const { t } = useTranslation(NAMESPACE);
  const needsPlace = draft.locationType !== "ONLINE";
  const needsLink = draft.locationType !== "IN_PERSON";

  const { data: countriesData } = useQuery<{ countries: Country[] }>(GET_COUNTRIES, {
    skip: !needsPlace,
  });
  const { data: regionsData } = useQuery<{ regionsByCountryId: Region[] }>(
    GET_REGIONS_BY_COUNTRY,
    { variables: { countryId: draft.countryId }, skip: !needsPlace || !draft.countryId },
  );
  const { data: citiesData } = useQuery<{ citiesByRegionId: City[] }>(GET_CITIES_BY_REGION, {
    variables: { regionId: draft.regionId },
    skip: !needsPlace || !draft.regionId,
  });
  const { data: countiesData } = useQuery<{ countiesByCityId: County[] }>(
    GET_COUNTIES_BY_CITY,
    { variables: { cityId: draft.cityId }, skip: !needsPlace || !draft.cityId },
  );

  const countries = useMemo(() => countriesData?.countries ?? [], [countriesData]);

  // Default to Chile, like checkout: the country select is rarely touched.
  useEffect(() => {
    if (draft.countryId || countries.length === 0) return;
    const chile = countries.find((c) => c.country.toLowerCase() === "chile") ?? countries[0];
    if (chile) onChange("countryId", chile.id);
  }, [countries, draft.countryId, onChange]);

  const modeOptions: Option[] = MODES.map((mode) => ({
    value: mode,
    label: t(`events.location.modes.${mode}`),
  }));
  const regionOptions: Option[] = (regionsData?.regionsByCountryId ?? []).map((r) => ({
    value: r.id,
    label: r.region,
  }));
  const cityOptions: Option[] = (citiesData?.citiesByRegionId ?? []).map((c) => ({
    value: c.id,
    label: c.city,
  }));
  const countyOptions: Option[] = (countiesData?.countiesByCityId ?? []).map((c) => ({
    value: c.id,
    label: c.county,
  }));

  return (
    <fieldset className="flex flex-col gap-3">
      <Select
        label={t("events.location.mode")}
        options={modeOptions}
        value={draft.locationType}
        onChange={(v) => onChange("locationType", v as EventLocationType)}
      />

      {needsPlace && (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Select
              label={t("events.location.region")}
              options={regionOptions}
              value={draft.regionId}
              disabled={!draft.countryId}
              onChange={(v) => {
                onChange("regionId", Number(v));
                onChange("cityId", undefined);
                onChange("countyId", undefined);
              }}
            />
            <Select
              label={t("events.location.city")}
              options={cityOptions}
              value={draft.cityId}
              disabled={!draft.regionId}
              onChange={(v) => {
                onChange("cityId", Number(v));
                onChange("countyId", undefined);
              }}
            />
            <Select
              label={t("events.location.county")}
              options={countyOptions}
              value={draft.countyId}
              disabled={!draft.cityId}
              onChange={(v) => onChange("countyId", Number(v))}
            />
          </div>
          <Input
            name="eventAddress"
            label={t("events.location.address")}
            placeholder={t("events.location.addressPlaceholder")}
            value={draft.address}
            onChangeText={(v) => onChange("address", v)}
            maxLength={300}
            required
          />
        </>
      )}

      {needsLink && (
        <Input
          name="eventOnlineUrl"
          label={t("events.location.onlineUrl")}
          placeholder="https://…"
          value={draft.onlineUrl}
          onChangeText={(v) => onChange("onlineUrl", v)}
          maxLength={500}
          required
        />
      )}
    </fieldset>
  );
}

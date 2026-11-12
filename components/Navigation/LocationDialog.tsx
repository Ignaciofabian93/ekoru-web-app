"use client";
import { useQuery } from "@apollo/client/react";
import { LocateFixed } from "lucide-react";
import { useMemo, useState } from "react";
import { Modal } from "@/components/Overlays/Modal";
import { Button } from "@/components/Primitives/Button";
import { Select, type Option } from "@/components/Primitives/Select";
import { COUNTRIES_AVAILABLE } from "@/constants/settings";
import {
  GET_CITIES_BY_REGION,
  GET_COUNTIES_BY_CITY,
  GET_COUNTRIES,
  GET_REGIONS_BY_COUNTRY,
} from "@/graphql/location/queries";
import { useCountry } from "@/hooks/useCountry";
import { useExploreLocation } from "@/hooks/useExploreLocation";
import { useTranslation } from "@/i18n/context";
import type { City, Country, County, Region } from "@/types/location";
import { NAMESPACE } from "./i18n";
import type { ComunaDetectionStatus } from "./hooks/useComunaDetection";

/**
 * "Where are you exploring from?" — use my location, or pick the comuna from
 * the region → city → comuna cascade, the only way forward once the location
 * permission is denied. Opened by the header's picker and by the home page's
 * "near you" prompt; each owns its `useComunaDetection` and passes it in.
 */
export function LocationDialog({
  isOpen,
  onClose,
  status,
  onDetect,
}: {
  isOpen: boolean;
  onClose: () => void;
  status: ComunaDetectionStatus;
  onDetect: () => void;
}) {
  const { t } = useTranslation(NAMESPACE);
  const [location, setLocation] = useExploreLocation();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t("location.dialogTitle")}
      closeLabel={t("location.close")}
      size="sm"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Button
            text={t("location.useMyLocation")}
            variant="outline"
            leftIcon={LocateFixed}
            loading={status === "locating"}
            fullWidth
            onPress={onDetect}
          />
          {/* Always rendered (and never display:none) so the live region
              exists before it has news; empty, it takes no height. */}
          <p role="status" className="font-sans text-sm text-foreground-secondary">
            {locationStatusMessage(status, location?.county, t)}
          </p>
        </div>

        <div
          aria-hidden
          className="flex items-center gap-3 font-sans text-xs font-semibold tracking-wide text-foreground-tertiary uppercase"
        >
          <span className="h-px flex-1 bg-border-light" />
          {t("location.orChoose")}
          <span className="h-px flex-1 bg-border-light" />
        </div>

        {/* Mounted only while open, so the location queries never run for
            visitors who don't open the dialog. */}
        {isOpen && (
          <ComunaFields
            onSelect={(county) => {
              setLocation({ ...county, source: "manual" });
              onClose();
            }}
          />
        )}
      </div>
    </Modal>
  );
}

/** What to announce for a detection status, from the navigation namespace. */
export function locationStatusMessage(
  status: ComunaDetectionStatus,
  county: string | undefined,
  t: (key: string, vars?: Record<string, string>) => string,
): string {
  switch (status) {
    case "locating":
      return t("location.status.locating");
    case "detected":
      return county ? t("location.status.detected", { county }) : "";
    case "denied":
      return t("location.status.denied");
    case "unsupported":
      return t("location.status.unsupported");
    case "error":
      return t("location.status.error");
    default:
      return "";
  }
}

/**
 * The region → city → comuna cascade checkout and community events use, for
 * the visitor's market.
 */
function ComunaFields({
  onSelect,
}: {
  onSelect: (county: { county: string; countyId: number }) => void;
}) {
  const { t } = useTranslation(NAMESPACE);
  const [country] = useCountry();
  const [regionId, setRegionId] = useState<number>();
  const [cityId, setCityId] = useState<number>();

  const { data: countriesData } = useQuery<{ countries: Country[] }>(GET_COUNTRIES);

  // The location API names countries rather than coding them, so the market's
  // ISO code is matched by name, falling back to Chile like checkout does.
  const countryId = useMemo(() => {
    const countries = countriesData?.countries ?? [];
    const byName = (name?: string) =>
      countries.find((c) => c.country.toLowerCase() === name?.toLowerCase());
    const marketName = COUNTRIES_AVAILABLE.find((c) => c.code === country)?.name;
    return (byName(marketName) ?? byName("Chile") ?? countries[0])?.id;
  }, [countriesData, country]);

  const { data: regionsData } = useQuery<{ regionsByCountryId: Region[] }>(
    GET_REGIONS_BY_COUNTRY,
    { variables: { countryId }, skip: !countryId },
  );
  const { data: citiesData } = useQuery<{ citiesByRegionId: City[] }>(
    GET_CITIES_BY_REGION,
    { variables: { regionId }, skip: !regionId },
  );
  const { data: countiesData } = useQuery<{ countiesByCityId: County[] }>(
    GET_COUNTIES_BY_CITY,
    { variables: { cityId }, skip: !cityId },
  );

  const counties = countiesData?.countiesByCityId ?? [];
  const regionOptions: Option[] = (regionsData?.regionsByCountryId ?? []).map((r) => ({
    value: r.id,
    label: r.region,
  }));
  const cityOptions: Option[] = (citiesData?.citiesByRegionId ?? []).map((c) => ({
    value: c.id,
    label: c.city,
  }));
  const countyOptions: Option[] = counties.map((c) => ({ value: c.id, label: c.county }));

  const selectCopy = {
    placeholder: t("location.selectPlaceholder"),
    searchLabel: t("location.searchOptions"),
    searchPlaceholder: t("location.searchOptions"),
    noResultsText: t("location.noResults"),
  };

  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="sr-only">{t("location.orChoose")}</legend>
      <Select
        {...selectCopy}
        label={t("location.region")}
        options={regionOptions}
        value={regionId}
        disabled={!countryId}
        onChange={(v) => {
          setRegionId(Number(v));
          setCityId(undefined);
        }}
      />
      <Select
        {...selectCopy}
        label={t("location.city")}
        options={cityOptions}
        value={cityId}
        disabled={!regionId}
        onChange={(v) => setCityId(Number(v))}
      />
      <Select
        {...selectCopy}
        label={t("location.county")}
        options={countyOptions}
        disabled={!cityId}
        onChange={(v) => {
          const county = counties.find((c) => c.id === Number(v));
          if (county) onSelect({ county: county.county, countyId: county.id });
        }}
      />
    </fieldset>
  );
}

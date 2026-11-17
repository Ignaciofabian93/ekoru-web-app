"use client";
import { RadiusPicker as SharedRadiusPicker } from "@/components/Patterns/RadiusPicker";
import { EXPLORE_RADIUS_OPTIONS_KM, type ExploreRadiusKm } from "@/constants/settings";
import { useTranslation } from "@/i18n/context";
import { NAMESPACE } from "../i18n";

/** How far "near you" reaches. The shared picker with home's distances and copy. */
export function RadiusPicker({
  value,
  onChange,
}: {
  value: ExploreRadiusKm;
  onChange: (km: ExploreRadiusKm) => void;
}) {
  const { t } = useTranslation(NAMESPACE);

  return (
    <SharedRadiusPicker
      options={EXPLORE_RADIUS_OPTIONS_KM}
      value={value}
      onChange={onChange}
      label={t("nearby.radiusLabel")}
      formatOption={(km) => t("nearby.radiusOption", { km: String(km) })}
    />
  );
}

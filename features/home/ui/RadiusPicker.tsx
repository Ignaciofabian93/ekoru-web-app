"use client";
import clsx from "clsx";
import { useId } from "react";
import { EXPLORE_RADIUS_OPTIONS_KM, type ExploreRadiusKm } from "@/constants/settings";
import { useTranslation } from "@/i18n/context";
import { NAMESPACE } from "../i18n";

/**
 * How far "near you" reaches, as a row of chips. Native radios underneath, so
 * the group is one tab stop and the arrow keys move between distances.
 */
export function RadiusPicker({
  value,
  onChange,
}: {
  value: ExploreRadiusKm;
  onChange: (km: ExploreRadiusKm) => void;
}) {
  const { t } = useTranslation(NAMESPACE);
  const name = useId();

  return (
    <fieldset className="flex min-w-0 flex-wrap items-center gap-2">
      <legend className="sr-only">{t("nearby.radiusLabel")}</legend>
      <span aria-hidden className="mr-1 font-sans text-sm text-foreground-secondary">
        {t("nearby.radiusLabel")}
      </span>
      {EXPLORE_RADIUS_OPTIONS_KM.map((km) => {
        const checked = km === value;
        return (
          <label
            key={km}
            className={clsx(
              "cursor-pointer rounded-full border px-3 py-1 font-sans text-sm",
              "transition-colors duration-150",
              "has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-primary has-[input:focus-visible]:ring-offset-1",
              checked
                ? "border-primary bg-primary font-semibold text-on-primary"
                : "border-border-light bg-white text-foreground-secondary hover:bg-background-tertiary",
            )}
          >
            <input
              type="radio"
              name={name}
              value={km}
              checked={checked}
              onChange={() => onChange(km)}
              className="sr-only"
            />
            {t("nearby.radiusOption", { km: String(km) })}
          </label>
        );
      })}
    </fieldset>
  );
}

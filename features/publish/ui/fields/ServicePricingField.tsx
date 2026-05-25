"use client";
import { Select } from "@/components/Select/Select";
import { useTranslation } from "@/i18n/context";
import type { ServicePricing } from "@/types/enums";

import { SERVICE_PRICING_OPTIONS } from "../../constants/options";

export function ServicePricingField({
  value,
  onChange,
  invalid,
}: {
  value: ServicePricing | "";
  onChange: (value: ServicePricing | "") => void;
  invalid?: boolean;
}) {
  const { t } = useTranslation("publish");

  const options = SERVICE_PRICING_OPTIONS.map((c) => ({
    value: c.value,
    label: t(c.labelKey),
  }));

  return (
    <Select
      label={t("form.servicePricing")}
      placeholder={t("form.servicePricingPlaceholder")}
      options={options}
      value={value || undefined}
      onChange={(v) => onChange(v as ServicePricing)}
      searchEnabled={false}
      errorMessage={invalid ? t("feedback.fieldsRequired") : undefined}
    />
  );
}

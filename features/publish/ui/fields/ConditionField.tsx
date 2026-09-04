"use client";
import { Select } from "@/components/Primitives/Select";
import { useTranslation } from "@/i18n/context";
import type { ProductCondition } from "@/types/enums";

import { CONDITION_OPTIONS } from "../../constants/options";
import { NAMESPACE as CARDS_NAMESPACE } from "@/components/Cards/i18n";

export function ConditionField({
  value,
  onChange,
  invalid,
}: {
  value: ProductCondition | "";
  onChange: (value: ProductCondition | "") => void;
  invalid?: boolean;
}) {
  const { t } = useTranslation("publish");
  // Same dictionary the buyer's badge reads, so the seller picks the exact
  // wording that will appear on the listing.
  const { t: tCondition } = useTranslation(CARDS_NAMESPACE);

  const options = CONDITION_OPTIONS.map((value) => ({
    value,
    label: tCondition(`condition.${value}`),
  }));

  return (
    <Select
      label={t("form.condition")}
      placeholder={t("form.conditionPlaceholder")}
      options={options}
      value={value || undefined}
      onChange={(v) => onChange(v as ProductCondition)}
      searchEnabled={false}
      errorMessage={invalid ? t("feedback.fieldsRequired") : undefined}
    />
  );
}

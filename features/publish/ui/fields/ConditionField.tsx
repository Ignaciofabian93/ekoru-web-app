"use client";
import { Select } from "@/components/Primitives/Select";
import { useTranslation } from "@/i18n/context";
import type { ProductCondition } from "@/types/enums";

import { CONDITION_OPTIONS } from "../../constants/options";

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

  const options = CONDITION_OPTIONS.map((c) => ({
    value: c.value,
    label: t(c.labelKey),
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

"use client";
import Input from "@/components/Input/Input";
import { Select } from "@/components/Select/Select";
import { useTranslation } from "@/i18n/context";
import type { WeightUnit } from "@/types/enums";

import { WEIGHT_UNIT_OPTIONS } from "../../constants/options";

/** Optional shipping weight + unit for a store product. */
export function WeightField({
  value,
  unit,
  onChangeValue,
  onChangeUnit,
}: {
  value: string;
  unit: WeightUnit | "";
  onChangeValue: (value: string) => void;
  onChangeUnit: (unit: WeightUnit) => void;
}) {
  const { t } = useTranslation("publish");

  const options = WEIGHT_UNIT_OPTIONS.map((o) => ({
    value: o.value,
    label: t(o.labelKey),
  }));

  return (
    <div className="flex items-end gap-3">
      <div className="flex-1">
        <Input
          name="weight"
          label={t("form.weight")}
          placeholder={t("form.weightPlaceholder")}
          type="number"
          min={0}
          value={value}
          onChangeText={onChangeValue}
        />
      </div>
      <div className="w-28">
        <Select
          label={t("form.weightUnit")}
          options={options}
          value={unit || undefined}
          onChange={(v) => onChangeUnit(v as WeightUnit)}
          searchEnabled={false}
        />
      </div>
    </div>
  );
}

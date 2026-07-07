"use client";
import Input from "@/components/Input/Input";
import { Select } from "@/components/Select/Select";
import { Text } from "@/components/Text/Text";
import { useTranslation } from "@/i18n/context";
import type { DimensionUnit } from "@/types/enums";

import { DIMENSION_UNIT_OPTIONS } from "../../constants/options";

/** Optional length/width/height + unit for a store product. */
export function DimensionsField({
  length,
  width,
  height,
  unit,
  onChangeLength,
  onChangeWidth,
  onChangeHeight,
  onChangeUnit,
}: {
  length: string;
  width: string;
  height: string;
  unit: DimensionUnit | "";
  onChangeLength: (value: string) => void;
  onChangeWidth: (value: string) => void;
  onChangeHeight: (value: string) => void;
  onChangeUnit: (unit: DimensionUnit) => void;
}) {
  const { t } = useTranslation("publish");

  const options = DIMENSION_UNIT_OPTIONS.map((o) => ({
    value: o.value,
    label: t(o.labelKey),
  }));

  return (
    <div className="flex flex-col gap-1.5">
      <Text size="sm" weight="medium">
        {t("form.dimensions")}
      </Text>
      <div className="flex items-end gap-3">
        <Input
          name="length"
          placeholder={t("form.length")}
          type="number"
          min={0}
          value={length}
          onChangeText={onChangeLength}
        />
        <Input
          name="width"
          placeholder={t("form.width")}
          type="number"
          min={0}
          value={width}
          onChangeText={onChangeWidth}
        />
        <Input
          name="height"
          placeholder={t("form.height")}
          type="number"
          min={0}
          value={height}
          onChangeText={onChangeHeight}
        />
        <div className="w-28">
          <Select
            options={options}
            placeholder={t("form.unit")}
            value={unit || undefined}
            onChange={(v) => onChangeUnit(v as DimensionUnit)}
            searchEnabled={false}
          />
        </div>
      </div>
    </div>
  );
}

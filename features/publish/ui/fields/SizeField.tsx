"use client";
import { Select } from "@/components/Primitives/Select";
import { useTranslation } from "@/i18n/context";
import type { ProductSize } from "@/types/enums";

import { PRODUCT_SIZE_OPTIONS } from "../../constants/options";

/** Optional size class (XS–XL) for a store product. */
export function SizeField({
  value,
  onChange,
}: {
  value: ProductSize | "";
  onChange: (value: ProductSize) => void;
}) {
  const { t } = useTranslation("publish");

  const options = PRODUCT_SIZE_OPTIONS.map((o) => ({
    value: o.value,
    label: t(o.labelKey),
  }));

  return (
    <div className="w-44">
      <Select
        label={t("form.size")}
        options={options}
        value={value || undefined}
        onChange={(v) => onChange(v as ProductSize)}
        searchEnabled={false}
        placeholder={t("form.sizePlaceholder")}
      />
    </div>
  );
}

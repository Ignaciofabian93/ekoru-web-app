"use client";
import Input from "@/components/Input/Input";
import { Text } from "@/components/Text/Text";
import { useTranslation } from "@/i18n/context";

/** Optional low-stock alert threshold. The stores subgraph flags the product as
 *  low on stock once stock drops to this value. */
export function LowStockThresholdField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const { t } = useTranslation("publish");

  return (
    <div className="flex flex-col gap-1">
      <Input
        name="lowStockThreshold"
        label={t("form.lowStockThreshold")}
        placeholder={t("form.lowStockThresholdPlaceholder")}
        type="number"
        min={0}
        value={value}
        onChangeText={onChange}
      />
      <Text variant="small" color="tertiary">
        {t("form.lowStockThresholdHint")}
      </Text>
    </div>
  );
}

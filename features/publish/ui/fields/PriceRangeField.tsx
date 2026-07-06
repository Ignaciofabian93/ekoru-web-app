"use client";
import Input from "@/components/Input/Input";
import { Text } from "@/components/Text/Text";
import { useTranslation } from "@/i18n/context";

/** Optional free-text price range — useful for quotation and package pricing
 *  where there is no single fixed price. */
export function PriceRangeField({
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
        name="priceRange"
        label={t("form.priceRange")}
        placeholder={t("form.priceRangePlaceholder")}
        value={value}
        onChangeText={onChange}
        maxLength={60}
      />
      <Text variant="small" color="tertiary">
        {t("form.priceRangeHint")}
      </Text>
    </div>
  );
}

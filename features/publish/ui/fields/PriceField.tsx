"use client";
import { Input } from "@/components/Primitives/Inputs";
import { useTranslation } from "@/i18n/context";

export function PriceField({
  value,
  onChange,
  invalid,
}: {
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
}) {
  const { t } = useTranslation("publish");

  return (
    <Input
      name="price"
      label={t("form.price")}
      placeholder={t("form.pricePlaceholder")}
      type="number"
      value={value}
      onChangeText={onChange}
      required
      isInvalid={invalid}
      errorMessage={t("feedback.priceRequired")}
    />
  );
}

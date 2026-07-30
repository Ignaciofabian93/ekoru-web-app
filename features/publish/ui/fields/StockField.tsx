"use client";
import { Input } from "@/components/Primitives/Inputs";
import { useTranslation } from "@/i18n/context";

export function StockField({
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
      name="stock"
      label={t("form.stock")}
      placeholder={t("form.stockPlaceholder")}
      type="number"
      value={value}
      onChangeText={onChange}
      required
      isInvalid={invalid}
      errorMessage={t("feedback.fieldsRequired")}
    />
  );
}

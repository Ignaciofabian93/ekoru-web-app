"use client";
import Input from "@/components/Input/Input";
import { useTranslation } from "@/i18n/context";

export function SkuField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const { t } = useTranslation("publish");

  return (
    <Input
      name="sku"
      label={t("form.sku")}
      placeholder={t("form.skuPlaceholder")}
      value={value}
      onChangeText={onChange}
      maxLength={60}
    />
  );
}

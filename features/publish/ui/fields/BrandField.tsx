"use client";
import Input from "@/components/Input/Input";
import { useTranslation } from "@/i18n/context";

export function BrandField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const { t } = useTranslation("publish");

  return (
    <Input
      name="brand"
      label={t("form.brand")}
      placeholder={t("form.brandPlaceholder")}
      value={value}
      onChangeText={onChange}
      maxLength={60}
    />
  );
}

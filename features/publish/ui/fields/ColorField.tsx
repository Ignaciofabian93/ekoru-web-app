"use client";
import Input from "@/components/Input/Input";
import { useTranslation } from "@/i18n/context";

/** Optional free-text colour for store products (e.g. "Charcoal grey"). */
export function ColorField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const { t } = useTranslation("publish");

  return (
    <Input
      name="color"
      label={t("form.color")}
      placeholder={t("form.colorPlaceholder")}
      value={value}
      onChangeText={onChange}
      maxLength={40}
    />
  );
}

"use client";
import Input from "@/components/Input/Input";
import { useTranslation } from "@/i18n/context";

/** Optional product barcode (EAN / UPC). Shown next to the SKU field. */
export function BarcodeField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const { t } = useTranslation("publish");

  return (
    <Input
      name="barcode"
      label={t("form.barcode")}
      placeholder={t("form.barcodePlaceholder")}
      value={value}
      onChangeText={onChange}
      maxLength={60}
    />
  );
}

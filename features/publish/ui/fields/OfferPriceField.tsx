"use client";
import Input from "@/components/Input/Input";
import { useTranslation } from "@/i18n/context";

/** Discounted price shown when an offer is active. Must be below the regular
 *  price — validity is enforced in PublishForm. */
export function OfferPriceField({
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
      name="offerPrice"
      label={t("form.offerPrice")}
      placeholder={t("form.offerPricePlaceholder")}
      type="number"
      value={value}
      onChangeText={onChange}
      required
      isInvalid={invalid}
      errorMessage={t("feedback.offerPriceInvalid")}
    />
  );
}

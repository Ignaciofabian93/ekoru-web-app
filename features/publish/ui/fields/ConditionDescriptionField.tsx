"use client";
import { TextArea } from "@/components/Primitives/TextArea";
import { useTranslation } from "@/i18n/context";

/**
 * Optional notes on a second-hand item's wear — marks, repairs, missing parts.
 * Separate from the main description because buyers scan it as the honesty
 * signal on a used listing.
 */
export function ConditionDescriptionField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const { t } = useTranslation("publish");

  return (
    <TextArea
      label={t("form.conditionDescription")}
      placeholder={t("form.conditionDescriptionPlaceholder")}
      value={value}
      onChangeText={onChange}
      maxLength={500}
      rows={3}
    />
  );
}

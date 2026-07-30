"use client";
import { Input } from "@/components/Primitives/Inputs";
import { useTranslation } from "@/i18n/context";

/** Optional service duration, in minutes. */
export function DurationField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const { t } = useTranslation("publish");

  return (
    <Input
      name="duration"
      label={t("form.duration")}
      placeholder={t("form.durationPlaceholder")}
      type="number"
      value={value}
      onChangeText={onChange}
      min={0}
    />
  );
}

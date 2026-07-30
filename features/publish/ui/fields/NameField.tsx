"use client";
import { Input } from "@/components/Primitives/Inputs";
import { useTranslation } from "@/i18n/context";

export function NameField({
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
      name="name"
      label={t("form.name")}
      placeholder={t("form.namePlaceholder")}
      value={value}
      onChangeText={onChange}
      maxLength={120}
      required
      isInvalid={invalid}
      errorMessage={t("feedback.fieldsRequired")}
    />
  );
}

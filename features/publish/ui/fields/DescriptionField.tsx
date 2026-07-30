"use client";
import { Text } from "@/components/Primitives/Text";
import { TextArea } from "@/components/Primitives/TextArea";
import { useTranslation } from "@/i18n/context";

export function DescriptionField({
  value,
  onChange,
  invalid,
  minLength,
}: {
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
  minLength?: number;
}) {
  const { t } = useTranslation("publish");

  return (
    <div className="flex flex-col gap-1">
      <TextArea
        label={t("form.description")}
        placeholder={t("form.descriptionPlaceholder")}
        value={value}
        onChangeText={onChange}
        maxLength={1000}
        rows={4}
      />
      {invalid && (
        <Text variant="small" color="error">
          {minLength
            ? t("feedback.descriptionMin", { min: String(minLength) })
            : t("feedback.fieldsRequired")}
        </Text>
      )}
    </div>
  );
}

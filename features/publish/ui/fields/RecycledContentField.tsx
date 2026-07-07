"use client";
import Input from "@/components/Input/Input";
import { Text } from "@/components/Text/Text";
import { useTranslation } from "@/i18n/context";

/** Optional percentage of recycled content in the product (0–100). */
export function RecycledContentField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const { t } = useTranslation("publish");

  return (
    <div className="flex flex-col gap-1">
      <Input
        name="recycledContent"
        label={t("form.recycledContent")}
        placeholder={t("form.recycledContentPlaceholder")}
        type="number"
        min={0}
        max={100}
        value={value}
        onChangeText={onChange}
      />
      <Text variant="small" color="tertiary">
        {t("form.recycledContentHint")}
      </Text>
    </div>
  );
}

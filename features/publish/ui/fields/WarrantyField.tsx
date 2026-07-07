"use client";
import Input from "@/components/Input/Input";
import { useTranslation } from "@/i18n/context";

/** Optional warranty description + duration (months) for a store product. */
export function WarrantyField({
  value,
  duration,
  onChangeValue,
  onChangeDuration,
}: {
  value: string;
  duration: string;
  onChangeValue: (value: string) => void;
  onChangeDuration: (duration: string) => void;
}) {
  const { t } = useTranslation("publish");

  return (
    <div className="flex items-end gap-3">
      <div className="flex-1">
        <Input
          name="warranty"
          label={t("form.warranty")}
          placeholder={t("form.warrantyPlaceholder")}
          value={value}
          onChangeText={onChangeValue}
          maxLength={120}
        />
      </div>
      <div className="w-32">
        <Input
          name="warrantyDuration"
          label={t("form.warrantyDuration")}
          placeholder={t("form.warrantyDurationPlaceholder")}
          type="number"
          min={0}
          value={duration}
          onChangeText={onChangeDuration}
        />
      </div>
    </div>
  );
}

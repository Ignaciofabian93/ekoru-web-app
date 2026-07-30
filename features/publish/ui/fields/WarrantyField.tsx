"use client";
import { Input } from "@/components/Primitives/Inputs";
import { Select } from "@/components/Primitives/Select";
import { useTranslation } from "@/i18n/context";

/** Optional warranty flag (yes/no) for a store product; picking "yes" reveals
 *  the duration in months. */
export function WarrantyField({
  value,
  duration,
  onChangeValue,
  onChangeDuration,
}: {
  value: boolean | null;
  duration: string;
  onChangeValue: (value: boolean | null) => void;
  onChangeDuration: (duration: string) => void;
}) {
  const { t } = useTranslation("publish");

  const options = [
    { value: "yes", label: t("form.warrantyYes") },
    { value: "no", label: t("form.warrantyNo") },
  ];

  return (
    <div className="flex items-start gap-3">
      <div className="w-56">
        <Select
          label={t("form.warranty")}
          placeholder={t("form.warrantyPlaceholder")}
          options={options}
          value={value === null ? undefined : value ? "yes" : "no"}
          onChange={(v) => {
            const hasWarranty = v === "yes";
            onChangeValue(hasWarranty);
            if (!hasWarranty) onChangeDuration("");
          }}
          searchEnabled={false}
        />
      </div>
      {value === true && (
        <div className="w-28">
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
      )}
    </div>
  );
}

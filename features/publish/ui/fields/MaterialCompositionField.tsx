"use client";
import Input from "@/components/Input/Input";
import { Select } from "@/components/Select/Select";
import { Text } from "@/components/Text/Text";
import { useTranslation } from "@/i18n/context";
import clsx from "clsx";
import { Plus, X } from "lucide-react";

export type MaterialRow = { materialTypeId: string; percentage: string };

/** Repeatable material-composition picker: each row is a material (from the DB,
 *  translated) plus the percentage it makes up of the product. */
export function MaterialCompositionField({
  value,
  onChange,
  options,
  loading,
  invalid,
}: {
  value: MaterialRow[];
  onChange: (value: MaterialRow[]) => void;
  options: { value: string; label: string }[];
  loading: boolean;
  invalid?: boolean;
}) {
  const { t } = useTranslation("publish");

  const setRow = (index: number, patch: Partial<MaterialRow>) =>
    onChange(value.map((row, i) => (i === index ? { ...row, ...patch } : row)));

  const addRow = () => onChange([...value, { materialTypeId: "", percentage: "" }]);

  const removeRow = (index: number) =>
    onChange(
      value.length === 1
        ? [{ materialTypeId: "", percentage: "" }]
        : value.filter((_, i) => i !== index),
    );

  // Prevent picking the same material twice: hide options chosen in other rows.
  const optionsFor = (index: number) => {
    const takenElsewhere = new Set(
      value
        .filter((_, i) => i !== index)
        .map((r) => r.materialTypeId)
        .filter(Boolean),
    );
    return options.filter((o) => !takenElsewhere.has(o.value));
  };

  const total = value.reduce((sum, r) => sum + (Number(r.percentage) || 0), 0);
  const canAdd = !loading && value.length < options.length;

  return (
    <div className="flex flex-col gap-2">
      <Text size="sm" weight="medium">
        {t("form.materialComposition")}
      </Text>

      <div className="flex flex-col gap-2.5">
        {value.map((row, index) => (
          <div key={index} className="flex items-start gap-2">
            <div className="flex-1">
              <Select
                options={optionsFor(index)}
                placeholder={
                  loading ? t("form.materialLoading") : t("form.materialPlaceholder")
                }
                value={row.materialTypeId || undefined}
                onChange={(v) => setRow(index, { materialTypeId: String(v) })}
                disabled={loading}
                noResultsText={t("form.materialLoading")}
              />
            </div>
            <div className="w-24">
              <Input
                name={`materialPercentage-${index}`}
                placeholder={t("form.percentage")}
                type="number"
                min={0}
                max={100}
                value={row.percentage}
                onChangeText={(v) => setRow(index, { percentage: v })}
                aria-label={t("form.percentage")}
              />
            </div>
            <button
              type="button"
              onClick={() => removeRow(index)}
              aria-label={t("form.removeMaterial")}
              className="flex h-11 w-9 shrink-0 items-center justify-center text-foreground-tertiary transition-colors hover:text-danger"
            >
              <X size={16} color="currentColor" strokeWidth={2.5} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={addRow}
          disabled={!canAdd}
          className={clsx(
            "flex items-center gap-1.5 text-left transition-colors",
            canAdd
              ? "text-primary hover:text-primary-active"
              : "cursor-not-allowed text-foreground-tertiary opacity-50",
          )}
        >
          <Plus size={16} color="currentColor" strokeWidth={2.5} />
          <Text variant="small" color="primary">
            {t("form.addMaterial")}
          </Text>
        </button>

        {total > 0 && (
          <Text variant="small" color={invalid ? "error" : "tertiary"}>
            {t("form.materialTotal", { total: String(total) })}
          </Text>
        )}
      </div>

      <Text variant="small" color={invalid ? "error" : "tertiary"}>
        {invalid ? t("feedback.materialsInvalid") : t("form.materialCompositionHint")}
      </Text>
    </div>
  );
}

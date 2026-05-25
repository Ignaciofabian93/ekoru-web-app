"use client";
import { Text } from "@/components/Text/Text";
import { useTranslation } from "@/i18n/context";

import { CONDITION_OPTIONS, type PublishTarget } from "../../constants/options";
import type { PublishForm } from "../../hooks/usePublish";

interface ReviewStepProps {
  target: PublishTarget;
  form: PublishForm;
  categoryLabel: string;
}

export function ReviewStep({ target, form, categoryLabel }: ReviewStepProps) {
  const { t } = useTranslation("publish");

  const selectedCondition = CONDITION_OPTIONS.find((c) => c.value === form.condition);

  const rows = [
    { label: t("review.target"), value: t(`targetNames.${target}`) },
    { label: t("review.title"), value: form.name },
    target !== "SERVICE" || form.servicePricing !== "QUOTATION"
      ? { label: t("review.price"), value: form.price ? `$${form.price}` : "" }
      : null,
    target === "STORE" ? { label: t("review.stock"), value: form.stock } : null,
    target !== "MARKETPLACE"
      ? null
      : { label: t("review.condition"), value: selectedCondition ? t(selectedCondition.labelKey) : "" },
    { label: t("review.category"), value: categoryLabel },
  ].filter((row): row is { label: string; value: string } => row !== null);

  return (
    <dl className="flex flex-col divide-y divide-border-light rounded-xl border border-border-light bg-surface px-4">
      {rows.map((row) => (
        <div key={row.label} className="flex items-center justify-between gap-4 py-3">
          <dt>
            <Text variant="small" color="tertiary">
              {row.label}
            </Text>
          </dt>
          <dd className="text-right">
            <Text variant="span" weight="medium" numberOfLines={1}>
              {row.value || t("review.empty")}
            </Text>
          </dd>
        </div>
      ))}
    </dl>
  );
}

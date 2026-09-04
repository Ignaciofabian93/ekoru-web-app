"use client";
import { Text } from "@/components/Primitives/Text";
import { useTranslation } from "@/i18n/context";
import { NAMESPACE as CARDS_NAMESPACE } from "@/components/Cards/i18n";

import {
  CONDITION_OPTIONS,
  SERVICE_PRICING_OPTIONS,
  type PublishTarget,
} from "../../constants/options";
import type { PublishForm } from "../../hooks/usePublishForm";

interface ReviewStepProps {
  target: PublishTarget;
  form: PublishForm;
  categoryLabel: string;
  materialsLabel: string;
}

export function ReviewStep({
  target,
  form,
  categoryLabel,
  materialsLabel,
}: ReviewStepProps) {
  const { t } = useTranslation("publish");
  const { t: tCondition } = useTranslation(CARDS_NAMESPACE);

  const selectedCondition = CONDITION_OPTIONS.find((c) => c === form.condition);
  const selectedPricing = SERVICE_PRICING_OPTIONS.find(
    (p) => p.value === form.servicePricing,
  );
  const isService = target === "SERVICE";
  const isStore = target === "STORE";
  const isMarketplace = target === "MARKETPLACE";

  const dimensions = [form.length, form.width, form.height].every(Boolean)
    ? `${form.length} × ${form.width} × ${form.height} ${form.dimensionUnit}`.trim()
    : "";
  const weight = form.weight ? `${form.weight} ${form.weightUnit}`.trim() : "";

  const rows = [
    { label: t("review.target"), value: t(`targetNames.${target}`) },
    { label: t("review.title"), value: form.name },
    isService && selectedPricing
      ? { label: t("review.pricingType"), value: t(selectedPricing.labelKey) }
      : null,
    target !== "SERVICE" || form.servicePricing !== "QUOTATION"
      ? { label: t("review.price"), value: form.price ? `$${form.price}` : "" }
      : null,
    isStore && form.hasOffer
      ? {
          label: t("review.offerPrice"),
          value: form.offerPrice ? `$${form.offerPrice}` : "",
        }
      : null,
    isService && form.priceRange
      ? { label: t("review.priceRange"), value: form.priceRange }
      : null,
    isService && form.duration
      ? {
          label: t("review.duration"),
          value: t("review.durationValue", { minutes: form.duration }),
        }
      : null,
    isStore ? { label: t("review.stock"), value: form.stock } : null,
    isStore && form.color ? { label: t("review.color"), value: form.color } : null,
    isStore && form.barcode ? { label: t("review.barcode"), value: form.barcode } : null,
    isStore && materialsLabel
      ? { label: t("review.materials"), value: materialsLabel }
      : null,
    isStore && form.recycledContent
      ? { label: t("review.recycledContent"), value: `${form.recycledContent}%` }
      : null,
    isStore && weight ? { label: t("review.weight"), value: weight } : null,
    isStore && dimensions ? { label: t("review.dimensions"), value: dimensions } : null,
    isStore && form.warranty !== null
      ? {
          label: t("review.warranty"),
          value: form.warranty
            ? form.warrantyDuration
              ? t("review.warrantyWithDuration", { months: form.warrantyDuration })
              : t("form.warrantyYes")
            : t("form.warrantyNo"),
        }
      : null,
    target !== "MARKETPLACE"
      ? null
      : {
          label: t("review.condition"),
          value: selectedCondition ? tCondition(`condition.${selectedCondition}`) : "",
        },
    isMarketplace && form.conditionDescription
      ? { label: t("review.conditionDescription"), value: form.conditionDescription }
      : null,
    isMarketplace && form.color ? { label: t("review.color"), value: form.color } : null,
    // Only when the listing actually accepts swaps — matching what gets sent.
    isMarketplace && form.isExchangeable
      ? {
          label: t("review.interests"),
          value: form.interests.join(", ") || t("review.interestsAny"),
        }
      : null,
    { label: t("review.category"), value: categoryLabel },
    isStore && form.features.length
      ? { label: t("review.features"), value: form.features.join(", ") }
      : null,
    (isService || isStore) && form.tags.length
      ? { label: t("review.tags"), value: form.tags.join(", ") }
      : null,
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

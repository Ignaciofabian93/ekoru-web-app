"use client";
import { useTranslation } from "@/i18n/context";
import { useCallback } from "react";

import { DESCRIPTION_MIN_LENGTH, MIN_PRODUCT_IMAGES } from "../constants/options";
import { useMarketplaceCategories } from "../hooks/useMarketplaceCategories";
import { usePersonPublish } from "../hooks/usePersonPublish";
import { PublishWizard, type WizardStep } from "./PublishWizard";
import { PersonDetailsStep } from "./steps/PersonDetailsStep";
import { PersonPricingStep } from "./steps/PersonPricingStep";
import { ReviewStep } from "./steps/ReviewStep";

/** Publish wizard for PERSON sellers: a second-hand listing that always goes
 *  to the marketplace. */
export function PersonPublishForm() {
  const { t } = useTranslation("publish");
  const { form, setField, addImage, removeImage, loading, handlePublish } =
    usePersonPublish();

  const setProductCategoryId = useCallback(
    (id: string) => setField("productCategoryId", id),
    [setField],
  );
  const categories = useMarketplaceCategories({
    enabled: true,
    onLeafChange: setProductCategoryId,
  });

  // ── Field-level validity ──────────────────────────────────────────
  const nameValid = form.name.trim().length > 0;
  const descValid = form.description.trim().length >= DESCRIPTION_MIN_LENGTH;
  const categoryValid = form.productCategoryId !== "";
  const conditionValid = form.condition !== "";
  const imagesValid = form.images.length >= MIN_PRODUCT_IMAGES;
  const priceValid = Number(form.price) > 0;

  const detailsValid =
    nameValid && descValid && categoryValid && conditionValid && imagesValid;

  const steps: WizardStep[] = [
    {
      key: "details",
      title: t("steps.detailsTitle"),
      subtitle: t("steps.detailsSubtitle"),
      valid: detailsValid,
      render: (submitted) => (
        <PersonDetailsStep
          form={form}
          setField={setField}
          addImage={addImage}
          removeImage={removeImage}
          categories={categories}
          invalid={{
            name: submitted && !nameValid,
            description: submitted && !descValid,
            category: submitted && !categoryValid,
            condition: submitted && !conditionValid,
            images: submitted && !imagesValid,
          }}
          descriptionMinLength={DESCRIPTION_MIN_LENGTH}
        />
      ),
    },
    {
      key: "pricing",
      title: t("steps.pricingTitle"),
      subtitle: t("steps.pricingSubtitle"),
      valid: priceValid,
      render: (submitted) => (
        <PersonPricingStep
          form={form}
          setField={setField}
          invalid={{ price: submitted && !priceValid }}
        />
      ),
    },
    {
      key: "review",
      title: t("steps.reviewTitle"),
      subtitle: t("steps.reviewSubtitle"),
      valid: true,
      render: () => (
        <ReviewStep
          target="MARKETPLACE"
          form={form}
          categoryLabel={categories.selectedLeafLabel}
          materialsLabel=""
        />
      ),
    },
  ];

  return <PublishWizard steps={steps} loading={loading} onPublish={handlePublish} />;
}

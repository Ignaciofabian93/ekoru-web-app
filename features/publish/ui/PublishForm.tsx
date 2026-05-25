"use client";
import MainButton from "@/components/Button/MainButton";
import { Text } from "@/components/Text/Text";
import { Title } from "@/components/Title/Title";
import { useTranslation } from "@/i18n/context";
import clsx from "clsx";
import { AlertCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { MIN_PRODUCT_IMAGES } from "../constants/options";
import { useMarketplaceCategories } from "../hooks/useMarketplaceCategories";
import { usePublish } from "../hooks/usePublish";
import { useServiceCategories } from "../hooks/useServiceCategories";
import { useStoreCategories } from "../hooks/useStoreCategories";
import { DetailsStep } from "./steps/DetailsStep";
import { InventoryStep } from "./steps/InventoryStep";
import { PricingStep } from "./steps/PricingStep";
import { ReviewStep } from "./steps/ReviewStep";
import { TargetStep } from "./steps/TargetStep";

type StepKey = "target" | "details" | "pricing" | "inventory" | "review";

const DESCRIPTION_MIN = 10;

export function PublishForm() {
  const { t } = useTranslation("publish");
  const {
    isBusiness,
    target,
    setBusinessTarget,
    form,
    setField,
    addImage,
    removeImage,
    loading,
    handlePublish,
  } = usePublish();

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [submitted, setSubmitted] = useState(false);

  // Category cascade hooks — each one writes its leaf into the matching form
  // field through `onLeafChange`. They self-skip the network request until the
  // user actually picks a matching target.
  const setProductCategoryId = useCallback(
    (id: string) => setField("productCategoryId", id),
    [setField],
  );
  const setStoreSubCategoryId = useCallback(
    (id: string) => setField("storeSubCategoryId", id),
    [setField],
  );
  const setServiceSubcategoryId = useCallback(
    (id: string) => setField("serviceSubcategoryId", id),
    [setField],
  );

  const marketplaceCategories = useMarketplaceCategories({
    enabled: target === "MARKETPLACE",
    onLeafChange: setProductCategoryId,
  });
  const storeCategories = useStoreCategories({
    enabled: target === "STORE",
    onLeafChange: setStoreSubCategoryId,
  });
  const serviceCategories = useServiceCategories({
    enabled: target === "SERVICE",
    onLeafChange: setServiceSubcategoryId,
  });

  const steps = useMemo<StepKey[]>(() => {
    if (!isBusiness) return ["details", "pricing", "review"];
    const mid: StepKey = target === "SERVICE" ? "pricing" : "inventory";
    return ["target", "details", mid, "review"];
  }, [isBusiness, target]);

  const currentKey = steps[step];
  const totalSteps = steps.length;

  // ── Field-level validity ──────────────────────────────────────────
  const nameValid = form.name.trim().length > 0;
  const descValid = form.description.trim().length >= DESCRIPTION_MIN;
  const conditionValid = form.condition !== "";
  const priceValid = Number(form.price) > 0;
  const stockValid = form.stock !== "" && Number(form.stock) >= 0;
  const servicePricingValid = form.servicePricing !== "";
  const isServiceQuotation = target === "SERVICE" && form.servicePricing === "QUOTATION";

  const categoryIdForTarget =
    target === "MARKETPLACE"
      ? form.productCategoryId
      : target === "STORE"
        ? form.storeSubCategoryId
        : target === "SERVICE"
          ? form.serviceSubcategoryId
          : "";
  const categoryValid = categoryIdForTarget !== "";

  // Products require at least one photo; services may have none.
  const imagesRequired = target === "MARKETPLACE" || target === "STORE";
  const imagesValid = !imagesRequired || form.images.length >= MIN_PRODUCT_IMAGES;

  const detailsValid =
    target === "MARKETPLACE"
      ? nameValid && descValid && categoryValid && conditionValid && imagesValid
      : target === "STORE"
        ? nameValid && descValid && categoryValid && imagesValid
        : nameValid && categoryValid;

  const pricingValid =
    target === "SERVICE"
      ? servicePricingValid && (isServiceQuotation || priceValid)
      : priceValid;

  const inventoryValid = stockValid && priceValid;

  const stepValid: Record<StepKey, boolean> = {
    target: target !== null,
    details: detailsValid,
    pricing: pricingValid,
    inventory: inventoryValid,
    review: true,
  };

  // ── Navigation ────────────────────────────────────────────────────
  const goTo = (next: number, dir: "forward" | "back") => {
    setDirection(dir);
    setSubmitted(false);
    setStep(next);
  };

  const handleBack = () => goTo(step - 1, "back");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stepValid[currentKey]) {
      setSubmitted(true);
      return;
    }

    if (step < totalSteps - 1) {
      goTo(step + 1, "forward");
      return;
    }

    setSubmitted(false);
    await handlePublish();
  };

  const stepHeader: Record<StepKey, { title: string; subtitle: string }> = {
    target: { title: t("steps.targetTitle"), subtitle: t("steps.targetSubtitle") },
    details: { title: t("steps.detailsTitle"), subtitle: t("steps.detailsSubtitle") },
    pricing: { title: t("steps.pricingTitle"), subtitle: t("steps.pricingSubtitle") },
    inventory: { title: t("steps.inventoryTitle"), subtitle: t("steps.inventorySubtitle") },
    review: { title: t("steps.reviewTitle"), subtitle: t("steps.reviewSubtitle") },
  };

  const reviewCategoryLabel =
    target === "MARKETPLACE"
      ? marketplaceCategories.selectedLeafLabel
      : target === "STORE"
        ? storeCategories.selectedLeafLabel
        : target === "SERVICE"
          ? serviceCategories.selectedLeafLabel
          : "";

  return (
    <div className="flex flex-col gap-6">
      {/* Progress indicator */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <span
              key={i}
              className={clsx(
                "h-1.5 flex-1 rounded-full transition-colors duration-300",
                i <= step ? "bg-primary" : "bg-border-light",
              )}
            />
          ))}
        </div>
        <Text variant="small" color="tertiary">
          {t("step", { current: String(step + 1), total: String(totalSteps) })}
        </Text>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div
          key={currentKey}
          className={clsx(
            "sm:min-h-79",
            direction === "forward" ? "animate-step-forward" : "animate-step-back",
          )}
        >
          <div className="mb-5 flex flex-col gap-1">
            <Title level="h2" size="h4" weight="semibold" color="primary">
              {stepHeader[currentKey].title}
            </Title>
            <Text variant="span" color="secondary">
              {stepHeader[currentKey].subtitle}
            </Text>
          </div>

          {currentKey === "target" && (
            <TargetStep target={target} onSelect={setBusinessTarget} />
          )}

          {currentKey === "details" && target && (
            <DetailsStep
              target={target}
              form={form}
              setField={setField}
              addImage={addImage}
              removeImage={removeImage}
              marketplaceCategories={marketplaceCategories}
              storeCategories={storeCategories}
              serviceCategories={serviceCategories}
              invalid={{
                name: submitted && !nameValid,
                description: submitted && !descValid,
                category: submitted && !categoryValid,
                condition: submitted && !conditionValid,
                images: submitted && !imagesValid,
              }}
              descriptionMinLength={DESCRIPTION_MIN}
            />
          )}

          {currentKey === "pricing" && target && (
            <PricingStep
              target={target}
              form={form}
              setField={setField}
              invalid={{
                price: submitted && !priceValid,
                servicePricing: submitted && !servicePricingValid,
              }}
            />
          )}

          {currentKey === "inventory" && (
            <InventoryStep
              form={form}
              setField={setField}
              invalid={{
                price: submitted && !priceValid,
                stock: submitted && !stockValid,
              }}
            />
          )}

          {currentKey === "review" && target && (
            <ReviewStep
              target={target}
              form={form}
              categoryLabel={reviewCategoryLabel}
            />
          )}
        </div>

        {/* Step-level error — surfaces any silent validation failure so the
            Continue button never appears to "do nothing" when blocked. */}
        {submitted && !stepValid[currentKey] && (
          <div className="flex items-center gap-2 rounded-md border border-danger/30 bg-danger/5 px-3 py-2">
            <AlertCircle size={16} color="currentColor" className="text-danger" />
            <Text variant="small" color="error">
              {t("feedback.fixHighlighted")}
            </Text>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center gap-3">
          {step > 0 && (
            <MainButton
              text={t("actions.back")}
              variant="outline"
              leftIcon={ArrowLeft}
              type="button"
              onClick={handleBack}
              size="md"
            />
          )}
          <div className="flex-1">
            {step < totalSteps - 1 ? (
              <MainButton
                text={t("actions.continue")}
                rightIcon={ArrowRight}
                type="submit"
                fullWidth
                size="md"
              />
            ) : (
              <MainButton
                text={t("actions.publish")}
                rightIcon={ArrowRight}
                type="submit"
                loading={loading}
                fullWidth
                size="md"
              />
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

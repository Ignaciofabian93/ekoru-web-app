"use client";
import MainButton from "@/components/Button/MainButton";
import Input from "@/components/Input/Input";
import { Select } from "@/components/Select/Select";
import { Text } from "@/components/Text/Text";
import TextArea from "@/components/TextArea/TextArea";
import { Title } from "@/components/Title/Title";
import { useTranslation } from "@/i18n/context";
import clsx from "clsx";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useMemo, useState } from "react";

import {
  BUSINESS_TARGETS,
  CONDITION_OPTIONS,
  MAX_PRODUCT_IMAGES,
  MIN_PRODUCT_IMAGES,
  PRODUCT_CATEGORIES,
  SERVICE_PRICING_OPTIONS,
} from "../constants/options";
import { usePublish } from "../hooks/usePublish";
import { ImagePicker } from "./ImagePicker";

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
  const categoryValid = form.productCategoryId !== "";
  const conditionValid = form.condition !== "";
  const priceValid = Number(form.price) > 0;
  const stockValid = form.stock !== "" && Number(form.stock) >= 0;
  const isServiceQuotation = target === "SERVICE" && form.servicePricing === "QUOTATION";

  // Products (marketplace + store) require at least one photo; services don't.
  const imagesRequired = target === "MARKETPLACE" || target === "STORE";
  const imagesValid = !imagesRequired || form.images.length >= MIN_PRODUCT_IMAGES;

  const detailsValid =
    target === "MARKETPLACE"
      ? nameValid && descValid && categoryValid && conditionValid && imagesValid
      : target === "STORE"
        ? nameValid && descValid && categoryValid && imagesValid
        : nameValid && descValid;

  const pricingValid =
    target === "SERVICE"
      ? form.servicePricing !== "" && (isServiceQuotation || priceValid)
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

  const categoryOptions = PRODUCT_CATEGORIES.map((c) => ({
    value: c.id,
    label: t(c.labelKey),
  }));
  const conditionOptions = CONDITION_OPTIONS.map((c) => ({
    value: c.value,
    label: t(c.labelKey),
  }));
  const servicePricingOptions = SERVICE_PRICING_OPTIONS.map((c) => ({
    value: c.value,
    label: t(c.labelKey),
  }));

  const stepHeader: Record<StepKey, { title: string; subtitle: string }> = {
    target: { title: t("steps.targetTitle"), subtitle: t("steps.targetSubtitle") },
    details: { title: t("steps.detailsTitle"), subtitle: t("steps.detailsSubtitle") },
    pricing: { title: t("steps.pricingTitle"), subtitle: t("steps.pricingSubtitle") },
    inventory: { title: t("steps.inventoryTitle"), subtitle: t("steps.inventorySubtitle") },
    review: { title: t("steps.reviewTitle"), subtitle: t("steps.reviewSubtitle") },
  };

  const selectedCategoryLabel = PRODUCT_CATEGORIES.find(
    (c) => String(c.id) === form.productCategoryId,
  );
  const selectedConditionLabel = CONDITION_OPTIONS.find((c) => c.value === form.condition);

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

          {/* Target — business sellers only */}
          {currentKey === "target" && (
            <div className="flex flex-col gap-3">
              {BUSINESS_TARGETS.map(({ value, icon: Icon, labelKey, descKey }) => {
                const selected = target === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setBusinessTarget(value)}
                    aria-pressed={selected}
                    className={clsx(
                      "flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all duration-200",
                      selected
                        ? "border-primary bg-primary-light-bg"
                        : "border-input-border bg-surface",
                    )}
                  >
                    <span
                      className={clsx(
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors duration-200",
                        selected
                          ? "bg-primary text-white"
                          : "bg-background-tertiary text-foreground-tertiary",
                      )}
                    >
                      <Icon size={20} color="currentColor" strokeWidth={2} />
                    </span>
                    <span className="flex flex-1 flex-col">
                      <Text variant="span" weight="bold">
                        {t(labelKey)}
                      </Text>
                      <Text variant="small" color="tertiary">
                        {t(descKey)}
                      </Text>
                    </span>
                    <span
                      className={clsx(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-200",
                        selected
                          ? "border-primary bg-primary"
                          : "border-border-strong bg-transparent",
                      )}
                    >
                      {selected && <Check size={12} color="#ffffff" strokeWidth={3} />}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Details */}
          {currentKey === "details" && (
            <div className="flex flex-col gap-5">
              <Input
                name="name"
                label={t("form.name")}
                placeholder={t("form.namePlaceholder")}
                value={form.name}
                onChangeText={(v) => setField("name", v)}
                maxLength={120}
                required
                isInvalid={submitted && !nameValid}
                errorMessage={t("feedback.fieldsRequired")}
              />

              {target !== "SERVICE" && (
                <Select
                  label={t("form.category")}
                  placeholder={t("form.categoryPlaceholder")}
                  options={categoryOptions}
                  value={form.productCategoryId ? Number(form.productCategoryId) : undefined}
                  onChange={(v) => setField("productCategoryId", String(v))}
                  errorMessage={
                    submitted && !categoryValid ? t("feedback.fieldsRequired") : undefined
                  }
                />
              )}

              {target === "MARKETPLACE" && (
                <Select
                  label={t("form.condition")}
                  placeholder={t("form.conditionPlaceholder")}
                  options={conditionOptions}
                  value={form.condition || undefined}
                  onChange={(v) => setField("condition", v as typeof form.condition)}
                  searchEnabled={false}
                  errorMessage={
                    submitted && !conditionValid ? t("feedback.fieldsRequired") : undefined
                  }
                />
              )}

              <Input
                name="brand"
                label={t("form.brand")}
                placeholder={t("form.brandPlaceholder")}
                value={form.brand}
                onChangeText={(v) => setField("brand", v)}
                maxLength={60}
              />

              <TextArea
                label={t("form.description")}
                placeholder={t("form.descriptionPlaceholder")}
                value={form.description}
                onChangeText={(v) => setField("description", v)}
                maxLength={1000}
                rows={4}
              />

              {(target === "MARKETPLACE" || target === "STORE") && (
                <ImagePicker
                  images={form.images}
                  onAdd={addImage}
                  onRemove={removeImage}
                  max={MAX_PRODUCT_IMAGES}
                  label={t("form.images")}
                  hint={t("form.imagesHint")}
                  addLabel={t("form.addPhoto")}
                  error={
                    submitted && !imagesValid ? t("feedback.imagesRequired") : undefined
                  }
                />
              )}
            </div>
          )}

          {/* Pricing (marketplace + service) */}
          {currentKey === "pricing" && (
            <div className="flex flex-col gap-5">
              {target === "SERVICE" && (
                <Select
                  label={t("form.servicePricing")}
                  placeholder={t("form.servicePricingPlaceholder")}
                  options={servicePricingOptions}
                  value={form.servicePricing || undefined}
                  onChange={(v) => setField("servicePricing", v as typeof form.servicePricing)}
                  searchEnabled={false}
                  errorMessage={
                    submitted && form.servicePricing === ""
                      ? t("feedback.fieldsRequired")
                      : undefined
                  }
                />
              )}

              {!isServiceQuotation && (
                <Input
                  name="price"
                  label={t("form.price")}
                  placeholder={t("form.pricePlaceholder")}
                  type="number"
                  value={form.price}
                  onChangeText={(v) => setField("price", v)}
                  required
                  isInvalid={submitted && !priceValid}
                  errorMessage={t("feedback.priceRequired")}
                />
              )}

              {target === "MARKETPLACE" && (
                <button
                  type="button"
                  onClick={() => setField("isExchangeable", !form.isExchangeable)}
                  aria-pressed={form.isExchangeable}
                  className={clsx(
                    "flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all duration-200",
                    form.isExchangeable
                      ? "border-primary bg-primary-light-bg"
                      : "border-input-border bg-surface",
                  )}
                >
                  <span
                    className={clsx(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors duration-200",
                      form.isExchangeable
                        ? "border-primary bg-primary"
                        : "border-border-strong bg-transparent",
                    )}
                  >
                    {form.isExchangeable && (
                      <Check size={12} color="#ffffff" strokeWidth={3} />
                    )}
                  </span>
                  <span className="flex flex-1 flex-col">
                    <Text variant="span" weight="medium">
                      {t("form.isExchangeable")}
                    </Text>
                    <Text variant="small" color="tertiary">
                      {t("form.isExchangeableHint")}
                    </Text>
                  </span>
                </button>
              )}
            </div>
          )}

          {/* Inventory (store) */}
          {currentKey === "inventory" && (
            <div className="flex flex-col gap-5">
              <Input
                name="price"
                label={t("form.price")}
                placeholder={t("form.pricePlaceholder")}
                type="number"
                value={form.price}
                onChangeText={(v) => setField("price", v)}
                required
                isInvalid={submitted && !priceValid}
                errorMessage={t("feedback.priceRequired")}
              />
              <Input
                name="stock"
                label={t("form.stock")}
                placeholder={t("form.stockPlaceholder")}
                type="number"
                value={form.stock}
                onChangeText={(v) => setField("stock", v)}
                required
                isInvalid={submitted && !stockValid}
                errorMessage={t("feedback.fieldsRequired")}
              />
              <Input
                name="sku"
                label={t("form.sku")}
                placeholder={t("form.skuPlaceholder")}
                value={form.sku}
                onChangeText={(v) => setField("sku", v)}
                maxLength={60}
              />
            </div>
          )}

          {/* Review */}
          {currentKey === "review" && (
            <dl className="flex flex-col divide-y divide-border-light rounded-xl border border-border-light bg-surface px-4">
              {[
                { label: t("review.target"), value: target ? t(`targetNames.${target}`) : "" },
                { label: t("review.title"), value: form.name },
                {
                  label: t("review.price"),
                  value: form.price ? `$${form.price}` : "",
                },
                target !== "SERVICE"
                  ? {
                      label: t("review.category"),
                      value: selectedCategoryLabel ? t(selectedCategoryLabel.labelKey) : "",
                    }
                  : null,
                target === "MARKETPLACE"
                  ? {
                      label: t("review.condition"),
                      value: selectedConditionLabel ? t(selectedConditionLabel.labelKey) : "",
                    }
                  : null,
              ]
                .filter((row): row is { label: string; value: string } => row !== null)
                .map((row) => (
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
          )}
        </div>

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

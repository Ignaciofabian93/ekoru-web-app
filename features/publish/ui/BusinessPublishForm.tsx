"use client";
import { useTranslation } from "@/i18n/context";
import { useCallback } from "react";

import { DESCRIPTION_MIN_LENGTH, MIN_PRODUCT_IMAGES } from "../constants/options";
import { useBusinessPublish } from "../hooks/useBusinessPublish";
import { useMaterials } from "../hooks/useMaterials";
import { useServiceCategories } from "../hooks/useServiceCategories";
import { useStoreCategories } from "../hooks/useStoreCategories";
import { PublishWizard, type WizardStep } from "./PublishWizard";
import { InventoryStep } from "./steps/InventoryStep";
import { ReviewStep } from "./steps/ReviewStep";
import { ServiceDetailsStep } from "./steps/ServiceDetailsStep";
import { ServicePricingStep } from "./steps/ServicePricingStep";
import { StoreDetailsStep } from "./steps/StoreDetailsStep";
import { TargetStep } from "./steps/TargetStep";

/** Publish wizard for business sellers (STARTUP / COMPANY): store products
 *  for RETAIL, services for SERVICES, and a target choice first for MIXED. */
export function BusinessPublishForm() {
  const { t } = useTranslation("publish");
  const {
    allowedTargets,
    target,
    setBusinessTarget,
    form,
    setField,
    addImage,
    removeImage,
    loading,
    handlePublish,
  } = useBusinessPublish();

  const setStoreSubCategoryId = useCallback(
    (id: string) => setField("storeSubCategoryId", id),
    [setField],
  );
  const setServiceSubcategoryId = useCallback(
    (id: string) => setField("serviceSubcategoryId", id),
    [setField],
  );

  // Category cascades self-skip the network request until their target is the
  // active one; materials only matter for store products.
  const storeCategories = useStoreCategories({
    enabled: target === "STORE",
    onLeafChange: setStoreSubCategoryId,
  });
  const serviceCategories = useServiceCategories({
    enabled: target === "SERVICE",
    onLeafChange: setServiceSubcategoryId,
  });
  const materials = useMaterials(target === "STORE");

  const isStore = target === "STORE";
  const isService = target === "SERVICE";

  // ── Field-level validity ──────────────────────────────────────────
  const nameValid = form.name.trim().length > 0;
  const descValid = form.description.trim().length >= DESCRIPTION_MIN_LENGTH;
  const priceValid = Number(form.price) > 0;
  const stockValid = form.stock !== "" && Number(form.stock) >= 0;
  const servicePricingValid = form.servicePricing !== "";
  const isServiceQuotation = isService && form.servicePricing === "QUOTATION";

  const categoryValid = isStore
    ? form.storeSubCategoryId !== ""
    : form.serviceSubcategoryId !== "";

  // Store products require at least one photo; services may have none.
  const imagesValid = !isStore || form.images.length >= MIN_PRODUCT_IMAGES;

  // Material composition is optional, but once a seller declares any material
  // the composition must be complete: every started row filled, no duplicate
  // materials, and the percentages summing to exactly 100 (a single material
  // means that one is 100%).
  const filledMaterials = form.materials.filter((m) => m.materialTypeId || m.percentage);
  const materialIds = filledMaterials.map((m) => m.materialTypeId).filter(Boolean);
  const materialsValid =
    !isStore ||
    filledMaterials.length === 0 ||
    (filledMaterials.every(
      (m) => m.materialTypeId && Number(m.percentage) > 0 && Number(m.percentage) <= 100,
    ) &&
      new Set(materialIds).size === materialIds.length &&
      filledMaterials.reduce((sum, m) => sum + (Number(m.percentage) || 0), 0) === 100);

  const detailsValid = isStore
    ? nameValid && descValid && categoryValid && imagesValid && materialsValid
    : nameValid && categoryValid;

  const pricingValid = servicePricingValid && (isServiceQuotation || priceValid);

  // When an offer is enabled the offer price must be a positive amount below
  // the regular price; otherwise the field is simply ignored.
  const offerPriceValid =
    !form.hasOffer ||
    (Number(form.offerPrice) > 0 && Number(form.offerPrice) < Number(form.price));

  const inventoryValid = stockValid && priceValid && offerPriceValid;

  const reviewMaterialsLabel = form.materials
    .filter((m) => m.materialTypeId && m.percentage)
    .map((m) => `${materials.labelFor(m.materialTypeId)} ${m.percentage}%`)
    .join(", ");

  const steps: WizardStep[] = [];

  // Only MIXED businesses choose a destination; RETAIL / SERVICES have their
  // sole target auto-selected in usePublish.
  if (allowedTargets.length > 1) {
    steps.push({
      key: "target",
      title: t("steps.targetTitle"),
      subtitle: t("steps.targetSubtitle"),
      valid: target !== null,
      render: () => (
        <TargetStep
          target={target}
          allowedTargets={allowedTargets}
          onSelect={setBusinessTarget}
        />
      ),
    });
  }

  steps.push({
    key: "details",
    title: t("steps.detailsTitle"),
    subtitle: t("steps.detailsSubtitle"),
    valid: detailsValid,
    render: (submitted) =>
      isStore ? (
        <StoreDetailsStep
          form={form}
          setField={setField}
          addImage={addImage}
          removeImage={removeImage}
          categories={storeCategories}
          materials={materials}
          invalid={{
            name: submitted && !nameValid,
            description: submitted && !descValid,
            category: submitted && !categoryValid,
            images: submitted && !imagesValid,
            materials: submitted && !materialsValid,
          }}
          descriptionMinLength={DESCRIPTION_MIN_LENGTH}
        />
      ) : (
        <ServiceDetailsStep
          form={form}
          setField={setField}
          addImage={addImage}
          removeImage={removeImage}
          categories={serviceCategories}
          invalid={{
            name: submitted && !nameValid,
            category: submitted && !categoryValid,
          }}
          descriptionMinLength={DESCRIPTION_MIN_LENGTH}
        />
      ),
  });

  if (isService) {
    steps.push({
      key: "pricing",
      title: t("steps.pricingTitle"),
      subtitle: t("steps.pricingSubtitle"),
      valid: pricingValid,
      render: (submitted) => (
        <ServicePricingStep
          form={form}
          setField={setField}
          invalid={{
            price: submitted && !priceValid,
            servicePricing: submitted && !servicePricingValid,
          }}
        />
      ),
    });
  } else {
    steps.push({
      key: "inventory",
      title: t("steps.inventoryTitle"),
      subtitle: t("steps.inventorySubtitle"),
      valid: inventoryValid,
      render: (submitted) => (
        <InventoryStep
          form={form}
          setField={setField}
          invalid={{
            price: submitted && !priceValid,
            stock: submitted && !stockValid,
            offerPrice: submitted && !offerPriceValid,
          }}
        />
      ),
    });
  }

  steps.push({
    key: "review",
    title: t("steps.reviewTitle"),
    subtitle: t("steps.reviewSubtitle"),
    valid: true,
    render: () =>
      target && (
        <ReviewStep
          target={target}
          form={form}
          categoryLabel={
            isStore
              ? storeCategories.selectedLeafLabel
              : serviceCategories.selectedLeafLabel
          }
          materialsLabel={isStore ? reviewMaterialsLabel : ""}
        />
      ),
  });

  return <PublishWizard steps={steps} loading={loading} onPublish={handlePublish} />;
}

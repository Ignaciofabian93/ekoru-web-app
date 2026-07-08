"use client";
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_COOKIE,
  type SupportedLanguage,
} from "@/constants/settings";
import { ADD_SERVICE } from "@/graphql/services/mutations";
import { ADD_STORE_PRODUCT } from "@/graphql/stores/mutations";
import { useNavigation } from "@/hooks/useNavigation";
import { useToast } from "@/hooks/useToast";
import { useTranslation } from "@/i18n/context";
import useAuthStore, { useBusinessProfile } from "@/store/useAuthStore";
import { getCookie } from "@/utils/cookies";
import { sanitizeOnSubmit } from "@/utils/inputValidations";
import { useMutation } from "@apollo/client/react";
import { useParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

import type { PublishTarget } from "../constants/options";
import { useImageUpload } from "./useImageUpload";
import { usePublishForm } from "./usePublishForm";

/** Destinations a business seller can publish to. */
export type BusinessTarget = Exclude<PublishTarget, "MARKETPLACE">;

/** Publishing flow for business sellers (STARTUP / COMPANY): store products
 *  and/or services, depending on the business type. */
export function useBusinessPublish() {
  const { navigateTo } = useNavigation();
  const params = useParams<{ lang?: SupportedLanguage }>();
  const toast = useToast();
  const { t } = useTranslation("publish");
  const sellerId = useAuthStore((s) => s.seller?.id);
  const businessProfile = useBusinessProfile();

  // A business only publishes to the destinations its BusinessType allows:
  // RETAIL → store products, SERVICES → services, MIXED → both. Falls back to
  // both while the profile is still hydrating / businessType is unknown.
  const allowedTargets = useMemo<BusinessTarget[]>(() => {
    switch (businessProfile?.businessType) {
      case "RETAIL":
        return ["STORE"];
      case "SERVICES":
        return ["SERVICE"];
      case "MIXED":
        return ["STORE", "SERVICE"];
      default:
        return ["STORE", "SERVICE"];
    }
  }, [businessProfile?.businessType]);

  const [businessTarget, setBusinessTarget] = useState<BusinessTarget | null>(null);

  // When a business has a single allowed destination we auto-select it, so the
  // wizard skips the target step entirely (e.g. a RETAIL company never sees the
  // "publish a service" option). Stays correct even if the seller hydrates
  // after mount.
  const soleTarget = allowedTargets.length === 1 ? allowedTargets[0] : null;
  const target = businessTarget ?? soleTarget;

  const { form, setField, addImage, removeImage } = usePublishForm();
  const { uploading, uploadImages } = useImageUpload();
  const [addStoreProduct, { loading: storeLoading }] = useMutation(ADD_STORE_PRODUCT);
  const [addService, { loading: serviceLoading }] = useMutation(ADD_SERVICE);

  const handlePublish = useCallback(async (): Promise<boolean> => {
    const lang = params.lang ?? getCookie(LANGUAGE_COOKIE) ?? DEFAULT_LANGUAGE;

    if (!sellerId) {
      toast.error(t("feedback.publishSignInRequired"));
      return false;
    }

    try {
      if (target === "STORE") {
        const imageKeys = await uploadImages(form.images, sellerId);

        // Only keep fully-filled material rows; drop the empty placeholder.
        const materials = form.materials
          .filter((m) => m.materialTypeId && m.percentage)
          .map((m) => ({
            materialTypeId: Number(m.materialTypeId),
            percentage: Number(m.percentage),
          }));

        // sellerId is injected by the stores subgraph from the session
        // (`@CurrentSeller`); it is NOT part of AddStoreProductInput.
        await addStoreProduct({
          variables: {
            input: {
              name: sanitizeOnSubmit(form.name),
              description: sanitizeOnSubmit(form.description),
              stock: Number(form.stock),
              price: Number(form.price),
              subCategoryId: Number(form.storeSubCategoryId),
              images: imageKeys,
              sku: sanitizeOnSubmit(form.sku) || undefined,
              barcode: sanitizeOnSubmit(form.barcode) || undefined,
              brand: sanitizeOnSubmit(form.brand) || undefined,
              color: sanitizeOnSubmit(form.color) || undefined,
              hasOffer: form.hasOffer,
              offerPrice:
                form.hasOffer && form.offerPrice
                  ? Number(form.offerPrice)
                  : undefined,
              recycledContent: form.recycledContent
                ? Number(form.recycledContent)
                : undefined,
              weight: form.weight ? Number(form.weight) : undefined,
              weightUnit: form.weightUnit || undefined,
              length: form.length ? Number(form.length) : undefined,
              width: form.width ? Number(form.width) : undefined,
              height: form.height ? Number(form.height) : undefined,
              dimensionUnit: form.dimensionUnit || undefined,
              lowStockThreshold: form.lowStockThreshold
                ? Number(form.lowStockThreshold)
                : undefined,
              warranty: form.warranty ?? undefined,
              // The duration only makes sense when there IS a warranty.
              warrantyDuration:
                form.warranty && form.warrantyDuration
                  ? Number(form.warrantyDuration)
                  : undefined,
              tags: form.tags.length ? form.tags : undefined,
              features: form.features.length ? form.features : undefined,
              materials: materials.length ? materials : undefined,
            },
          },
        });

        toast.success(t("feedback.publishSuccess"));
        navigateTo({ route: `/${lang}/stores` });
        return true;
      }

      if (target === "SERVICE") {
        // Services may have 0 images; only upload when present.
        const imageKeys = form.images.length
          ? await uploadImages(form.images, sellerId)
          : [];

        const isQuotation = form.servicePricing === "QUOTATION";

        const priceRange = sanitizeOnSubmit(form.priceRange);

        // Unlike products, the services subgraph DOES require sellerId in the
        // input (no @CurrentSeller decorator on the resolver).
        await addService({
          variables: {
            input: {
              sellerId,
              name: sanitizeOnSubmit(form.name),
              description: sanitizeOnSubmit(form.description) || undefined,
              subcategoryId: Number(form.serviceSubcategoryId),
              pricingType: form.servicePricing,
              images: imageKeys,
              basePrice: isQuotation ? undefined : Number(form.price),
              priceRange: priceRange || undefined,
              duration: form.duration ? Number(form.duration) : undefined,
              tags: form.tags.length ? form.tags : undefined,
            },
          },
        });

        toast.success(t("feedback.publishSuccess"));
        navigateTo({ route: `/${lang}/services` });
        return true;
      }

      return false;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unexpected error");
      return false;
    }
  }, [
    addService,
    addStoreProduct,
    form,
    navigateTo,
    params.lang,
    sellerId,
    t,
    target,
    toast,
    uploadImages,
  ]);

  return {
    allowedTargets,
    target,
    setBusinessTarget,
    form,
    setField,
    addImage,
    removeImage,
    loading: uploading || storeLoading || serviceLoading,
    handlePublish,
  };
}

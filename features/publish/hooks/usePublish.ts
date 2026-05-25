"use client";
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_COOKIE,
  type SupportedLanguage,
} from "@/constants/settings";
import { ADD_PRODUCT } from "@/graphql/marketplace/mutations";
import { ADD_SERVICE } from "@/graphql/services/mutations";
import { ADD_STORE_PRODUCT } from "@/graphql/stores/mutations";
import { useNavigation } from "@/hooks/useNavigation";
import { useToast } from "@/hooks/useToast";
import { useTranslation } from "@/i18n/context";
import { uploadProductImage } from "@/lib/api/products";
import useAuthStore, { useSellerType } from "@/store/useAuthStore";
import type { ProductCondition, ServicePricing } from "@/types/enums";
import { getCookie } from "@/utils/cookies";
import { sanitizeOnSubmit } from "@/utils/inputValidations";
import { useMutation } from "@apollo/client/react";
import { useParams } from "next/navigation";
import { useCallback, useState } from "react";

import { MAX_PRODUCT_IMAGES, type PublishTarget } from "../constants/options";

export interface PublishForm {
  name: string;
  description: string;
  brand: string;
  // Marketplace leaf — set by useMarketplaceCategories cascade.
  productCategoryId: string;
  // Store leaf — set by useStoreCategories cascade.
  storeSubCategoryId: string;
  // Service leaf — set by useServiceCategories cascade.
  serviceSubcategoryId: string;
  condition: ProductCondition | "";
  conditionDescription: string;
  price: string;
  stock: string;
  sku: string;
  servicePricing: ServicePricing | "";
  isExchangeable: boolean;
  images: File[];
}

const INITIAL_FORM: PublishForm = {
  name: "",
  description: "",
  brand: "",
  productCategoryId: "",
  storeSubCategoryId: "",
  serviceSubcategoryId: "",
  condition: "",
  conditionDescription: "",
  price: "",
  stock: "",
  sku: "",
  servicePricing: "",
  isExchangeable: false,
  images: [],
};

export function usePublish() {
  const { navigateTo } = useNavigation();
  const params = useParams<{ lang?: SupportedLanguage }>();
  const toast = useToast();
  const { t } = useTranslation("publish");

  const sellerType = useSellerType();
  const sellerId = useAuthStore((s) => s.seller?.id);

  // PERSON (and unauthenticated/unknown) sellers publish to the marketplace.
  // Business sellers (STARTUP / COMPANY) pick a destination first.
  const isBusiness = sellerType === "STARTUP" || sellerType === "COMPANY";

  const [businessTarget, setBusinessTarget] = useState<
    Exclude<PublishTarget, "MARKETPLACE"> | null
  >(null);

  // Effective target stays correct even if the seller hydrates after mount.
  const target: PublishTarget | null = isBusiness ? businessTarget : "MARKETPLACE";

  const [form, setForm] = useState<PublishForm>(INITIAL_FORM);

  const setField = useCallback(
    <K extends keyof PublishForm>(key: K, value: PublishForm[K]) =>
      setForm((prev) => ({ ...prev, [key]: value })),
    [],
  );

  const addImage = useCallback(
    (file: File) =>
      setForm((prev) =>
        prev.images.length >= MAX_PRODUCT_IMAGES
          ? prev
          : { ...prev, images: [...prev.images, file] },
      ),
    [],
  );

  const removeImage = useCallback(
    (index: number) =>
      setForm((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      })),
    [],
  );

  const [addProduct, { loading: marketplaceLoading }] = useMutation(ADD_PRODUCT);
  const [addStoreProduct, { loading: storeLoading }] = useMutation(ADD_STORE_PRODUCT);
  const [addService, { loading: serviceLoading }] = useMutation(ADD_SERVICE);
  const [uploading, setUploading] = useState(false);
  const loading =
    uploading || marketplaceLoading || storeLoading || serviceLoading;

  // Upload images in parallel under the seller namespace and return the R2
  // keys. The subgraphs persist keys verbatim; clients resolve to CDN URLs at
  // render time via resolveImageUrl.
  const uploadImages = useCallback(
    async (images: File[], ownerId: string) => {
      setUploading(true);
      try {
        const uploads = await Promise.all(
          images.map((file) => uploadProductImage(file, ownerId)),
        );
        return uploads.map((u) => u.key);
      } finally {
        setUploading(false);
      }
    },
    [],
  );

  const handlePublish = useCallback(async (): Promise<boolean> => {
    const storedLanguage = params.lang ?? getCookie(LANGUAGE_COOKIE) ?? undefined;
    const lang = storedLanguage ?? DEFAULT_LANGUAGE;

    if (!sellerId) {
      toast.error(t("feedback.publishSignInRequired"));
      return false;
    }

    try {
      if (target === "MARKETPLACE") {
        const imageKeys = await uploadImages(form.images, sellerId);

        // sellerId is injected by the marketplace subgraph from the session
        // (`@CurrentSeller`); it is NOT part of AddProductInput.
        await addProduct({
          variables: {
            input: {
              name: sanitizeOnSubmit(form.name),
              description: sanitizeOnSubmit(form.description),
              brand: sanitizeOnSubmit(form.brand),
              price: Number(form.price),
              productCategoryId: Number(form.productCategoryId),
              condition: form.condition || undefined,
              conditionDescription:
                sanitizeOnSubmit(form.conditionDescription) || undefined,
              isExchangeable: form.isExchangeable,
              images: imageKeys,
              badges: [],
              interests: [],
            },
          },
        });

        toast.success(t("feedback.publishSuccess"));
        navigateTo({ route: `/${lang}/marketplace` });
        return true;
      }

      if (target === "STORE") {
        const imageKeys = await uploadImages(form.images, sellerId);

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
              brand: sanitizeOnSubmit(form.brand) || undefined,
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
    addProduct,
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
    isBusiness,
    target,
    setBusinessTarget,
    form,
    setField,
    addImage,
    removeImage,
    loading,
    handlePublish,
  };
}

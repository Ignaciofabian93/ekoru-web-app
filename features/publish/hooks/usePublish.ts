"use client";
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_COOKIE,
  type SupportedLanguage,
} from "@/constants/settings";
import { ADD_PRODUCT } from "@/graphql/marketplace/mutations";
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
  productCategoryId: string;
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

  const [addProduct, { loading: mutationLoading }] = useMutation(ADD_PRODUCT);
  const [uploading, setUploading] = useState(false);
  const loading = uploading || mutationLoading;

  const handlePublish = useCallback(async (): Promise<boolean> => {
    const storedLanguage = params.lang ?? getCookie(LANGUAGE_COOKIE) ?? undefined;
    const lang = storedLanguage ?? DEFAULT_LANGUAGE;

    try {
      if (target === "MARKETPLACE") {
        // Upload photos in parallel, then create the product with their URLs.
        setUploading(true);
        const imageUrls = await Promise.all(
          form.images.map((file) => uploadProductImage(file)),
        );
        setUploading(false);

        await addProduct({
          variables: {
            input: {
              ...(sellerId ? { sellerId } : {}),
              name: sanitizeOnSubmit(form.name),
              description: sanitizeOnSubmit(form.description),
              brand: sanitizeOnSubmit(form.brand),
              price: Number(form.price),
              productCategoryId: Number(form.productCategoryId),
              condition: form.condition || undefined,
              conditionDescription: sanitizeOnSubmit(form.conditionDescription) || undefined,
              isExchangeable: form.isExchangeable,
              images: imageUrls,
              badges: [],
              interests: [],
            },
          },
        });

        toast.success(t("feedback.publishSuccess"));
        navigateTo({ route: `/${lang}/marketplace` });
        return true;
      }

      // TODO: wire the store / service publish mutations once the gateway
      // exposes them. The wizard already collects the required fields.
      toast.info(
        t("feedback.comingSoon", { target: t(`targetNames.${target ?? "STORE"}`) }),
      );
      return false;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unexpected error");
      return false;
    } finally {
      setUploading(false);
    }
  }, [addProduct, form, navigateTo, params.lang, sellerId, t, target, toast]);

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

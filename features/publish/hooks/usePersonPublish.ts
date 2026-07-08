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
import useAuthStore from "@/store/useAuthStore";
import { getCookie } from "@/utils/cookies";
import { sanitizeOnSubmit } from "@/utils/inputValidations";
import { useMutation } from "@apollo/client/react";
import { useParams } from "next/navigation";
import { useCallback } from "react";

import { useImageUpload } from "./useImageUpload";
import { usePublishForm } from "./usePublishForm";

/** Publishing flow for PERSON sellers: a second-hand product that always goes
 *  to the marketplace. */
export function usePersonPublish() {
  const { navigateTo } = useNavigation();
  const params = useParams<{ lang?: SupportedLanguage }>();
  const toast = useToast();
  const { t } = useTranslation("publish");
  const sellerId = useAuthStore((s) => s.seller?.id);

  const { form, setField, addImage, removeImage } = usePublishForm();
  const { uploading, uploadImages } = useImageUpload();
  const [addProduct, { loading: publishing }] = useMutation(ADD_PRODUCT);

  const handlePublish = useCallback(async (): Promise<boolean> => {
    const lang = params.lang ?? getCookie(LANGUAGE_COOKIE) ?? DEFAULT_LANGUAGE;

    if (!sellerId) {
      toast.error(t("feedback.publishSignInRequired"));
      return false;
    }

    try {
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
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unexpected error");
      return false;
    }
  }, [addProduct, form, navigateTo, params.lang, sellerId, t, toast, uploadImages]);

  return {
    form,
    setField,
    addImage,
    removeImage,
    loading: uploading || publishing,
    handlePublish,
  };
}

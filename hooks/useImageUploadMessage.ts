"use client";
import { useTranslation } from "@/i18n/context";
import { ImageUploadError } from "@/utils/imageUpload";

/**
 * What to tell the person when an image upload fails: what is wrong with the
 * image (format, weight, size) or that it's on our side. Null for an error
 * that isn't an image upload's, so callers keep their own message for those.
 */
export function useImageUploadMessage() {
  const { t } = useTranslation("common");
  return (error: unknown): string | null =>
    error instanceof ImageUploadError ? t(`imageUpload.${error.problem}`) : null;
}

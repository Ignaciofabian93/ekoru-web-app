"use client";
import { useTranslation } from "@/i18n/context";

import { MAX_PRODUCT_IMAGES } from "../../constants/options";
import { ImagePicker } from "../ImagePicker";

export function ImagesField({
  images,
  onAdd,
  onRemove,
  invalid,
}: {
  images: File[];
  onAdd: (file: File) => void;
  onRemove: (index: number) => void;
  invalid?: boolean;
}) {
  const { t } = useTranslation("publish");

  return (
    <ImagePicker
      images={images}
      onAdd={onAdd}
      onRemove={onRemove}
      max={MAX_PRODUCT_IMAGES}
      label={t("form.images")}
      hint={t("form.imagesHint")}
      addLabel={t("form.addPhoto")}
      error={invalid ? t("feedback.imagesRequired") : undefined}
    />
  );
}

"use client";
import { Select } from "@/components/Select/Select";
import { useTranslation } from "@/i18n/context";

import type { ServiceCategoriesState } from "../../hooks/useServiceCategories";

export function ServiceCategoryFields({
  categories,
  invalid,
}: {
  categories: ServiceCategoriesState;
  invalid?: boolean;
}) {
  const { t } = useTranslation("publish");

  return (
    <>
      <Select
        label={t("form.serviceCategory")}
        placeholder={
          categories.loading
            ? t("form.categoryLoading")
            : t("form.serviceCategoryPlaceholder")
        }
        options={categories.categories}
        value={categories.categoryId ?? undefined}
        onChange={(v) => categories.setCategory(Number(v))}
        disabled={categories.loading || categories.categories.length === 0}
      />
      <Select
        label={t("form.serviceSubCategory")}
        placeholder={t("form.serviceSubCategoryPlaceholder")}
        options={categories.subCategories}
        value={categories.subCategoryId ?? undefined}
        onChange={(v) => categories.setSubCategory(Number(v))}
        disabled={categories.categoryId === null}
        errorMessage={invalid ? t("feedback.fieldsRequired") : undefined}
      />
    </>
  );
}

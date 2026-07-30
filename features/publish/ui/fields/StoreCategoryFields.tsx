"use client";
import { Select } from "@/components/Primitives/Select";
import { useTranslation } from "@/i18n/context";

import type { StoreCategoriesState } from "../../hooks/useStoreCategories";

export function StoreCategoryFields({
  categories,
  invalid,
}: {
  categories: StoreCategoriesState;
  invalid?: boolean;
}) {
  const { t } = useTranslation("publish");

  return (
    <>
      <Select
        label={t("form.storeCategory")}
        placeholder={
          categories.loading
            ? t("form.categoryLoading")
            : t("form.storeCategoryPlaceholder")
        }
        options={categories.categories}
        value={categories.categoryId ?? undefined}
        onChange={(v) => categories.setCategory(Number(v))}
        disabled={categories.loading || categories.categories.length === 0}
      />
      <Select
        label={t("form.storeSubCategory")}
        placeholder={t("form.storeSubCategoryPlaceholder")}
        options={categories.subCategories}
        value={categories.subCategoryId ?? undefined}
        onChange={(v) => categories.setSubCategory(Number(v))}
        disabled={categories.categoryId === null}
        errorMessage={invalid ? t("feedback.fieldsRequired") : undefined}
      />
    </>
  );
}

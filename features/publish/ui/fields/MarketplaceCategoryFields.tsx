"use client";
import { Select } from "@/components/Primitives/Select";
import { useTranslation } from "@/i18n/context";

import type { MarketplaceCategoriesState } from "../../hooks/useMarketplaceCategories";

export function MarketplaceCategoryFields({
  categories,
  invalid,
}: {
  categories: MarketplaceCategoriesState;
  invalid?: boolean;
}) {
  const { t } = useTranslation("publish");

  return (
    <>
      <Select
        label={t("form.department")}
        placeholder={
          categories.loading ? t("form.categoryLoading") : t("form.departmentPlaceholder")
        }
        options={categories.departments}
        value={categories.departmentId ?? undefined}
        onChange={(v) => categories.setDepartment(Number(v))}
        disabled={categories.loading || categories.departments.length === 0}
      />
      <Select
        label={t("form.departmentCategory")}
        placeholder={t("form.departmentCategoryPlaceholder")}
        options={categories.departmentCategories}
        value={categories.departmentCategoryId ?? undefined}
        onChange={(v) => categories.setDepartmentCategory(Number(v))}
        disabled={categories.departmentId === null}
      />
      <Select
        label={t("form.productCategory")}
        placeholder={t("form.productCategoryPlaceholder")}
        options={categories.productCategories}
        value={categories.productCategoryId ?? undefined}
        onChange={(v) => categories.setProductCategory(Number(v))}
        disabled={categories.departmentCategoryId === null}
        errorMessage={invalid ? t("feedback.fieldsRequired") : undefined}
      />
    </>
  );
}

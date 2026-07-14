"use client";
import { Text } from "@/components/Text/Text";
import { Title } from "@/components/Title/Title";
import type { SupportedLanguage } from "@/constants/settings";
import { useTranslation } from "@/i18n/context";
import { useMemo } from "react";

import { useProductsByDepartment } from "../hooks/useProductsByDepartment";
import { NAMESPACE } from "../i18n";
import type { CatalogDepartmentCategory } from "../types";
import { Breadcrumbs } from "./Breadcrumbs";
import { CategoryList } from "./CategoryList";
import { ProductFilters } from "./ProductFilters";
import { ProductResults } from "./ProductResults";

interface Props {
  lang: SupportedLanguage;
  slug: string;
}

export function DepartmentContent({ lang, slug }: Props) {
  const { t } = useTranslation(NAMESPACE);

  const {
    products,
    pageInfo,
    department,
    loading,
    filters,
    sort,
    pageSize,
    setField,
    setSort,
    reset,
    handlePageChange,
    handlePageSizeChange,
  } = useProductsByDepartment({ language: lang, slug });

  const departmentName = department?.translation?.name ?? slug;

  const categories: CatalogDepartmentCategory[] = useMemo(
    () =>
      (department?.departmentCategory ?? []).map((cat) => ({
        id: cat.id,
        name: cat.translation?.name ?? "",
        slug: cat.translation?.slug ?? "",
        href: cat.translation?.href ?? "",
        productCategories: (cat.productCategory ?? []).map((pc) => ({
          id: pc.id,
          name: pc.translation?.name ?? "",
          slug: pc.translation?.slug ?? "",
          href: pc.translation?.href ?? "",
        })),
      })),
    [department],
  );

  return (
    <div className="flex flex-col gap-8">
      <Breadcrumbs
        rootHref={`/${lang}/marketplace`}
        items={[{ label: departmentName }]}
      />

      <div className="flex flex-col gap-1">
        <Title level="h1" size="h3">
          {t("page.departmentTitle", { name: departmentName })}
        </Title>
        <Text color="secondary">
          {t("page.departmentSubtitle", { name: departmentName })}
        </Text>
      </div>

      <CategoryList lang={lang} departmentSlug={slug} categories={categories} />

      <ProductFilters
        filters={filters}
        sort={sort}
        setField={setField}
        setSort={setSort}
        reset={reset}
      />

      <ProductResults
        lang={lang}
        products={products}
        loading={loading}
        pageInfo={pageInfo}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}

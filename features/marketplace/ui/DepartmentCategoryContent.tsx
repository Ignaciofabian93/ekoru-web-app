"use client";
import { Title } from "@/components/Title/Title";
import { Text } from "@/components/Text/Text";
import { useTranslation } from "@/i18n/context";
import { useMemo } from "react";

import { useDepartmentBySlug } from "../hooks/useDepartmentBySlug";
import { useDepartmentCategoryBySlug } from "../hooks/useDepartmentCategoryBySlug";
import { useMarketplaceCatalog } from "../hooks/useMarketplaceCatalog";
import { useProductFilters } from "../hooks/useProductFilters";
import { NAMESPACE } from "../i18n";
import type { Language } from "../types";
import { Breadcrumbs } from "./Breadcrumbs";
import { CategoryList } from "./CategoryList";
import { DepartmentList } from "./DepartmentList";
import { ProductCategoryList } from "./ProductCategoryList";
import { ProductFilters } from "./ProductFilters";
import { ProductResults } from "./ProductResults";

interface Props {
  lang: string;
  language: Language;
  departmentSlug: string;
  categorySlug: string;
}

export function DepartmentCategoryContent({
  lang,
  language,
  departmentSlug,
  categorySlug,
}: Props) {
  const { t } = useTranslation(NAMESPACE);

  const { departments, loading: catalogLoading } = useMarketplaceCatalog(language);

  // Department lookup is reused so the sibling-category bar can render even
  // before we hit the category endpoint. The catalog query is cache-first so
  // both calls coalesce on a single network round trip.
  const { department, departmentLoading } = useDepartmentBySlug({
    slug: departmentSlug,
    language,
    page: 1,
    pageSize: 1,
  });

  const {
    filters,
    sort,
    page,
    pageSize,
    setField,
    setSort,
    setPage,
    setPageSize,
    reset,
    filterInput,
    sortInput,
  } = useProductFilters();

  const categoryVars = useMemo(
    () => ({
      slug: categorySlug,
      language,
      page,
      pageSize,
      filter: filterInput,
      sort: sortInput,
    }),
    [categorySlug, language, page, pageSize, filterInput, sortInput],
  );

  const { category, categoryLoading, products, pageInfo, productsLoading } =
    useDepartmentCategoryBySlug(categoryVars);

  const departmentName = department?.name ?? departmentSlug;
  const categoryName = category?.name ?? categorySlug;

  return (
    <div className="flex flex-col gap-8">
      <Breadcrumbs
        rootHref={`/${lang}/marketplace`}
        items={[
          {
            label: departmentName,
            href: `/${lang}/marketplace/${departmentSlug}`,
          },
          { label: categoryName },
        ]}
      />

      <div className="flex flex-col gap-1">
        <Title level="h1" size="h3">
          {categoryLoading && !category
            ? categorySlug
            : t("page.categoryTitle", { name: categoryName })}
        </Title>
        <Text color="secondary">
          {t("page.categorySubtitle", { name: categoryName })}
        </Text>
      </div>

      <DepartmentList
        lang={lang}
        departments={departments}
        activeSlug={departmentSlug}
        loading={catalogLoading}
      />

      <CategoryList
        lang={lang}
        departmentSlug={departmentSlug}
        categories={department?.categories ?? []}
        activeSlug={categorySlug}
      />

      <ProductCategoryList
        productCategories={category?.productCategories ?? []}
      />

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
        loading={productsLoading || departmentLoading}
        pageInfo={pageInfo}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}

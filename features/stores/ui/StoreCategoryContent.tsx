"use client";
import { Text } from "@/components/Text/Text";
import { Title } from "@/components/Title/Title";
import { useTranslation } from "@/i18n/context";
import { useMemo } from "react";

import { useStoreCatalog } from "../hooks/useStoreCatalog";
import { useStoreCategoryBySlug } from "../hooks/useStoreCategoryBySlug";
import { useStoreFilters } from "../hooks/useStoreFilters";
import { NAMESPACE } from "../i18n";
import type { Language } from "../types";
import { StoreBreadcrumbs } from "./StoreBreadcrumbs";
import { StoreCategoryList } from "./StoreCategoryList";
import { StoreFilters } from "./StoreFilters";
import { StoreProductResults } from "./StoreProductResults";
import { StoreSubCategoryList } from "./StoreSubCategoryList";

interface Props {
  lang: string;
  language: Language;
  slug: string;
}

export function StoreCategoryContent({ lang, language, slug }: Props) {
  const { t } = useTranslation(NAMESPACE);

  const { categories, loading: catalogLoading } = useStoreCatalog(language);

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
  } = useStoreFilters();

  const queryVars = useMemo(
    () => ({
      slug,
      language,
      page,
      pageSize,
      filter: filterInput,
      sort: sortInput,
    }),
    [slug, language, page, pageSize, filterInput, sortInput],
  );

  const { category, categoryLoading, products, pageInfo, productsLoading } =
    useStoreCategoryBySlug(queryVars);

  const name = category?.name ?? "";

  return (
    <div className="flex flex-col gap-8">
      <StoreBreadcrumbs
        rootHref={`/${lang}/stores`}
        items={[{ label: name || slug }]}
      />

      <div className="flex flex-col gap-1">
        <Title level="h1" size="h3">
          {categoryLoading && !name ? slug : t("page.categoryTitle", { name })}
        </Title>
        <Text color="secondary">
          {t("page.categorySubtitle", { name: name || slug })}
        </Text>
      </div>

      <StoreCategoryList
        lang={lang}
        categories={categories}
        activeSlug={slug}
        loading={catalogLoading}
      />

      <StoreSubCategoryList subCategoryItems={category?.subCategoryItems ?? []} />

      <StoreFilters
        filters={filters}
        sort={sort}
        setField={setField}
        setSort={setSort}
        reset={reset}
      />

      <StoreProductResults
        lang={lang}
        products={products}
        loading={productsLoading}
        pageInfo={pageInfo}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}

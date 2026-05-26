"use client";
import { useTranslation } from "@/i18n/context";
import { Title } from "@/components/Title/Title";
import { Text } from "@/components/Text/Text";
import { useMemo } from "react";

import { useDepartmentBySlug } from "../hooks/useDepartmentBySlug";
import { useMarketplaceCatalog } from "../hooks/useMarketplaceCatalog";
import { useProductFilters } from "../hooks/useProductFilters";
import { NAMESPACE } from "../i18n";
import type { Language } from "../types";
import { Breadcrumbs } from "./Breadcrumbs";
import { CategoryList } from "./CategoryList";
import { DepartmentList } from "./DepartmentList";
import { ProductFilters } from "./ProductFilters";
import { ProductResults } from "./ProductResults";

interface Props {
  lang: string;
  language: Language;
  slug: string;
}

export function DepartmentContent({ lang, language, slug }: Props) {
  const { t } = useTranslation(NAMESPACE);

  const { departments, loading: catalogLoading } = useMarketplaceCatalog(language);

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

  const { department, departmentLoading, products, pageInfo, productsLoading } =
    useDepartmentBySlug(queryVars);

  const name = department?.name ?? "";

  return (
    <div className="flex flex-col gap-8">
      <Breadcrumbs
        rootHref={`/${lang}/marketplace`}
        items={[{ label: name || slug }]}
      />

      <div className="flex flex-col gap-1">
        <Title level="h1" size="h3">
          {departmentLoading && !name
            ? slug
            : t("page.departmentTitle", { name })}
        </Title>
        <Text color="secondary">
          {t("page.departmentSubtitle", { name: name || slug })}
        </Text>
      </div>

      <DepartmentList
        lang={lang}
        departments={departments}
        activeSlug={slug}
        loading={catalogLoading}
      />

      <CategoryList
        lang={lang}
        departmentSlug={slug}
        categories={department?.categories ?? []}
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
        loading={productsLoading}
        pageInfo={pageInfo}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}

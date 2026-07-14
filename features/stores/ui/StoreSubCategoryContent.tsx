"use client";
import { Text } from "@/components/Text/Text";
import { Title } from "@/components/Title/Title";
import type { SupportedLanguage } from "@/constants/settings";
import { useTranslation } from "@/i18n/context";

import { useProductsByStoreSubCategory } from "../hooks/useProductsByStoreSubCategory";
import { NAMESPACE } from "../i18n";
import { StoreBreadcrumbs } from "./StoreBreadcrumbs";
import { StoreFilters } from "./StoreFilters";
import { StoreProductResults } from "./StoreProductResults";

interface Props {
  lang: SupportedLanguage;
  categorySlug: string;
  subCategorySlug: string;
}

export function StoreSubCategoryContent({
  lang,
  categorySlug,
  subCategorySlug,
}: Props) {
  const { t } = useTranslation(NAMESPACE);

  const {
    products,
    pageInfo,
    storeSubCategory,
    loading,
    filters,
    sort,
    pageSize,
    setField,
    setSort,
    reset,
    handlePageChange,
    handlePageSizeChange,
  } = useProductsByStoreSubCategory({ language: lang, slug: subCategorySlug });

  const subCategoryName = storeSubCategory?.translation?.name ?? subCategorySlug;

  return (
    <div className="flex flex-col gap-8">
      <StoreBreadcrumbs
        rootHref={`/${lang}/stores`}
        items={[
          { label: categorySlug, href: `/${lang}/stores/${categorySlug}` },
          { label: subCategoryName },
        ]}
      />

      <div className="flex flex-col gap-1">
        <Title level="h1" size="h3">
          {t("page.categoryTitle", { name: subCategoryName })}
        </Title>
        <Text color="secondary">
          {t("page.categorySubtitle", { name: subCategoryName })}
        </Text>
      </div>

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
        loading={loading}
        pageInfo={pageInfo}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}

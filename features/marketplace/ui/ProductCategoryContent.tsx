"use client";
import { Text } from "@/components/Text/Text";
import { Title } from "@/components/Title/Title";
import type { SupportedLanguage } from "@/constants/settings";
import { useTranslation } from "@/i18n/context";

import { useProductsByProductCategory } from "../hooks/useProductsByProductCategory";
import { NAMESPACE } from "../i18n";
import { Breadcrumbs } from "./Breadcrumbs";
import { ProductFilters } from "./ProductFilters";
import { ProductResults } from "./ProductResults";

interface Props {
  lang: SupportedLanguage;
  departmentSlug: string;
  categorySlug: string;
  productCategorySlug: string;
}

export function ProductCategoryContent({
  lang,
  departmentSlug,
  categorySlug,
  productCategorySlug,
}: Props) {
  const { t } = useTranslation(NAMESPACE);

  const {
    products,
    pageInfo,
    productCategory,
    loading,
    filters,
    sort,
    pageSize,
    setField,
    setSort,
    reset,
    handlePageChange,
    handlePageSizeChange,
  } = useProductsByProductCategory({ language: lang, slug: productCategorySlug });

  const productCategoryName =
    productCategory?.translation?.name ?? productCategorySlug;

  return (
    <div className="flex flex-col gap-8">
      <Breadcrumbs
        rootHref={`/${lang}/marketplace`}
        items={[
          {
            label: departmentSlug,
            href: `/${lang}/marketplace/${departmentSlug}`,
          },
          {
            label: categorySlug,
            href: `/${lang}/marketplace/${departmentSlug}/${categorySlug}`,
          },
          { label: productCategoryName },
        ]}
      />

      <div className="flex flex-col gap-1">
        <Title level="h1" size="h3">
          {t("page.categoryTitle", { name: productCategoryName })}
        </Title>
        <Text color="secondary">
          {t("page.categorySubtitle", { name: productCategoryName })}
        </Text>
      </div>

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

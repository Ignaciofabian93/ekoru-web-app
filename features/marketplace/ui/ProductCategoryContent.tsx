"use client";
import { InnerContentLayout } from "@/components/Layout/ContentLayout";
import type { SupportedLanguage } from "@/constants/settings";
import { useTranslation } from "@/i18n/context";
import { Fragment } from "react";
import { useProductsByProductCategory } from "../hooks/useProductsByProductCategory";
import { NAMESPACE } from "../i18n";
import { InnerHero } from "./InnerHero";
import { MarketplaceFilters } from "./MarketplaceFilters";
import { ProductResults } from "./ProductResults";
import { humanizeSlug } from "@/utils/formatters";
import type { Crumb } from "@/components/BreadCrumbs/Breadcrumb";

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

  const productCategoryName = productCategory?.translation?.name ?? productCategorySlug;

  const breadCrumbs: Crumb[] = [
    { label: t("breadcrumbs.marketplace"), href: `/${lang}/marketplace` },
    {
      label: humanizeSlug(departmentSlug),
      href: `/${lang}/marketplace/${departmentSlug}`,
    },
    {
      label: humanizeSlug(categorySlug),
      href: `/${lang}/marketplace/${departmentSlug}/${categorySlug}`,
    },
    { label: productCategoryName },
  ];

  return (
    <Fragment>
      <InnerHero
        categoryTitle={t("page.categoryTitle", { name: productCategoryName })}
        categorySubtitle={t("page.categorySubtitle", { name: productCategoryName })}
        breadCrumbs={breadCrumbs}
      />

      <InnerContentLayout>
        <MarketplaceFilters
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
      </InnerContentLayout>
    </Fragment>
  );
}

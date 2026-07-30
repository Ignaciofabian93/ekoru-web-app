"use client";
import type { SupportedLanguage } from "@/constants/settings";
import { useTranslation } from "@/i18n/context";
import { Fragment } from "react";

import { useProductsByStoreSubCategory } from "../hooks/useProductsByStoreSubCategory";
import { NAMESPACE } from "../i18n";
import { BreadcrumbHero } from "@/components/Patterns/BreadcrumbHero";
import { StoreFilters } from "./StoreFilters";
import { StoreProductResults } from "./StoreProductResults";
import { humanizeSlug } from "@/utils/formatters";
import type { Crumb } from "@/components/Patterns/Breadcrumb";
import { Container, Section } from "@/components/Layout";

interface Props {
  lang: SupportedLanguage;
  categorySlug: string;
  subCategorySlug: string;
}

export function StoreSubCategoryContent({ lang, categorySlug, subCategorySlug }: Props) {
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

  const breadCrumbs: Crumb[] = [
    { label: t("breadcrumbs.stores"), href: `/${lang}/stores` },
    {
      label: humanizeSlug(categorySlug),
      href: `/${lang}/stores/${categorySlug}`,
    },
    { label: subCategoryName },
  ];

  return (
    <Fragment>
      <BreadcrumbHero
        title={t("page.categoryTitle", { name: subCategoryName })}
        subtitle={t("page.categorySubtitle", { name: subCategoryName })}
        breadCrumbs={breadCrumbs}
      />

      <Container width="default">
        <Section>
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
        </Section>
      </Container>
    </Fragment>
  );
}

"use client";
import type { SupportedLanguage } from "@/constants/settings";
import { useTranslation } from "@/i18n/context";
import { Fragment, useMemo } from "react";

import { useProductsByStoreCategory } from "../hooks/useProductsByStoreCategory";
import { NAMESPACE } from "../i18n";
import type { StoreCatalogSubItem } from "../types";
import { BreadcrumbHero } from "@/components/Patterns/BreadcrumbHero";
import { StoreFilters } from "./StoreFilters";
import { StoreProductResults } from "./StoreProductResults";
import { StoreSubCategoryList } from "./StoreSubCategoryList";
import type { Crumb } from "@/components/Patterns/Breadcrumb";
import { Container, Section } from "@/components/Layout";

interface Props {
  lang: SupportedLanguage;
  slug: string;
}

export function StoreCategoryContent({ lang, slug }: Props) {
  const { t } = useTranslation(NAMESPACE);

  const {
    products,
    pageInfo,
    storeCategory,
    loading,
    filters,
    sort,
    pageSize,
    setField,
    setSort,
    reset,
    handlePageChange,
    handlePageSizeChange,
  } = useProductsByStoreCategory({ language: lang, slug });

  const categoryName = storeCategory?.translation?.name ?? slug;

  const subCategoryItems: StoreCatalogSubItem[] = useMemo(
    () =>
      (storeCategory?.storeSubCategory ?? []).map((sub) => ({
        id: sub.id,
        name: sub.translation?.name ?? "",
        slug: sub.translation?.slug ?? "",
        href: sub.translation?.href ?? "",
      })),
    [storeCategory],
  );

  const breadCrumbs: Crumb[] = [
    { label: t("breadcrumbs.stores"), href: `/${lang}/stores` },
    { label: categoryName },
  ];

  return (
    <Fragment>
      <BreadcrumbHero
        title={t("page.categoryTitle", { name: categoryName })}
        subtitle={t("page.categorySubtitle", { name: categoryName })}
        breadCrumbs={breadCrumbs}
      />

      <Container width="default">
        <Section>
          <StoreSubCategoryList
            lang={lang}
            categorySlug={slug}
            subCategoryItems={subCategoryItems}
          />

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

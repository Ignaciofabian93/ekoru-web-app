"use client";
import type { SupportedLanguage } from "@/constants/settings";
import { useTranslation } from "@/i18n/context";
import { Fragment, useMemo } from "react";
import { useProductsByDepartmentCategory } from "../hooks/useProductsByDepartmentCategory";
import { NAMESPACE } from "../i18n";
import type { CatalogProductCategory } from "../types";
import { CategoryList } from "./CategoryList";
import { InnerHero } from "./InnerHero";
import { MarketplaceFilters } from "./MarketplaceFilters";
import { ProductResults } from "./ProductResults";
import { type UnderlineTab } from "@/components/UnderlineTabs/UnderlineTabs";
import { humanizeSlug } from "@/utils/formatters";
import type { Crumb } from "@/components/BreadCrumbs/Breadcrumb";
import { Layout } from "@/components/Layout/Layout";

interface Props {
  lang: SupportedLanguage;
  departmentSlug: string;
  categorySlug: string;
}

export function DepartmentCategoryContent({ lang, departmentSlug, categorySlug }: Props) {
  const { t } = useTranslation(NAMESPACE);

  const {
    products,
    pageInfo,
    departmentCategory,
    loading,
    filters,
    sort,
    pageSize,
    setField,
    setSort,
    reset,
    handlePageChange,
    handlePageSizeChange,
  } = useProductsByDepartmentCategory({ language: lang, slug: categorySlug });

  const categoryName =
    departmentCategory?.translation?.name ?? humanizeSlug(categorySlug);

  const productCategories: CatalogProductCategory[] = useMemo(
    () =>
      (departmentCategory?.productCategory ?? []).map((pc) => ({
        id: pc.id,
        name: pc.translation?.name ?? "",
        slug: pc.translation?.slug ?? "",
        href: pc.translation?.href ?? "",
      })),
    [departmentCategory],
  );

  const breadCrumbs: Crumb[] = [
    { label: t("breadcrumbs.marketplace"), href: `/${lang}/marketplace` },
    {
      label: humanizeSlug(departmentSlug),
      href: `/${lang}/marketplace/${departmentSlug}`,
    },
    { label: categoryName },
  ];

  const tabs: UnderlineTab[] = productCategories.map((pc) => ({
    key: pc.slug,
    label: pc.name,
    href: `/${lang}/marketplace/${departmentSlug}/${categorySlug}/${pc.slug}`,
  }));

  return (
    <Fragment>
      <InnerHero
        categoryTitle={t("page.categoryTitle", { name: categoryName })}
        categorySubtitle={t("page.categorySubtitle", { name: categoryName })}
        breadCrumbs={breadCrumbs}
      />

      <Layout.Container size="default">
        <Layout.Section>
          <CategoryList
            tabs={tabs}
            remeasureKey={lang}
            label={t("sections.productCategories")}
            ariaLabel={t("sections.productCategories")}
          />

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
        </Layout.Section>
      </Layout.Container>
    </Fragment>
  );
}

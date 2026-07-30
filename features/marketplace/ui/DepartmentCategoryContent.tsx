"use client";
import type { SupportedLanguage } from "@/constants/settings";
import { useTranslation } from "@/i18n/context";
import { Fragment, useMemo } from "react";
import { useProductsByDepartmentCategory } from "../hooks/useProductsByDepartmentCategory";
import { NAMESPACE } from "../i18n";
import type { CatalogProductCategory } from "../types";
import { CategoryList } from "./CategoryList";
import { BreadcrumbHero } from "@/components/Patterns/BreadcrumbHero";
import { MarketplaceFilters } from "./MarketplaceFilters";
import { ProductResults } from "./ProductResults";
import { type Tab } from "@/components/Patterns/Tabs";
import { humanizeSlug } from "@/utils/formatters";
import type { Crumb } from "@/components/Patterns/Breadcrumb";
import { Container, Section } from "@/components/Layout";

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

  const tabs: Tab[] = productCategories.map((pc) => ({
    key: pc.slug,
    label: pc.name,
    href: `/${lang}/marketplace/${departmentSlug}/${categorySlug}/${pc.slug}`,
  }));

  return (
    <Fragment>
      <BreadcrumbHero
        title={t("page.categoryTitle", { name: categoryName })}
        subtitle={t("page.categorySubtitle", { name: categoryName })}
        breadCrumbs={breadCrumbs}
      />

      <Container width="default">
        <Section>
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
        </Section>
      </Container>
    </Fragment>
  );
}

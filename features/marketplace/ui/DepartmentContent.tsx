"use client";
import type { SupportedLanguage } from "@/constants/settings";
import { useTranslation } from "@/i18n/context";
import { Fragment, useMemo } from "react";
import { useProductsByDepartment } from "../hooks/useProductsByDepartment";
import { NAMESPACE } from "../i18n";
import type { CatalogDepartmentCategory } from "../types";
import { CategoryList } from "./CategoryList";
import { MarketplaceFilters } from "./MarketplaceFilters";
import { ProductResults } from "./ProductResults";
import { BreadcrumbHero } from "@/components/Patterns/BreadcrumbHero";
import { type Tab } from "@/components/Patterns/Tabs";
import { humanizeSlug } from "@/utils/formatters";
import type { Crumb } from "@/components/Patterns/Breadcrumb";
import { Container, Section } from "@/components/Layout";

interface Props {
  lang: SupportedLanguage;
  slug: string;
}

export function DepartmentContent({ lang, slug }: Props) {
  const { t } = useTranslation(NAMESPACE);

  const {
    products,
    pageInfo,
    department,
    loading,
    filters,
    sort,
    pageSize,
    setField,
    setSort,
    reset,
    handlePageChange,
    handlePageSizeChange,
  } = useProductsByDepartment({ language: lang, slug });

  const departmentName = department?.translation?.name ?? humanizeSlug(slug);

  const categories: CatalogDepartmentCategory[] = useMemo(
    () =>
      (department?.departmentCategory ?? []).map((cat) => ({
        id: cat.id,
        name: cat.translation?.name ?? "",
        slug: cat.translation?.slug ?? "",
        href: cat.translation?.href ?? "",
        productCategories: (cat.productCategory ?? []).map((pc) => ({
          id: pc.id,
          name: pc.translation?.name ?? "",
          slug: pc.translation?.slug ?? "",
          href: pc.translation?.href ?? "",
        })),
      })),
    [department],
  );

  const breadCrumbs: Crumb[] = [
    { label: t("breadcrumbs.marketplace"), href: `/${lang}/marketplace` },
    ...[{ label: departmentName }],
  ];

  const ALL_KEY = "__all__";

  const tabs: Tab[] = [
    {
      key: ALL_KEY,
      label: t("sections.allCategories"),
      href: `/${lang}/marketplace/${slug}`,
    },
    ...categories.map((cat) => ({
      key: cat.slug,
      label: cat.name,
      href: `/${lang}/marketplace/${slug}/${cat.slug}`,
    })),
  ];

  return (
    <Fragment>
      <BreadcrumbHero
        title={t("page.departmentTitle", { name: departmentName })}
        subtitle={t("page.departmentSubtitle", { name: departmentName })}
        breadCrumbs={breadCrumbs}
      />

      <Container width="default">
        <Section>
          <CategoryList
            tabs={tabs}
            activeKey={ALL_KEY}
            remeasureKey={lang}
            label={t("sections.categories")}
            ariaLabel={t("sections.categories")}
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

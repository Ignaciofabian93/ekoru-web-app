"use client";
import { useTranslation } from "@/i18n/context";
import { type UnderlineTab } from "@/components/UnderlineTabs/UnderlineTabs";
import { Fragment, useMemo } from "react";
import { useMarketplaceCatalog } from "../hooks/useMarketplaceCatalog";
import { useProductFilters } from "../hooks/useProductFilters";
import { useProducts } from "../hooks/useProducts";
import { NAMESPACE } from "../i18n";
import type { Language } from "../types";
import { CategoryList } from "./CategoryList";
import { MarketplaceFilters } from "./MarketplaceFilters";
import { ProductResults } from "./ProductResults";
import { InnerContentLayout } from "@/components/Layout/ContentLayout";

const ALL_KEY = "__all__";

interface Props {
  lang: string;
  language: Language;
}

export function MarketplaceContent({ lang, language }: Props) {
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

  const productsQuery = useMemo(
    () => ({ page, pageSize, filter: filterInput, sort: sortInput }),
    [page, pageSize, filterInput, sortInput],
  );

  const { products, pageInfo, loading } = useProducts(productsQuery);

  // Only build the row once departments arrive; an empty list keeps the
  // CategoryList skeleton visible while the catalog loads.
  const departmentTabs: UnderlineTab[] = departments.length
    ? [
        {
          key: ALL_KEY,
          label: t("sections.allDepartments"),
          href: `/${lang}/marketplace`,
        },
        ...departments.map((dep) => ({
          key: dep.slug,
          label: dep.name,
          href: `/${lang}/marketplace/${dep.slug}`,
        })),
      ]
    : [];

  return (
    <Fragment>
      <InnerContentLayout>
        <CategoryList
          tabs={departmentTabs}
          activeKey={ALL_KEY}
          remeasureKey={lang}
          loading={catalogLoading}
          label={t("sections.departments")}
          ariaLabel={t("sections.departments")}
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
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </InnerContentLayout>
    </Fragment>
  );
}

"use client";
import { useMemo } from "react";

import { useMarketplaceCatalog } from "../hooks/useMarketplaceCatalog";
import { useProductFilters } from "../hooks/useProductFilters";
import { useProducts } from "../hooks/useProducts";
import type { Language } from "../types";
import { DepartmentList } from "./DepartmentList";
import { ProductFilters } from "./ProductFilters";
import { ProductResults } from "./ProductResults";

interface Props {
  lang: string;
  language: Language;
}

export function MarketplaceContent({ lang, language }: Props) {
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

  return (
    <div className="flex flex-col gap-8">
      <DepartmentList
        lang={lang}
        departments={departments}
        loading={catalogLoading}
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
        loading={loading}
        pageInfo={pageInfo}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}

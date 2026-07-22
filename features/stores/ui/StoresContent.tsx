"use client";
import { useMemo } from "react";
import { useStoreCatalog } from "../hooks/useStoreCatalog";
import { useStoreFilters } from "../hooks/useStoreFilters";
import { useStoreProducts } from "../hooks/useStoreProducts";
import type { Language } from "../types";
import { StoreCategoryList } from "./StoreCategoryList";
import { StoreFilters } from "./StoreFilters";
import { StoreProductResults } from "./StoreProductResults";
import { Layout } from "@/components/Layout/Layout";

interface Props {
  lang: string;
  language: Language;
}

export function StoresContent({ lang, language }: Props) {
  const { categories, loading: catalogLoading } = useStoreCatalog(language);

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
  } = useStoreFilters();

  const productsQuery = useMemo(
    () => ({ page, pageSize, filter: filterInput, sort: sortInput }),
    [page, pageSize, filterInput, sortInput],
  );

  const { products, pageInfo, loading } = useStoreProducts(productsQuery);

  return (
    <Layout.Section>
      <StoreCategoryList lang={lang} categories={categories} loading={catalogLoading} />

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
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </Layout.Section>
  );
}

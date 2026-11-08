"use client";
import { useTranslation } from "@/i18n/context";
import { useCategoryParam } from "@/hooks/useCategoryParam";
import { NAMESPACE } from "../i18n";
import { useStoreCatalog } from "../hooks/useStoreCatalog";
import { useStoreFilters } from "../hooks/useStoreFilters";
import { useStoreProducts } from "../hooks/useStoreProducts";
import { useStoreSellers } from "../hooks/useStoreSellers";
import type { Language } from "../types";
import { StoreFilters } from "./StoreFilters";
import { StoreProductResults } from "./StoreProductResults";
import { Section } from "@/components/Layout";
import { BusinessRow, type BusinessRowItem } from "@/components/Patterns/BusinessRow";
import { CategoryFilter } from "@/components/Patterns/CategoryFilter";

interface Props {
  lang: string;
  language: Language;
}

export function StoresContent({ lang, language }: Props) {
  const { t } = useTranslation(NAMESPACE);
  const { categories, loading: catalogLoading } = useStoreCatalog(language);
  const { category: categorySlug, setCategory } = useCategoryParam();

  const activeCategory = categories.find((cat) => cat.slug === categorySlug);
  // A shared ?category= link waits for the catalog instead of showing every
  // store and product first.
  const waiting = Boolean(categorySlug) && catalogLoading && !activeCategory;

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

  const { products, pageInfo, loading } = useStoreProducts({
    categoryId: activeCategory?.id,
    page,
    pageSize,
    filter: filterInput,
    sort: sortInput,
    skip: waiting,
  });

  const { sellers, loading: sellersLoading } = useStoreSellers({
    categoryId: activeCategory?.id,
    skip: waiting,
  });

  const storeItems: BusinessRowItem[] = sellers.map((row) => ({
    sellerId: row.sellerId,
    name: row.seller?.profile?.businessName || t("sections.unnamedStore"),
    logo: row.seller?.profile?.logo,
    caption: t(row.productCount === 1 ? "results.count" : "results.countPlural", {
      count: String(row.productCount),
    }),
  }));

  const selectCategory = (slug: string | null) => {
    setCategory(slug);
    setPage(1);
  };

  return (
    <Section>
      <CategoryFilter
        title={t("sections.categories")}
        allLabel={t("sections.allCategories")}
        categories={categories}
        activeSlug={categorySlug}
        onSelect={selectCategory}
        loading={catalogLoading}
        remeasureKey={lang}
      />

      <BusinessRow
        lang={lang}
        title={
          activeCategory
            ? t("sections.storesIn", { name: activeCategory.name })
            : t("sections.stores")
        }
        items={storeItems}
        loading={sellersLoading}
        scrollPreviousLabel={t("scroll.previous")}
        scrollNextLabel={t("scroll.next")}
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
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </Section>
  );
}

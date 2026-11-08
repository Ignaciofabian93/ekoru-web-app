"use client";
import { Fragment, useState } from "react";
import { Title } from "@/components/Primitives/Title";
import { useTranslation } from "@/i18n/context";
import { useCategoryParam } from "@/hooks/useCategoryParam";

import { useServiceProviders } from "../hooks/useServiceProviders";
import { useServices } from "../hooks/useServices";
import { useServicesCatalog } from "../hooks/useServicesCatalog";
import { NAMESPACE } from "../i18n";
import type { Language } from "../types";
import { EmptyState } from "@/components/Feedback/EmptyState";
import { ServiceList } from "./ServiceList";
import { Section } from "@/components/Layout";
import { BusinessRow, type BusinessRowItem } from "@/components/Patterns/BusinessRow";
import { CategoryFilter } from "@/components/Patterns/CategoryFilter";
import { Pagination } from "@/components/Patterns/Pagination";

interface Props {
  lang: string;
  language: Language;
}

export function ServicesContent({ lang, language }: Props) {
  const { t } = useTranslation(NAMESPACE);
  const { categories, loading: catalogLoading } = useServicesCatalog(language);
  const { category: categorySlug, setCategory } = useCategoryParam();
  const [page, setPage] = useState(1);

  const activeCategory = categories.find((cat) => cat.slug === categorySlug);
  // A shared ?category= link waits for the catalog instead of showing every
  // provider and service first.
  const waiting = Boolean(categorySlug) && catalogLoading && !activeCategory;

  const {
    services,
    pageInfo,
    loading: servicesLoading,
  } = useServices({
    categorySlug: activeCategory?.slug,
    language,
    page,
    skip: waiting,
  });

  const { providers, loading: providersLoading } = useServiceProviders({
    categoryId: activeCategory?.id,
    skip: waiting,
  });

  const providerItems: BusinessRowItem[] = providers.map((row) => ({
    sellerId: row.sellerId,
    name: row.seller?.profile?.businessName || t("sections.unnamedProvider"),
    logo: row.seller?.profile?.logo,
    caption: t(
      row.serviceCount === 1 ? "sections.serviceCount" : "sections.serviceCountPlural",
      { count: String(row.serviceCount) },
    ),
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
            ? t("sections.providersIn", { name: activeCategory.name })
            : t("sections.providers")
        }
        items={providerItems}
        loading={providersLoading}
        scrollPreviousLabel={t("scroll.previous")}
        scrollNextLabel={t("scroll.next")}
      />

      <section className="flex flex-col gap-4">
        <Title level="h2" size="h5">
          {activeCategory
            ? t("sections.servicesIn", { name: activeCategory.name })
            : t("sections.services")}
        </Title>

        {servicesLoading && services.length === 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-3/4 animate-pulse rounded-xl bg-background-secondary"
              />
            ))}
          </div>
        ) : services.length === 0 ? (
          <EmptyState
            variant="compact"
            title={t("detail.noServices")}
            description={t("detail.noServicesHint")}
          />
        ) : (
          <Fragment>
            <ServiceList services={services} lang={lang} />
            {pageInfo && pageInfo.totalPages > 1 && (
              <Pagination
                currentPage={pageInfo.currentPage}
                totalPages={pageInfo.totalPages}
                onPageChange={setPage}
              />
            )}
          </Fragment>
        )}
      </section>
    </Section>
  );
}

"use client";
import { Pagination } from "@/components/Patterns/Pagination";
import { Title } from "@/components/Primitives/Title";
import type { SupportedLanguage } from "@/constants/settings";
import { useTranslation } from "@/i18n/context";
import { Fragment } from "react";

import { useServicesBySubcategory } from "../hooks/useServicesBySubcategory";
import { NAMESPACE } from "../i18n";
import { EmptyState } from "@/components/Feedback/EmptyState";
import { BreadcrumbHero } from "@/components/Patterns/BreadcrumbHero";
import { ServiceList } from "./ServiceList";
import { humanizeSlug } from "@/utils/formatters";
import type { Crumb } from "@/components/Patterns/Breadcrumb";
import { Container, Section } from "@/components/Layout";

interface Props {
  lang: SupportedLanguage;
  /** Parent category slug from the route (used for the breadcrumb). */
  categorySlug: string;
  /** Subcategory slug from the route. */
  slug: string;
}

export function ServiceSubcategoryContent({ lang, categorySlug, slug }: Props) {
  const { t } = useTranslation(NAMESPACE);

  const { services, pageInfo, serviceSubCategory, loading, handlePageChange } =
    useServicesBySubcategory({ language: lang, slug });

  const translation = serviceSubCategory?.translation;
  const name =
    translation?.subCategory ?? serviceSubCategory?.subCategory ?? humanizeSlug(slug);

  const breadCrumbs: Crumb[] = [
    { label: t("breadcrumbs.services"), href: `/${lang}/services` },
    {
      label: humanizeSlug(categorySlug),
      href: `/${lang}/services/${categorySlug}`,
    },
    { label: name },
  ];

  return (
    <Fragment>
      <BreadcrumbHero
        title={t("page.categoryTitle", { name })}
        subtitle={translation?.metaDescription || t("page.categorySubtitle", { name })}
        breadCrumbs={breadCrumbs}
      />

      <Container width="default">
        <Section>
          {loading && !serviceSubCategory ? (
            <div className="flex flex-col gap-3">
              <div className="h-8 w-2/3 animate-pulse rounded-lg bg-background-secondary" />
              <div className="h-4 w-full animate-pulse rounded bg-background-secondary" />
            </div>
          ) : !serviceSubCategory ? (
            <EmptyState
              variant="compact"
              title={t("detail.notFound")}
              description={t("detail.notFoundHint")}
            />
          ) : (
            <section className="flex flex-col gap-4">
              <Title level="h2" size="h5">
                {t("detail.servicesTitle")}
              </Title>

              {loading && services.length === 0 ? (
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
                      onPageChange={handlePageChange}
                    />
                  )}
                </Fragment>
              )}
            </section>
          )}
        </Section>
      </Container>
    </Fragment>
  );
}

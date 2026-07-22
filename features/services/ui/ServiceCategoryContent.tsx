"use client";
import { Pagination } from "@/components/Pagination/Pagination";
import { Text } from "@/components/Text/Text";
import { Title } from "@/components/Title/Title";
import type { SupportedLanguage } from "@/constants/settings";
import { useTranslation } from "@/i18n/context";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";

import { useServicesByCategory } from "../hooks/useServicesByCategory";
import { NAMESPACE } from "../i18n";
import { DetailEmptyState } from "./DetailEmptyState";
import { ServiceInnerHero } from "./ServiceInnerHero";
import { ServiceList } from "./ServiceList";
import { humanizeSlug } from "@/utils/formatters";
import type { Crumb } from "@/components/BreadCrumbs/Breadcrumb";
import { Layout } from "@/components/Layout/Layout";

interface Props {
  lang: SupportedLanguage;
  /** Category slug from the route. */
  slug: string;
}

export function ServiceCategoryContent({ lang, slug }: Props) {
  const { t } = useTranslation(NAMESPACE);

  const { services, pageInfo, serviceCategory, loading, handlePageChange } =
    useServicesByCategory({ language: lang, slug });

  const translation = serviceCategory?.translation;
  const name = translation?.category ?? serviceCategory?.category ?? humanizeSlug(slug);
  const subcategories = serviceCategory?.subcategories ?? [];

  const breadCrumbs: Crumb[] = [
    { label: t("breadcrumbs.services"), href: `/${lang}/services` },
    { label: name },
  ];

  return (
    <Fragment>
      <ServiceInnerHero
        categoryTitle={t("page.categoryTitle", { name })}
        categorySubtitle={
          translation?.metaDescription || t("page.categorySubtitle", { name })
        }
        breadCrumbs={breadCrumbs}
      />

      <Layout.Container size="default">
        <Layout.Section>
          {loading && !serviceCategory ? (
            <div className="flex flex-col gap-3">
              <div className="h-8 w-2/3 animate-pulse rounded-lg bg-background-secondary" />
              <div className="h-4 w-full animate-pulse rounded bg-background-secondary" />
            </div>
          ) : !serviceCategory ? (
            <DetailEmptyState
              title={t("detail.notFound")}
              hint={t("detail.notFoundHint")}
            />
          ) : (
            <Fragment>
              <section className="flex flex-col gap-4">
                <Title level="h2" size="h5">
                  {t("detail.subcategoriesTitle")}
                </Title>

                {subcategories.length === 0 ? (
                  <DetailEmptyState title={t("detail.noSubcategories")} />
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {subcategories.map((sub) => {
                      const subName = sub.translation?.subCategory ?? sub.subCategory;
                      const subSlug = sub.translation?.slug;
                      if (!subSlug) return null;
                      return (
                        <Link
                          key={sub.id}
                          href={`/${lang}/services/${slug}/${subSlug}`}
                          className="group flex h-full flex-col gap-2 rounded-2xl border border-border bg-surface p-5 shadow-sm transition-all hover:border-primary hover:shadow-md"
                        >
                          <Title level="h3" size="h6" weight="semibold">
                            {subName}
                          </Title>
                          <Text size="xs" color="tertiary">
                            {sub.serviceCount} {t("detail.servicesTitle").toLowerCase()}
                          </Text>
                          <span className="mt-auto inline-flex items-center gap-1 pt-1 text-sm font-semibold text-primary">
                            {t("category.explore")}
                            <ArrowRight
                              size={16}
                              strokeWidth={2.5}
                              className="transition-transform group-hover:translate-x-0.5"
                            />
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </section>

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
                  <DetailEmptyState
                    title={t("detail.noServices")}
                    hint={t("detail.noServicesHint")}
                  />
                ) : (
                  <Fragment>
                    <ServiceList services={services} />
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
            </Fragment>
          )}
        </Layout.Section>
      </Layout.Container>
    </Fragment>
  );
}

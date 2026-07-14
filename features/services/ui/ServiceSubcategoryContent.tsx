"use client";
import { Pagination } from "@/components/Pagination/Pagination";
import { Text } from "@/components/Text/Text";
import { Title } from "@/components/Title/Title";
import type { SupportedLanguage } from "@/constants/settings";
import { useTranslation } from "@/i18n/context";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { useServicesBySubcategory } from "../hooks/useServicesBySubcategory";
import { NAMESPACE } from "../i18n";
import { DetailEmptyState } from "./DetailEmptyState";
import { ServiceList } from "./ServiceList";

interface Props {
  lang: SupportedLanguage;
  /** Parent category slug from the route (used for the back link). */
  categorySlug: string;
  /** Subcategory slug from the route. */
  slug: string;
}

export function ServiceSubcategoryContent({ lang, categorySlug, slug }: Props) {
  const { t } = useTranslation(NAMESPACE);

  const {
    services,
    pageInfo,
    serviceSubCategory,
    loading,
    handlePageChange,
  } = useServicesBySubcategory({ language: lang, slug });

  const name =
    serviceSubCategory?.translation?.subCategory ??
    serviceSubCategory?.subCategory ??
    slug;

  return (
    <div className="flex flex-col gap-8 px-4 py-8">
      <Link
        href={`/${lang}/services/${categorySlug}`}
        className="inline-flex w-fit items-center gap-1 text-sm font-semibold text-primary"
      >
        <ArrowLeft size={16} strokeWidth={2.5} />
        {t("detail.backToList")}
      </Link>

      {loading && !serviceSubCategory ? (
        <div className="flex flex-col gap-3">
          <div className="h-8 w-2/3 animate-pulse rounded-lg bg-background-secondary" />
          <div className="h-4 w-full animate-pulse rounded bg-background-secondary" />
        </div>
      ) : !serviceSubCategory ? (
        <DetailEmptyState title={t("detail.notFound")} hint={t("detail.notFoundHint")} />
      ) : (
        <>
          <header className="flex flex-col gap-2">
            <Title level="h1" size="h3" weight="bold">
              {name}
            </Title>
            {serviceSubCategory.translation?.metaDescription && (
              <Text color="secondary">
                {serviceSubCategory.translation.metaDescription}
              </Text>
            )}
          </header>

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
              <>
                <ServiceList services={services} />
                {pageInfo && pageInfo.totalPages > 1 && (
                  <Pagination
                    currentPage={pageInfo.currentPage}
                    totalPages={pageInfo.totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </section>
        </>
      )}
    </div>
  );
}

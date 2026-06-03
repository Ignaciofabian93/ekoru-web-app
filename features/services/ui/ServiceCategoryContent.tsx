"use client";
import { Text } from "@/components/Text/Text";
import { Title } from "@/components/Title/Title";
import { useTranslation } from "@/i18n/context";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

import { useServiceCategory } from "../hooks/useServiceCategory";
import { useServicesCatalog } from "../hooks/useServicesCatalog";
import { NAMESPACE } from "../i18n";
import type { Language } from "../types";
import { DetailEmptyState } from "./DetailEmptyState";
import { ServiceCategoryScroll } from "./ServiceCategoryScroll";

interface Props {
  lang: string;
  language: Language;
  /** Category slug from the route. */
  slug: string;
}

export function ServiceCategoryContent({ lang, language, slug }: Props) {
  const { t } = useTranslation(NAMESPACE);
  const { category, loading } = useServiceCategory(slug, language);
  const { categories, loading: catalogLoading } = useServicesCatalog(language);
  const translation = category?.translation;
  const name = translation?.category ?? category?.category;
  const subcategories = category?.subcategories ?? [];

  return (
    <div className="flex flex-col gap-8 px-4 py-8">
      <Link
        href={`/${lang}/services`}
        className="inline-flex w-fit items-center gap-1 text-sm font-semibold text-primary"
      >
        <ArrowLeft size={16} strokeWidth={2.5} />
        {t("detail.backToList")}
      </Link>

      <ServiceCategoryScroll
        lang={lang}
        categories={categories}
        activeSlug={slug}
        loading={catalogLoading}
      />

      {loading && !category ? (
        <div className="flex flex-col gap-3">
          <div className="h-8 w-2/3 animate-pulse rounded-lg bg-background-secondary" />
          <div className="h-4 w-full animate-pulse rounded bg-background-secondary" />
        </div>
      ) : !category ? (
        <DetailEmptyState title={t("detail.notFound")} hint={t("detail.notFoundHint")} />
      ) : (
        <>
          <header className="flex flex-col gap-2">
            <Title level="h1" size="h3" weight="bold">
              {name}
            </Title>
            {translation?.metaDescription && (
              <Text color="secondary">{translation.metaDescription}</Text>
            )}
          </header>

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
        </>
      )}
    </div>
  );
}

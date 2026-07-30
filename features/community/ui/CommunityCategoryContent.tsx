"use client";
import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";
import { useTranslation } from "@/i18n/context";
import { ArrowRight, Layers } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";

import { useCommunityCategory } from "../hooks/useCommunityCategory";
import { NAMESPACE } from "../i18n";
import type { Language } from "../types";
import { EmptyState } from "@/components/Feedback/EmptyState";
import { BreadcrumbHero } from "@/components/Patterns/BreadcrumbHero";
import { humanizeSlug } from "@/utils/formatters";
import type { Crumb } from "@/components/Patterns/Breadcrumb";
import { Container, Section } from "@/components/Layout";

interface Props {
  lang: string;
  language: Language;
  /** Category slug from the route. */
  slug: string;
}

export function CommunityCategoryContent({ lang, language, slug }: Props) {
  const { t } = useTranslation(NAMESPACE);
  const { category, loading } = useCommunityCategory(slug, language);
  const translation = category?.translation;
  const subcategories = category?.subcategories ?? [];

  const name = translation?.category ?? humanizeSlug(slug);

  const breadCrumbs: Crumb[] = [
    { label: t("breadcrumbs.community"), href: `/${lang}/community` },
    { label: name },
  ];

  return (
    <Fragment>
      <BreadcrumbHero
        title={t("page.categoryTitle", { name })}
        subtitle={translation?.description || t("page.categorySubtitle", { name })}
        breadCrumbs={breadCrumbs}
      />

      <Container width="default">
        <Section>
          {loading && !category ? (
            <div className="flex flex-col gap-3">
              <div className="h-8 w-2/3 animate-pulse rounded-lg bg-background-secondary" />
              <div className="h-4 w-full animate-pulse rounded bg-background-secondary" />
            </div>
          ) : !translation ? (
            <EmptyState
              title={t("detail.notFound")}
              description={t("detail.notFoundHint")}
            />
          ) : (
            <section className="flex flex-col gap-4">
              <Title level="h2" size="h5">
                {t("detail.subcategoriesTitle")}
              </Title>

              {subcategories.length === 0 ? (
                <EmptyState title={t("detail.noSubcategories")} icon={Layers} />
              ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {subcategories.map((sub) => {
                    const subT = sub.translation;
                    if (!subT) return null;
                    return (
                      <Link
                        key={sub.id}
                        href={`/${lang}/community/${slug}/${subT.slug}`}
                        className="group relative flex h-full flex-col gap-2 rounded-2xl border border-border-light bg-surface p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                      >
                        <Title level="h3" size="h6" weight="semibold">
                          {subT.subCategory}
                        </Title>
                        {subT.description && (
                          <Text
                            size="sm"
                            color="secondary"
                            numberOfLines={3}
                            className="flex-1"
                          >
                            {subT.description}
                          </Text>
                        )}
                        <span className="mt-auto inline-flex items-center gap-1 pt-1 text-sm font-semibold text-primary">
                          {t("category.explore")}
                          <ArrowRight
                            size={16}
                            strokeWidth={2.5}
                            className="transition-transform duration-200 group-hover:translate-x-0.5"
                          />
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </section>
          )}
        </Section>
      </Container>
    </Fragment>
  );
}

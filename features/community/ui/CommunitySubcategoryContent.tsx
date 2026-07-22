"use client";
import { useTranslation } from "@/i18n/context";
import { Title } from "@/components/Title/Title";
import { MessagesSquare } from "lucide-react";
import { Fragment } from "react";

import { useCommunitySubcategory } from "../hooks/useCommunitySubcategory";
import { NAMESPACE } from "../i18n";
import type { Language } from "../types";
import { DetailEmptyState } from "./DetailEmptyState";
import { CommunityInnerHero } from "./CommunityInnerHero";
import { humanizeSlug } from "@/utils/formatters";
import type { Crumb } from "@/components/BreadCrumbs/Breadcrumb";
import { Layout } from "@/components/Layout/Layout";

interface Props {
  lang: string;
  language: Language;
  /** Parent category slug from the route (used for the breadcrumb). */
  categorySlug: string;
  /** Subcategory slug from the route. */
  slug: string;
}

export function CommunitySubcategoryContent({
  lang,
  language,
  categorySlug,
  slug,
}: Props) {
  const { t } = useTranslation(NAMESPACE);
  const { subcategory, loading } = useCommunitySubcategory(slug, language);
  const translation = subcategory?.translation;

  const name = translation?.subCategory ?? humanizeSlug(slug);

  const breadCrumbs: Crumb[] = [
    { label: t("breadcrumbs.community"), href: `/${lang}/community` },
    {
      label: humanizeSlug(categorySlug),
      href: `/${lang}/community/${categorySlug}`,
    },
    { label: name },
  ];

  return (
    <Fragment>
      <CommunityInnerHero
        categoryTitle={t("page.categoryTitle", { name })}
        categorySubtitle={
          translation?.description || t("page.categorySubtitle", { name })
        }
        breadCrumbs={breadCrumbs}
      />

      <Layout.Container size="default">
        <Layout.Section>
          {loading && !subcategory ? (
            <div className="flex flex-col gap-3">
              <div className="h-8 w-2/3 animate-pulse rounded-lg bg-background-secondary" />
              <div className="h-4 w-full animate-pulse rounded bg-background-secondary" />
            </div>
          ) : !translation ? (
            <DetailEmptyState
              title={t("detail.notFound")}
              hint={t("detail.notFoundHint")}
            />
          ) : (
            <section className="flex flex-col gap-4">
              <Title level="h2" size="h5">
                {t("detail.postsTitle")}
              </Title>
              <DetailEmptyState
                title={t("detail.noPosts")}
                hint={t("detail.noPostsHint")}
                icon={MessagesSquare}
              />
            </section>
          )}
        </Layout.Section>
      </Layout.Container>
    </Fragment>
  );
}

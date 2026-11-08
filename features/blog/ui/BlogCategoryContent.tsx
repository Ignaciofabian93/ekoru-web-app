"use client";
import { Text } from "@/components/Primitives/Text";
import { useTranslation } from "@/i18n/context";
import { Fragment, useState } from "react";

import { useBlogCategory } from "../hooks/useBlogCategory";
import { useBlogPosts } from "../hooks/useBlogPosts";
import { NAMESPACE } from "../i18n";
import type { Language } from "../types";
import { humanizeSlug } from "@/utils/formatters";
import type { Crumb } from "@/components/Patterns/Breadcrumb";
import { BreadcrumbHero } from "@/components/Patterns/BreadcrumbHero";
import { BlogPostList } from "./BlogPostList";
import { Container, Section } from "@/components/Layout";

interface Props {
  lang: string;
  language: Language;
  slug: string;
}

export function BlogCategoryContent({ lang, language, slug }: Props) {
  const { t } = useTranslation(NAMESPACE);
  const { category, loading } = useBlogCategory(slug, language);
  const translation = category?.translation;

  const [page, setPage] = useState(1);
  const {
    posts,
    pageInfo,
    loading: postsLoading,
  } = useBlogPosts({ categorySlug: slug, language, page });

  const name = translation?.name ?? humanizeSlug(slug);

  const breadCrumbs: Crumb[] = [
    { label: t("breadcrumbs.blog"), href: `/${lang}/blog` },
    { label: name },
  ];

  return (
    <Fragment>
      <BreadcrumbHero
        title={t("page.categoryTitle", { name })}
        subtitle={
          translation?.description || t("page.categorySubtitle", { name })
        }
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
            <div className="flex flex-col items-center gap-1 rounded-2xl border border-dashed border-border-light bg-surface px-4 py-16 text-center">
              <Text weight="semibold">{t("detail.notFound")}</Text>
              <Text size="sm" color="secondary">
                {t("detail.notFoundHint")}
              </Text>
            </div>
          ) : (
            <BlogPostList
              lang={lang}
              title={t("detail.postsTitle")}
              posts={posts}
              loading={postsLoading}
              pageInfo={pageInfo}
              onPageChange={setPage}
              getCategorySlug={() => slug}
            />
          )}
        </Section>
      </Container>
    </Fragment>
  );
}

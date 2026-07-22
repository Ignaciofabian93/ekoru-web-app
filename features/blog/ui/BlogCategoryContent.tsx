"use client";
import { Pagination } from "@/components/Pagination/Pagination";
import { Text } from "@/components/Text/Text";
import { Title } from "@/components/Title/Title";
import { useTranslation } from "@/i18n/context";
import { Newspaper } from "lucide-react";
import { Fragment, useState } from "react";

import { useBlogCategory } from "../hooks/useBlogCategory";
import { useBlogPosts } from "../hooks/useBlogPosts";
import { NAMESPACE } from "../i18n";
import type { Language } from "../types";
import { humanizeSlug } from "@/utils/formatters";
import type { Crumb } from "@/components/BreadCrumbs/Breadcrumb";
import { BlogInnerHero } from "./BlogInnerHero";
import { BlogPostCard } from "./BlogPostCard";
import { Layout } from "@/components/Layout/Layout";

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
      <BlogInnerHero
        categoryTitle={t("page.categoryTitle", { name })}
        categorySubtitle={
          translation?.description || t("page.categorySubtitle", { name })
        }
        breadCrumbs={breadCrumbs}
      />

      <Layout.Container size="default">
        <Layout.Section>
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
            <section className="flex flex-col gap-4">
              <Title level="h2" size="h5">
                {t("detail.postsTitle")}
              </Title>

              {postsLoading && posts.length === 0 ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-72 animate-pulse rounded-2xl bg-background-secondary"
                    />
                  ))}
                </div>
              ) : posts.length === 0 ? (
                <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border-light bg-surface px-4 py-16 text-center">
                  <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Newspaper size={24} strokeWidth={1.75} />
                  </span>
                  <div className="flex flex-col gap-1">
                    <Text weight="semibold">{t("detail.noPosts")}</Text>
                    <Text size="sm" color="secondary">
                      {t("detail.noPostsHint")}
                    </Text>
                  </div>
                </div>
              ) : (
                <Fragment>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post) => (
                      <BlogPostCard
                        key={post.id}
                        lang={lang}
                        categorySlug={slug}
                        post={post}
                      />
                    ))}
                  </div>

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
          )}
        </Layout.Section>
      </Layout.Container>
    </Fragment>
  );
}

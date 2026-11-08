"use client";
import { Newspaper } from "lucide-react";
import { Fragment } from "react";
import { Pagination } from "@/components/Patterns/Pagination";
import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";
import { useTranslation } from "@/i18n/context";

import { NAMESPACE } from "../i18n";
import type { BlogPost, PageInfo } from "../types";
import { BlogPostCard } from "./BlogPostCard";

interface Props {
  lang: string;
  title: string;
  posts: BlogPost[];
  loading: boolean;
  pageInfo?: PageInfo;
  onPageChange: (page: number) => void;
  /** The category slug in each post's URL; a post without one is left out. */
  getCategorySlug: (post: BlogPost) => string | undefined;
}

/** Paginated post grid, shared by /blog and the blog category pages. */
export function BlogPostList({
  lang,
  title,
  posts,
  loading,
  pageInfo,
  onPageChange,
  getCategorySlug,
}: Props) {
  const { t } = useTranslation(NAMESPACE);
  // Filtered before deciding what to show, so a list whose slugs aren't known
  // yet reads as loading instead of an empty grid.
  const visible = posts.flatMap((post) => {
    const categorySlug = getCategorySlug(post);
    return categorySlug ? [{ post, categorySlug }] : [];
  });

  return (
    <section className="flex flex-col gap-4">
      <Title level="h2" size="h5">
        {title}
      </Title>

      {loading && visible.length === 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-72 animate-pulse rounded-2xl bg-background-secondary" />
          ))}
        </div>
      ) : visible.length === 0 ? (
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
            {visible.map(({ post, categorySlug }) => (
              <BlogPostCard
                key={post.id}
                lang={lang}
                categorySlug={categorySlug}
                post={post}
              />
            ))}
          </div>

          {pageInfo && pageInfo.totalPages > 1 && (
            <Pagination
              currentPage={pageInfo.currentPage}
              totalPages={pageInfo.totalPages}
              onPageChange={onPageChange}
            />
          )}
        </Fragment>
      )}
    </section>
  );
}

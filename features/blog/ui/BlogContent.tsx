"use client";
import { useState } from "react";
import { useTranslation } from "@/i18n/context";
import { useCategoryParam } from "@/hooks/useCategoryParam";
import { useBlogCatalog } from "../hooks/useBlogCatalog";
import { useBlogPosts } from "../hooks/useBlogPosts";
import { NAMESPACE } from "../i18n";
import type { BlogPost, Language } from "../types";
import { BlogPostList } from "./BlogPostList";
import { Section } from "@/components/Layout";
import { CategoryFilter } from "@/components/Patterns/CategoryFilter";

interface Props {
  lang: string;
  language: Language;
}

export function BlogContent({ lang, language }: Props) {
  const { t } = useTranslation(NAMESPACE);
  const { categories, loading: catalogLoading } = useBlogCatalog(language);
  const { category: categorySlug, setCategory } = useCategoryParam();
  const [page, setPage] = useState(1);

  const activeCategory = categories.find((cat) => cat.slug === categorySlug);
  // A shared ?category= link waits for the catalog instead of listing every
  // post first.
  const waiting = Boolean(categorySlug) && catalogLoading && !activeCategory;

  const { posts, pageInfo, loading } = useBlogPosts({
    categorySlug: activeCategory?.slug,
    language,
    page,
    skip: waiting,
  });

  // Posts carry their category id; the URL needs that category's slug.
  const getCategorySlug = (post: BlogPost) =>
    categories.find((cat) => cat.id === post.blogCategoryId)?.slug;

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

      <BlogPostList
        lang={lang}
        title={
          activeCategory
            ? t("sections.postsIn", { name: activeCategory.name })
            : t("sections.latestPosts")
        }
        posts={posts}
        loading={loading || catalogLoading}
        pageInfo={pageInfo}
        onPageChange={setPage}
        getCategorySlug={getCategorySlug}
      />
    </Section>
  );
}

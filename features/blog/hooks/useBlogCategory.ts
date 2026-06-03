"use client";
import { useQuery } from "@apollo/client/react";

import { GET_BLOG_CATEGORY_BY_SLUG } from "@/graphql/blog/queries";

import type { BlogCategoryDetail, Language } from "../types";

export function useBlogCategory(slug: string, language: Language) {
  const { data, loading, error } = useQuery<{
    getBlogCategoryBySlug: BlogCategoryDetail | null;
  }>(GET_BLOG_CATEGORY_BY_SLUG, {
    variables: { slug, language },
    fetchPolicy: "cache-first",
  });

  return { category: data?.getBlogCategoryBySlug ?? null, loading, error };
}

"use client";
import { useQuery } from "@apollo/client/react";

import { GET_BLOG_POSTS_BY_CATEGORY } from "@/graphql/blog/queries";

import type { BlogPost, Language, PageInfo } from "../types";

export function useBlogPosts({
  categorySlug,
  language,
  page,
  pageSize = 12,
}: {
  categorySlug: string;
  language: Language;
  page: number;
  pageSize?: number;
}) {
  const { data, loading, error, previousData } = useQuery<{
    getBlogPostsByCategory: { nodes: BlogPost[]; pageInfo: PageInfo };
  }>(GET_BLOG_POSTS_BY_CATEGORY, {
    variables: { categorySlug, language, page, pageSize },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  return {
    posts:
      data?.getBlogPostsByCategory.nodes ??
      previousData?.getBlogPostsByCategory.nodes ??
      [],
    pageInfo:
      data?.getBlogPostsByCategory.pageInfo ??
      previousData?.getBlogPostsByCategory.pageInfo,
    loading,
    error,
  };
}

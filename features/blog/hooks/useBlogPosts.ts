"use client";
import { useQuery } from "@apollo/client/react";

import { GET_BLOG_POSTS } from "@/graphql/blog/queries";

import type { BlogPost, Language, PageInfo } from "../types";

/** Published posts, newest first: every category, or one by its slug. */
export function useBlogPosts({
  categorySlug,
  language,
  page,
  pageSize = 12,
  skip = false,
}: {
  categorySlug?: string;
  language: Language;
  page: number;
  pageSize?: number;
  /** Hold the request, e.g. while a ?category= link waits for the catalog. */
  skip?: boolean;
}) {
  const { data, loading, error, previousData } = useQuery<{
    getBlogPosts: { nodes: BlogPost[]; pageInfo: PageInfo };
  }>(GET_BLOG_POSTS, {
    variables: { categorySlug: categorySlug ?? null, language, page, pageSize },
    skip,
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  return {
    posts: data?.getBlogPosts.nodes ?? previousData?.getBlogPosts.nodes ?? [],
    pageInfo: data?.getBlogPosts.pageInfo ?? previousData?.getBlogPosts.pageInfo,
    loading: skip || loading,
    error,
  };
}

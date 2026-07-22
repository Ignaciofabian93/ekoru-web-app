"use client";
import { useQuery } from "@apollo/client/react";

import { GET_BLOG_POST_BY_SLUG } from "@/graphql/blog/queries";

import type { BlogPost, Language } from "../types";

export function useBlogPost(slug: string, language: Language) {
  const { data, loading, error } = useQuery<{
    getBlogPostBySlug: BlogPost | null;
  }>(GET_BLOG_POST_BY_SLUG, {
    variables: { slug, language },
    fetchPolicy: "cache-first",
  });

  return { post: data?.getBlogPostBySlug ?? null, loading, error };
}

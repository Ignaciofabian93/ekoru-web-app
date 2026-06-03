"use client";
import { useQuery } from "@apollo/client/react";

import { GET_COMMUNITY_CATEGORY_BY_SLUG } from "@/graphql/community/queries";

import type { CommunityCategoryDetail, Language } from "../types";

export function useCommunityCategory(slug: string, language: Language) {
  const { data, loading, error } = useQuery<{
    getCommunityCategoryBySlug: CommunityCategoryDetail | null;
  }>(GET_COMMUNITY_CATEGORY_BY_SLUG, {
    variables: { slug, language },
    fetchPolicy: "cache-first",
  });

  return { category: data?.getCommunityCategoryBySlug ?? null, loading, error };
}

"use client";
import { useQuery } from "@apollo/client/react";

import { GET_COMMUNITY_SUBCATEGORY_BY_SLUG } from "@/graphql/community/queries";

import type { CommunitySubcategoryDetail, Language } from "../types";

export function useCommunitySubcategory(slug: string, language: Language) {
  const { data, loading, error } = useQuery<{
    getCommunitySubCategoryBySlug: CommunitySubcategoryDetail | null;
  }>(GET_COMMUNITY_SUBCATEGORY_BY_SLUG, {
    variables: { slug, language },
    fetchPolicy: "cache-first",
  });

  return { subcategory: data?.getCommunitySubCategoryBySlug ?? null, loading, error };
}

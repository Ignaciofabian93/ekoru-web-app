"use client";
import { useQuery } from "@apollo/client/react";

import { GET_SERVICE_CATEGORY_BY_SLUG } from "@/graphql/services/queries";

import type { ServiceCategoryDetail, Language } from "../types";

export function useServiceCategory(slug: string, language: Language) {
  const { data, loading, error } = useQuery<{
    getServiceCategoryBySlug: ServiceCategoryDetail | null;
  }>(GET_SERVICE_CATEGORY_BY_SLUG, {
    variables: { slug, language },
    fetchPolicy: "cache-first",
  });

  return { category: data?.getServiceCategoryBySlug ?? null, loading, error };
}

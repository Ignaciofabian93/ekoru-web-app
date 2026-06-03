"use client";
import { useQuery } from "@apollo/client/react";

import { GET_SERVICE_SUBCATEGORY_BY_SLUG } from "@/graphql/services/queries";

import type { ServiceSubCategoryDetail, Language } from "../types";

export function useServiceSubcategory(slug: string, language: Language) {
  const { data, loading, error } = useQuery<{
    getServiceSubCategoryBySlug: ServiceSubCategoryDetail | null;
  }>(GET_SERVICE_SUBCATEGORY_BY_SLUG, {
    variables: { slug, language },
    fetchPolicy: "cache-first",
  });

  return { subcategory: data?.getServiceSubCategoryBySlug ?? null, loading, error };
}

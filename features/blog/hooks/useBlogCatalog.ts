"use client";
import { useQuery } from "@apollo/client/react";
import { useMemo } from "react";

import { GET_BLOG_CATALOG } from "@/graphql/blog/queries";

import type { BlogCatalogCategory, Language } from "../types";

export function useBlogCatalog(language: Language, { skip = false }: { skip?: boolean } = {}) {
  const { data, loading, error } = useQuery<{
    getBlogCatalog: BlogCatalogCategory[];
  }>(GET_BLOG_CATALOG, {
    variables: { language },
    fetchPolicy: "cache-first",
    skip,
  });

  const categories = useMemo<BlogCatalogCategory[]>(
    () => data?.getBlogCatalog ?? [],
    [data],
  );

  return { categories, loading, error };
}

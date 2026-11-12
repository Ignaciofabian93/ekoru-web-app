"use client";
import { useQuery } from "@apollo/client/react";
import { useMemo } from "react";

import { GET_BLOG_POST_COUNTS } from "@/graphql/blog/queries";

import type { Language } from "../types";

/**
 * Published posts per category id. `counts` stays undefined until they load,
 * or if they fail: the tiles then simply show no count. A category missing
 * from the map has no posts.
 */
export function useBlogPostCounts(language: Language, { skip = false } = {}) {
  const { data, loading } = useQuery<{
    blogPostCountsByCategory: { blogCategoryId: number; count: number }[];
  }>(GET_BLOG_POST_COUNTS, { variables: { language }, skip });

  const counts = useMemo(
    () =>
      data &&
      new Map(data.blogPostCountsByCategory.map((c) => [c.blogCategoryId, c.count])),
    [data],
  );

  return { counts, loading };
}

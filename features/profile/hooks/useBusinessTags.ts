"use client";
import { useQuery } from "@apollo/client/react";

import { GET_BUSINESS_TAGS } from "@/graphql/users/tags";
import { FALLBACK_BUSINESS_TAGS, type BusinessTag } from "../constants/businessTags";

/**
 * Loads the selectable business tags from the users subgraph. The tag catalog
 * isn't in the schema yet, so the query runs with `errorPolicy: "all"` and we
 * fall back to a local eco list. When the backend ships `businessTags`, real
 * data takes over automatically with no changes here.
 */
export function useBusinessTags() {
  const { data, loading } = useQuery<{ businessTags: BusinessTag[] }>(
    GET_BUSINESS_TAGS,
    {
      fetchPolicy: "cache-first",
      errorPolicy: "all",
    },
  );

  const remote = data?.businessTags;
  const tags = remote && remote.length > 0 ? remote : FALLBACK_BUSINESS_TAGS;

  return { tags, loading };
}

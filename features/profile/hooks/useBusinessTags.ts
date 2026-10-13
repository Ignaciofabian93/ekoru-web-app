"use client";
import { useQuery } from "@apollo/client/react";
import { GET_BUSINESS_TAGS } from "@/graphql/users/tags";
import { FALLBACK_BUSINESS_TAGS, type BusinessTag } from "../constants/businessTags";

/**
 * Selectable business tags from the users subgraph. The local list stands in
 * while the catalog loads or if the request fails; it holds the same ids.
 */
export function useBusinessTags() {
  const { data, loading } = useQuery<{ businessTags: BusinessTag[] }>(GET_BUSINESS_TAGS);
  return { tags: data?.businessTags ?? FALLBACK_BUSINESS_TAGS, loading };
}

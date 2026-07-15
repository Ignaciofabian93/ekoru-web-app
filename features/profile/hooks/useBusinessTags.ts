"use client";
import { FALLBACK_BUSINESS_TAGS } from "../constants/businessTags";

/**
 * Selectable business tags. The tag catalog isn't in the gateway schema yet
 * (`businessTags` fails validation — see GET_BUSINESS_TAGS in
 * graphql/users/tags.ts), so we serve the local eco list without hitting the
 * network. TODO(business-tags): switch back to useQuery(GET_BUSINESS_TAGS)
 * once the users subgraph exposes the catalog.
 */
export function useBusinessTags() {
  return { tags: FALLBACK_BUSINESS_TAGS, loading: false };
}

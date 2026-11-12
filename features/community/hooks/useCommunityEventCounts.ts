"use client";
import { useQuery } from "@apollo/client/react";
import { useMemo } from "react";

import { GET_COMMUNITY_EVENT_COUNTS } from "@/graphql/community/queries";

/**
 * Upcoming public events per category id (the events the list shows).
 * `counts` stays undefined until they load, or if they fail: the tiles then
 * simply show no count. A category missing from the map has no events.
 */
export function useCommunityEventCounts({ skip = false } = {}) {
  const { data, loading } = useQuery<{
    communityEventCountsByCategory: { communityCategoryId: number; count: number }[];
  }>(GET_COMMUNITY_EVENT_COUNTS, { skip });

  const counts = useMemo(
    () =>
      data &&
      new Map(
        data.communityEventCountsByCategory.map((c) => [c.communityCategoryId, c.count]),
      ),
    [data],
  );

  return { counts, loading };
}

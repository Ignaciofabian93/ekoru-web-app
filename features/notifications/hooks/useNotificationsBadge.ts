"use client";
import { useQuery } from "@apollo/client/react";

import { UNREAD_NOTIFICATION_COUNT } from "@/graphql/notifications/queries";
import { useIsAuthenticated } from "@/store/useAuthStore";

/**
 * Unread notification count for the bell badge. Polls in the background so a
 * new deal request or order update surfaces without a page load.
 *
 * `enabled` exists for always-mounted consumers: the Drawer sits in the layout
 * tree on every page, so it defers until first opened rather than running a
 * second poll alongside the navbar bell's. Same arrangement as
 * `useDealsBadge`.
 */
export function useNotificationsBadge(enabled: boolean = true): number {
  const isAuthed = useIsAuthenticated();

  const { data } = useQuery<{ unreadNotificationCount: number }>(
    UNREAD_NOTIFICATION_COUNT,
    {
      skip: !isAuthed || !enabled,
      fetchPolicy: "cache-and-network",
      pollInterval: 30000,
    },
  );

  return data?.unreadNotificationCount ?? 0;
}

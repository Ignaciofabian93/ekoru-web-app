"use client";
import { useCallback } from "react";
import { useMutation, useQuery } from "@apollo/client/react";

import {
  MARK_ALL_NOTIFICATIONS_READ,
  MARK_NOTIFICATION_READ,
} from "@/graphql/notifications/mutations";
import {
  MY_NOTIFICATIONS,
  UNREAD_NOTIFICATION_COUNT,
} from "@/graphql/notifications/queries";
import { useIsAuthenticated } from "@/store/useAuthStore";
import type { NotificationConnection } from "../types";

interface UseNotificationsOptions {
  /** The bell shows a short preview; the full screen asks for more. */
  pageSize?: number;
  onlyUnread?: boolean;
  /** Skip the query until the surface is actually visible. */
  enabled?: boolean;
  page?: number;
}

/**
 * Loads a page of the current user's notifications and exposes the read
 * actions.
 *
 * Marking read refetches the badge count as well as the list: the two are
 * separate queries (the badge polls something much cheaper), so nothing else
 * would tell the bell its number just changed.
 */
export function useNotifications({
  pageSize = 20,
  onlyUnread = false,
  enabled = true,
  page = 1,
}: UseNotificationsOptions = {}) {
  const isAuthed = useIsAuthenticated();
  const skip = !isAuthed || !enabled;

  const { data, loading, refetch } = useQuery<{
    myNotifications: NotificationConnection;
  }>(MY_NOTIFICATIONS, {
    variables: { page, pageSize, onlyUnread },
    skip,
    fetchPolicy: "cache-and-network",
  });

  const refetchQueries = [
    { query: UNREAD_NOTIFICATION_COUNT },
    { query: MY_NOTIFICATIONS, variables: { page, pageSize, onlyUnread } },
  ];

  const [markReadMutation] = useMutation(MARK_NOTIFICATION_READ, {
    refetchQueries,
  });
  const [markAllReadMutation, { loading: markingAll }] = useMutation(
    MARK_ALL_NOTIFICATIONS_READ,
    { refetchQueries },
  );

  /**
   * Reading is a convenience, never the point of the click — a failure here
   * must not stop the user navigating to what the notification is about.
   */
  const markRead = useCallback(
    async (id: number) => {
      try {
        await markReadMutation({ variables: { id } });
      } catch {
        // Left unread; the next poll or visit will show it again.
      }
    },
    [markReadMutation],
  );

  const markAllRead = useCallback(async () => {
    try {
      await markAllReadMutation();
    } catch {
      // Same reasoning as markRead.
    }
  }, [markAllReadMutation]);

  const connection = data?.myNotifications;

  return {
    notifications: connection?.nodes ?? [],
    pageInfo: connection?.pageInfo ?? null,
    // `cache-and-network` re-reports loading on every poll; only show the
    // skeleton before there is anything at all to display.
    loading: loading && !connection,
    markingAll,
    markRead,
    markAllRead,
    refetch,
  };
}

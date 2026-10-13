"use client";
import { useQuery } from "@apollo/client/react";

import { UNREAD_CONVERSATION_COUNT } from "@/graphql/chat/queries";
import { useIsAuthenticated } from "@/store/useAuthStore";

/**
 * Conversations with unread messages, for the badges (WEB-22). Polls about
 * once a minute; there is no push channel yet. `enabled` lets always-mounted
 * consumers (the drawer) wait until first opened, like the other badges.
 */
export function useUnreadConversations(enabled: boolean = true): number {
  const isAuthed = useIsAuthenticated();

  const { data } = useQuery<{ myUnreadConversationCount: number }>(
    UNREAD_CONVERSATION_COUNT,
    {
      skip: !isAuthed || !enabled,
      fetchPolicy: "cache-and-network",
      pollInterval: 60000,
    },
  );

  return data?.myUnreadConversationCount ?? 0;
}

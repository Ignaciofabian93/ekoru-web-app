"use client";
import { useQuery } from "@apollo/client/react";

import { MY_CONVERSATIONS } from "@/graphql/chat/queries";
import { useIsAuthenticated } from "@/store/useAuthStore";
import type { ChatConversation } from "../types";

const PAGE_SIZE = 30;

interface ConversationsResponse {
  myConversations: {
    nodes: ChatConversation[];
    pageInfo: { totalCount: number; hasNextPage: boolean };
  };
}

/** The inbox, most recent first. Polls so new threads and replies show up. */
export function useConversations() {
  const isAuthed = useIsAuthenticated();
  const { data, loading, error } = useQuery<ConversationsResponse>(MY_CONVERSATIONS, {
    variables: { page: 1, pageSize: PAGE_SIZE },
    skip: !isAuthed,
    fetchPolicy: "cache-and-network",
    pollInterval: 15000,
  });

  return {
    conversations: data?.myConversations.nodes ?? [],
    loading: loading && !data,
    error,
  };
}

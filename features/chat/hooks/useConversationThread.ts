"use client";
import { useApolloClient, useMutation, useQuery } from "@apollo/client/react";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  BLOCK_CONVERSATION,
  MARK_CONVERSATION_READ,
  REPORT_MESSAGE,
  SEND_MESSAGE,
  UNBLOCK_CONVERSATION,
} from "@/graphql/chat/mutations";
import { CONVERSATION, CONVERSATION_MESSAGES } from "@/graphql/chat/queries";
import { useToast } from "@/hooks/useToast";
import { useTranslation } from "@/i18n/context";
import { NAMESPACE } from "../i18n";
import type { ChatConversation, ChatMessage } from "../types";
import { mergeMessages } from "../utils";

/** How often an open thread asks for new messages. */
export const THREAD_POLL_MS = 4000;
const PAGE = 30;

interface MessagesResponse {
  conversationMessages: { nodes: ChatMessage[]; hasMore: boolean };
}

/** What marking a thread read should refresh: the badges and the inbox. */
const READ_REFETCH = ["UnreadConversationCount", "MyConversations"];

/**
 * One open conversation (WEB-22): its header, its messages oldest first, and
 * the actions on it. Mount it with `key={conversationId}` so switching threads
 * starts clean.
 *
 * New messages arrive by polling every few seconds with `after` set to the
 * newest one on screen, and only while the tab is visible. Opening the thread,
 * and every poll that brings someone else's message, marks it read.
 */
export function useConversationThread(conversationId: number) {
  const client = useApolloClient();
  const toast = useToast();
  const { t } = useTranslation(NAMESPACE);

  const { data, error } = useQuery<{ conversation: ChatConversation }>(CONVERSATION, {
    variables: { id: conversationId },
    fetchPolicy: "cache-and-network",
    // Status changes (blocked, a trade unlocking contact details) are rare.
    pollInterval: 15000,
  });

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const newestId = useRef<number | null>(null);

  const [markReadMutation] = useMutation(MARK_CONVERSATION_READ, {
    refetchQueries: READ_REFETCH,
  });
  const [sendMutation, { loading: sending }] = useMutation<{ sendMessage: ChatMessage }>(
    SEND_MESSAGE,
  );
  const [reportMutation] = useMutation(REPORT_MESSAGE);
  const [blockMutation] = useMutation(BLOCK_CONVERSATION);
  const [unblockMutation] = useMutation(UNBLOCK_CONVERSATION);

  const markRead = useCallback(() => {
    void markReadMutation({ variables: { conversationId } }).catch(() => undefined);
  }, [markReadMutation, conversationId]);

  const fetchMessages = useCallback(
    async (variables: { before?: number; after?: number }) => {
      const result = await client.query<MessagesResponse>({
        query: CONVERSATION_MESSAGES,
        variables: { conversationId, limit: PAGE, ...variables },
        fetchPolicy: "network-only",
      });
      return result.data?.conversationMessages ?? { nodes: [], hasMore: false };
    },
    [client, conversationId],
  );

  const add = useCallback((incoming: ChatMessage[]) => {
    if (!incoming.length) return;
    setMessages((current) => {
      const merged = mergeMessages(current, incoming);
      newestId.current = merged[merged.length - 1]?.id ?? newestId.current;
      return merged;
    });
  }, []);

  // First page, then mark the thread read.
  useEffect(() => {
    let cancelled = false;
    fetchMessages({})
      .then((page) => {
        if (cancelled) return;
        add(page.nodes);
        setHasMore(page.hasMore);
        setLoaded(true);
        markRead();
      })
      .catch(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [fetchMessages, add, markRead]);

  // New messages since the newest on screen, while the tab is visible.
  useEffect(() => {
    const timer = setInterval(() => {
      if (document.visibilityState !== "visible" || newestId.current === null) return;
      fetchMessages({ after: newestId.current })
        .then((page) => {
          add(page.nodes);
          if (page.nodes.some((message) => !message.mine)) markRead();
        })
        .catch(() => undefined);
    }, THREAD_POLL_MS);
    return () => clearInterval(timer);
  }, [fetchMessages, add, markRead]);

  const loadOlder = async () => {
    const oldest = messages[0]?.id;
    if (!oldest) return;
    const page = await fetchMessages({ before: oldest });
    add(page.nodes);
    setHasMore(page.hasMore);
  };

  /** Sends a message; true when it went through. */
  const send = async (body: string): Promise<boolean> => {
    try {
      const { data: sent } = await sendMutation({ variables: { conversationId, body } });
      if (sent?.sendMessage) add([sent.sendMessage]);
      return true;
    } catch (err) {
      toast.error(
        err instanceof Error && err.message ? err.message : t("feedback.sendFailed"),
      );
      return false;
    }
  };

  const report = async (messageId: number) => {
    try {
      await reportMutation({ variables: { messageId } });
      toast.success(t("feedback.reported"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("feedback.loadFailed"));
    }
  };

  const setBlocked = async (blocked: boolean) => {
    try {
      await (blocked ? blockMutation : unblockMutation)({
        variables: { conversationId },
      });
      toast.success(t(blocked ? "feedback.blocked" : "feedback.unblocked"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("feedback.loadFailed"));
    }
  };

  return {
    conversation: data?.conversation ?? null,
    error,
    messages,
    hasMore,
    loaded,
    sending,
    send,
    loadOlder,
    report,
    setBlocked,
  };
}

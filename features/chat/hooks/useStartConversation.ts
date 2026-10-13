"use client";
import { useMutation } from "@apollo/client/react";
import { useParams, useRouter } from "next/navigation";

import { DEFAULT_LANGUAGE } from "@/constants/settings";
import { START_CONVERSATION } from "@/graphql/chat/mutations";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useToast } from "@/hooks/useToast";
import { useTranslation } from "@/i18n/context";
import type { ConversationItemType } from "../types";

export interface StartConversationArgs {
  itemType: ConversationItemType;
  itemId: number;
  /** Set when the item's owner writes from a deal, order or booking. */
  counterpartId?: string | null;
}

/**
 * Opens the thread about an item and goes to it. Guests are sent to sign in
 * first and come back to the page they were on.
 */
export function useStartConversation() {
  const router = useRouter();
  const params = useParams<{ lang?: string }>();
  const lang = params?.lang ?? DEFAULT_LANGUAGE;
  const toast = useToast();
  const { t } = useTranslation();
  const { requireAuth } = useRequireAuth();
  const [mutate, { loading }] = useMutation<{ startConversation: { id: number } }>(
    START_CONVERSATION,
  );

  const start = async ({ itemType, itemId, counterpartId }: StartConversationArgs) => {
    if (!requireAuth()) return;
    try {
      const { data } = await mutate({
        variables: { itemType, itemId, counterpartId: counterpartId ?? null },
      });
      const id = data?.startConversation.id;
      if (id) router.push(`/${lang}/profile/messages?c=${id}`);
    } catch (error) {
      toast.error(
        error instanceof Error && error.message
          ? error.message
          : t("chatActions.startFailed"),
      );
    }
  };

  return { start, loading };
}

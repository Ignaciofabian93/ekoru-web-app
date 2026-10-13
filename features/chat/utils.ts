import { resolveImageUrl } from "@/utils/resolveImage";
import type { ChatConversation, ChatMessage } from "./types";

/** Detail page of each catalogue, by the conversation's item type. */
const ITEM_ROUTE = {
  PRODUCT: "product",
  STORE_PRODUCT: "store-product",
  SERVICE: "service",
} as const;

/** The item a thread is about, whichever catalogue it came from. */
export function conversationItem(
  conversation: Pick<
    ChatConversation,
    "itemType" | "product" | "storeProduct" | "service"
  >,
  lang: string,
): { name: string; image?: string; href: string } | null {
  const item = conversation.product ?? conversation.storeProduct ?? conversation.service;
  if (!item) return null;
  return {
    name: item.name,
    image: resolveImageUrl(item.images?.[0]),
    href: `/${lang}/${ITEM_ROUTE[conversation.itemType]}/${item.id}`,
  };
}

/**
 * Adds freshly polled or sent messages to the ones on screen: oldest first,
 * each id once. A sent message can come back in the next poll too.
 */
export function mergeMessages(
  current: readonly ChatMessage[],
  incoming: readonly ChatMessage[],
): ChatMessage[] {
  const byId = new Map<number, ChatMessage>();
  for (const message of [...current, ...incoming]) byId.set(message.id, message);
  return [...byId.values()].sort((a, b) => a.id - b.id);
}

/** Whether a day label belongs before this message. */
export function startsNewDay(
  previous: ChatMessage | undefined,
  message: ChatMessage,
): boolean {
  if (!previous) return true;
  return (
    new Date(previous.createdAt).toDateString() !==
    new Date(message.createdAt).toDateString()
  );
}

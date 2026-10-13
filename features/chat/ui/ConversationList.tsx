"use client";
import clsx from "clsx";

import { Avatar } from "@/components/Primitives/Avatar";
import { Text } from "@/components/Primitives/Text";
import { useTranslation } from "@/i18n/context";
import { getSellerAvatar, getSellerName } from "@/features/seller/sellerDisplay";
import { NAMESPACE } from "../i18n";
import type { ChatConversation } from "../types";
import { conversationItem } from "../utils";

/** "14:05" today, "12 oct" before. */
function shortTime(iso: string, lang: string): string {
  const date = new Date(iso);
  const today = new Date().toDateString() === date.toDateString();
  return new Intl.DateTimeFormat(
    lang,
    today ? { hour: "2-digit", minute: "2-digit" } : { day: "numeric", month: "short" },
  ).format(date);
}

interface Props {
  conversations: ChatConversation[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  lang: string;
}

/** The inbox (WEB-22): one row per thread, most recent first. */
export function ConversationList({ conversations, selectedId, onSelect, lang }: Props) {
  const { t } = useTranslation(NAMESPACE);

  return (
    <ul className="flex flex-col divide-y divide-border-light">
      {conversations.map((conversation) => {
        const name = getSellerName(conversation.counterpart);
        const item = conversationItem(conversation, lang);
        const last = conversation.lastMessage;
        const selected = conversation.id === selectedId;
        const unread = conversation.unreadCount;

        return (
          <li key={conversation.id}>
            <button
              type="button"
              onClick={() => onSelect(conversation.id)}
              aria-current={selected ? "true" : undefined}
              className={clsx(
                "flex w-full cursor-pointer items-start gap-3 px-3 py-3 text-left transition-colors",
                "outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset",
                selected ? "bg-primary/10" : "hover:bg-background-secondary",
              )}
            >
              <Avatar
                image={getSellerAvatar(conversation.counterpart)}
                alt=""
                size="md"
                frame="raised"
              />
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <div className="flex items-baseline justify-between gap-2">
                  <Text
                    variant="span"
                    size="sm"
                    weight={unread ? "bold" : "semibold"}
                    className="truncate"
                  >
                    {name}
                  </Text>
                  <Text variant="span" size="xs" color="tertiary" className="shrink-0">
                    {shortTime(conversation.lastMessageAt, lang)}
                  </Text>
                </div>
                <Text variant="span" size="xs" color="secondary" className="truncate">
                  {t(`roles.${conversation.myRole}`)} ·{" "}
                  {item?.name ?? t("itemUnavailable")}
                </Text>
                <div className="flex items-center justify-between gap-2">
                  <Text
                    variant="span"
                    size="sm"
                    color={unread ? "primary" : "secondary"}
                    weight={unread ? "semibold" : "normal"}
                    className="truncate"
                  >
                    {last ? `${last.mine ? `${t("you")}: ` : ""}${last.body}` : ""}
                  </Text>
                  {unread > 0 && (
                    <span
                      className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-bold text-on-primary"
                      aria-label={t("a11y.unread", { count: String(unread) })}
                    >
                      {unread > 99 ? "99+" : unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

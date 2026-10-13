"use client";
import clsx from "clsx";
import { MessageCircle } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { EmptyState } from "@/components/Feedback/EmptyState";
import { Text } from "@/components/Primitives/Text";
import { useTranslation } from "@/i18n/context";
import { useConversations } from "../hooks/useConversations";
import { NAMESPACE } from "../i18n";
import { ConversationList } from "./ConversationList";
import { ConversationThread } from "./ConversationThread";

/**
 * The inbox and the open thread side by side (WEB-22); one at a time on
 * narrow screens. The open thread lives in the URL (`?c=<id>`), so links from
 * notifications and listings land on it and Back returns to the list.
 */
export function MessagesView({ lang }: { lang: string }) {
  const { t } = useTranslation(NAMESPACE);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { conversations, loading } = useConversations();

  const selected = Number(searchParams.get("c")) || null;
  const select = (id: number | null) =>
    router.replace(id ? `${pathname}?c=${id}` : pathname, { scroll: false });

  if (!loading && conversations.length === 0 && !selected) {
    return (
      <EmptyState
        icon={MessageCircle}
        title={t("empty.title")}
        description={t("empty.description")}
      />
    );
  }

  return (
    <div className="flex h-[calc(100dvh-14rem)] min-h-[28rem] overflow-hidden rounded-2xl border border-border-light bg-surface">
      <aside
        aria-label={t("inbox")}
        className={clsx(
          "w-full shrink-0 overflow-y-auto border-r border-border-light md:w-80",
          selected ? "hidden md:block" : "block",
        )}
      >
        <ConversationList
          conversations={conversations}
          selectedId={selected}
          onSelect={select}
          lang={lang}
        />
      </aside>
      <div
        className={clsx("min-w-0 flex-1 flex-col", selected ? "flex" : "hidden md:flex")}
      >
        {selected ? (
          <ConversationThread
            key={selected}
            conversationId={selected}
            lang={lang}
            onBack={() => select(null)}
          />
        ) : (
          <div className="flex flex-1 items-center justify-center p-6">
            <Text variant="p" size="sm" color="secondary">
              {t("select")}
            </Text>
          </div>
        )}
      </div>
    </div>
  );
}

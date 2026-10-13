"use client";
import clsx from "clsx";
import { ArrowLeft, Ban, Flag, Lock, Send, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";

import { ConfirmDialog } from "@/components/Overlays";
import { Avatar } from "@/components/Primitives/Avatar";
import { Button } from "@/components/Primitives/Button";
import { Text } from "@/components/Primitives/Text";
import { getSellerAvatar, getSellerName } from "@/features/seller/sellerDisplay";
import { useTranslation } from "@/i18n/context";
import { useConversationThread } from "../hooks/useConversationThread";
import { NAMESPACE } from "../i18n";
import type { ChatMessage } from "../types";
import { conversationItem, startsNewDay } from "../utils";

const MAX_LENGTH = 2000;
/** Within this many pixels of the bottom, new messages scroll into view. */
const STICK_TO_BOTTOM_PX = 120;

interface Props {
  conversationId: number;
  lang: string;
  /** Narrow screens show one pane at a time; this returns to the inbox. */
  onBack?: () => void;
}

/** One conversation (WEB-22). Mount with `key={conversationId}`. */
export function ConversationThread({ conversationId, lang, onBack }: Props) {
  const { t } = useTranslation(NAMESPACE);
  const thread = useConversationThread(conversationId);
  const { conversation, messages, loaded } = thread;

  const [draft, setDraft] = useState("");
  const [reportId, setReportId] = useState<number | null>(null);
  const [confirmBlock, setConfirmBlock] = useState(false);

  const scroller = useRef<HTMLDivElement>(null);
  const nearBottom = useRef(true);
  const firstScroll = useRef(true);

  // Land on the latest message, then follow new ones only when the reader is
  // already at the bottom, so reading history is never yanked away.
  useLayoutEffect(() => {
    const el = scroller.current;
    if (!el || !messages.length) return;
    if (firstScroll.current || nearBottom.current) {
      el.scrollTop = el.scrollHeight;
      firstScroll.current = false;
    }
  }, [messages]);

  const onScroll = () => {
    const el = scroller.current;
    if (!el) return;
    nearBottom.current =
      el.scrollHeight - el.scrollTop - el.clientHeight < STICK_TO_BOTTOM_PX;
  };

  const submit = async () => {
    const body = draft.trim();
    if (!body || thread.sending) return;
    nearBottom.current = true;
    if (await thread.send(body)) setDraft("");
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void submit();
    }
  };

  if (!conversation) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <Text variant="p" size="sm" color="secondary">
          {thread.error ? t("feedback.loadFailed") : t("loading")}
        </Text>
      </div>
    );
  }

  const name = getSellerName(conversation.counterpart);
  const item = conversationItem(conversation, lang);
  const blocked = conversation.status === "BLOCKED";

  return (
    <section
      aria-label={t("a11y.thread", { name })}
      className="flex min-h-0 flex-1 flex-col"
    >
      {/* Header: who, about what, and the block switch. */}
      <header className="flex items-center gap-3 border-b border-border-light px-3 py-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label={t("back")}
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full hover:bg-background-secondary md:hidden"
          >
            <ArrowLeft size={18} aria-hidden />
          </button>
        )}
        <Avatar
          image={getSellerAvatar(conversation.counterpart)}
          alt=""
          size="md"
          frame="raised"
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <Link
            href={`/${lang}/seller/${conversation.counterpart.id}`}
            className="truncate text-sm font-bold text-foreground hover:underline"
          >
            {name}
          </Link>
          {item ? (
            <Link
              href={item.href}
              className="flex min-w-0 items-center gap-2 hover:underline"
            >
              {item.image && (
                <Image
                  src={item.image}
                  alt=""
                  width={24}
                  height={24}
                  className="h-6 w-6 shrink-0 rounded object-cover"
                />
              )}
              <Text variant="span" size="xs" color="secondary" className="truncate">
                {item.name}
              </Text>
            </Link>
          ) : (
            <Text variant="span" size="xs" color="tertiary">
              {t("itemUnavailable")}
            </Text>
          )}
        </div>
        {(!blocked || conversation.blockedByMe) && (
          <Button
            text={blocked ? t("actions.unblock") : t("actions.block")}
            leftIcon={Ban}
            variant="ghost"
            size="sm"
            onPress={() =>
              blocked ? void thread.setBlocked(false) : setConfirmBlock(true)
            }
          />
        )}
      </header>

      {!conversation.contactAllowed && !blocked && (
        <p className="flex items-start gap-2 border-b border-border-light bg-primary/5 px-4 py-2.5 text-xs text-foreground-secondary">
          <ShieldCheck size={14} className="mt-0.5 shrink-0 text-primary" aria-hidden />
          {t("contactLocked")}
        </p>
      )}

      {/* Messages, oldest at the top. */}
      <div
        ref={scroller}
        onScroll={onScroll}
        className="flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto px-3 py-4"
        aria-live="polite"
        aria-relevant="additions"
      >
        {thread.hasMore && (
          <div className="flex justify-center pb-2">
            <Button
              text={t("loadOlder")}
              variant="ghost"
              size="sm"
              onPress={() => {
                nearBottom.current = false;
                void thread.loadOlder();
              }}
            />
          </div>
        )}
        {!loaded && (
          <Text variant="p" size="sm" color="secondary" align="center">
            {t("loading")}
          </Text>
        )}
        {messages.map((message, index) => (
          <div key={message.id} className="flex flex-col gap-1.5">
            {startsNewDay(messages[index - 1], message) && (
              <Text
                variant="span"
                size="xs"
                color="tertiary"
                align="center"
                className="py-2"
              >
                {new Intl.DateTimeFormat(lang, { dateStyle: "medium" }).format(
                  new Date(message.createdAt),
                )}
              </Text>
            )}
            <MessageBubble
              message={message}
              lang={lang}
              maskedLabel={t("masked")}
              reportLabel={t("actions.report")}
              onReport={() => setReportId(message.id)}
            />
          </div>
        ))}
      </div>

      {/* Composer, or why there is none. */}
      {blocked ? (
        <p className="flex items-center gap-2 border-t border-border-light px-4 py-3 text-sm text-foreground-secondary">
          <Lock size={14} aria-hidden />
          {conversation.blockedByMe ? t("blocked.byYou") : t("blocked.byThem")}
        </p>
      ) : (
        <form
          className="flex items-end gap-2 border-t border-border-light p-3"
          onSubmit={(event) => {
            event.preventDefault();
            void submit();
          }}
        >
          <label className="sr-only" htmlFor={`composer-${conversationId}`}>
            {t("composer.label")}
          </label>
          <textarea
            id={`composer-${conversationId}`}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={onKeyDown}
            maxLength={MAX_LENGTH}
            rows={1}
            placeholder={t("composer.placeholder")}
            aria-describedby={`composer-hint-${conversationId}`}
            className="max-h-32 min-h-10 flex-1 resize-y rounded-xl border border-border bg-surface px-3 py-2 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
          />
          <span id={`composer-hint-${conversationId}`} className="sr-only">
            {t("composer.hint")}
          </span>
          <Button
            type="submit"
            text={t("composer.send")}
            loadingText={t("composer.sending")}
            loading={thread.sending}
            disabled={!draft.trim()}
            leftIcon={Send}
            size="md"
          />
        </form>
      )}

      <ConfirmDialog
        isOpen={reportId !== null}
        onClose={() => setReportId(null)}
        onConfirm={() => {
          if (reportId !== null) void thread.report(reportId);
          setReportId(null);
        }}
        title={t("actions.report")}
        description={t("actions.reportConfirm")}
        confirmLabel={t("actions.reportYes")}
        cancelLabel={t("actions.cancel")}
        icon={Flag}
      />
      <ConfirmDialog
        isOpen={confirmBlock}
        onClose={() => setConfirmBlock(false)}
        onConfirm={() => {
          void thread.setBlocked(true);
          setConfirmBlock(false);
        }}
        title={t("actions.block")}
        description={t("actions.blockConfirm")}
        confirmLabel={t("actions.blockYes")}
        cancelLabel={t("actions.cancel")}
        icon={Ban}
      />
    </section>
  );
}

function MessageBubble({
  message,
  lang,
  maskedLabel,
  reportLabel,
  onReport,
}: {
  message: ChatMessage;
  lang: string;
  maskedLabel: string;
  reportLabel: string;
  onReport: () => void;
}) {
  const time = new Intl.DateTimeFormat(lang, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(message.createdAt));

  if (message.kind === "SYSTEM") {
    return (
      <Text variant="p" size="xs" color="secondary" align="center" className="px-6">
        {message.body}
      </Text>
    );
  }

  return (
    <div
      className={clsx(
        "group flex flex-col gap-0.5",
        message.mine ? "items-end" : "items-start",
      )}
    >
      <div
        className={clsx(
          "max-w-[80%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2 text-sm",
          message.mine
            ? "rounded-br-sm bg-primary text-on-primary"
            : "rounded-bl-sm border border-border-light bg-surface text-foreground",
        )}
      >
        {message.body}
      </div>
      <div className="flex items-center gap-2 px-1">
        <Text variant="span" size="xs" color="tertiary">
          {time}
        </Text>
        {message.masked && (
          <Text
            variant="span"
            size="xs"
            color="tertiary"
            className="flex items-center gap-1"
          >
            <Lock size={11} aria-hidden />
            {maskedLabel}
          </Text>
        )}
        {!message.mine && (
          <button
            type="button"
            onClick={onReport}
            className="cursor-pointer text-xs text-foreground-tertiary opacity-0 transition-opacity hover:underline focus-visible:opacity-100 group-hover:opacity-100"
          >
            {reportLabel}
          </button>
        )}
      </div>
    </div>
  );
}

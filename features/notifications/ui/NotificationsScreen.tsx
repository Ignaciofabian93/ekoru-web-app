"use client";
import { useState } from "react";
import clsx from "clsx";
import { BellOff } from "lucide-react";

import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";
import { useLanguage } from "@/hooks/useLanguage";
import { useTranslation } from "@/i18n/context";
import { NAMESPACE } from "../i18n";
import { useNotifications } from "../hooks/useNotifications";
import { NotificationItem } from "./NotificationItem";

const PAGE_SIZE = 20;

type Filter = "all" | "unread";

/**
 * The full notification feed.
 *
 * Paging is "load more" rather than numbered pages: the list is chronological
 * and the interesting rows are always at the top, so a growing window matches
 * how it's actually read. `pageSize` grows instead of `page` advancing, which
 * keeps every loaded row in one cached result — no stitching, and marking one
 * read refetches a single query.
 */
export function NotificationsScreen() {
  const [language] = useLanguage();
  const { t } = useTranslation(NAMESPACE);
  const [filter, setFilter] = useState<Filter>("all");
  const [pageSize, setPageSize] = useState(PAGE_SIZE);

  const {
    notifications,
    pageInfo,
    loading,
    markRead,
    markAllRead,
    markingAll,
  } = useNotifications({ pageSize, onlyUnread: filter === "unread" });

  const hasUnread = notifications.some((n) => !n.isRead);
  const isEmpty = !loading && notifications.length === 0;

  const changeFilter = (next: Filter) => {
    setFilter(next);
    setPageSize(PAGE_SIZE);
  };

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-6">
      <header className="mb-5">
        <Title level="h1" size="h3">
          {t("title")}
        </Title>
        <Text variant="p" size="sm" className="mt-1 text-foreground-secondary">
          {t("subtitle")}
        </Text>
      </header>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label={t("title")}
          className="flex gap-1 rounded-lg bg-background-secondary p-1"
        >
          {(["all", "unread"] as const).map((value) => (
            <button
              key={value}
              role="tab"
              type="button"
              aria-selected={filter === value}
              onClick={() => changeFilter(value)}
              className={clsx(
                "cursor-pointer rounded-md px-3 py-1.5 text-sm font-semibold",
                "outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary",
                filter === value
                  ? "bg-surface text-foreground shadow-sm"
                  : "text-foreground-secondary hover:text-foreground",
              )}
            >
              {t(`filters.${value}`)}
            </button>
          ))}
        </div>

        {hasUnread && (
          <button
            type="button"
            onClick={() => void markAllRead()}
            disabled={markingAll}
            className={clsx(
              "cursor-pointer rounded-md px-2.5 py-1.5 text-sm font-semibold",
              "text-primary outline-none transition-colors",
              "hover:bg-primary-light-bg focus-visible:ring-2 focus-visible:ring-primary",
              "disabled:cursor-not-allowed disabled:opacity-50",
            )}
          >
            {t("markAllRead")}
          </button>
        )}
      </div>

      {loading && (
        <p className="py-10 text-center text-sm text-foreground-tertiary">
          {t("loading")}
        </p>
      )}

      {isEmpty && (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-border-light bg-surface px-6 py-14 text-center">
          <BellOff
            size={28}
            aria-hidden
            className="text-foreground-tertiary"
            strokeWidth={1.6}
          />
          <Text variant="p" size="base" weight="bold">
            {t(filter === "unread" ? "emptyUnread.title" : "empty.title")}
          </Text>
          <Text
            variant="p"
            size="sm"
            className="max-w-sm text-foreground-secondary"
          >
            {t(
              filter === "unread"
                ? "emptyUnread.description"
                : "empty.description",
            )}
          </Text>
        </div>
      )}

      {notifications.length > 0 && (
        <ul className="divide-y divide-border-light overflow-hidden rounded-xl border border-border-light bg-surface">
          {notifications.map((notification) => (
            <li key={notification.id}>
              <NotificationItem
                notification={notification}
                lang={language}
                onRead={(id) => void markRead(id)}
              />
            </li>
          ))}
        </ul>
      )}

      {pageInfo?.hasNextPage && (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={() => setPageSize((size) => size + PAGE_SIZE)}
            className={clsx(
              "cursor-pointer rounded-lg border border-border px-4 py-2",
              "text-sm font-semibold text-foreground-secondary outline-none",
              "transition-colors hover:bg-background-secondary",
              "focus-visible:ring-2 focus-visible:ring-primary",
            )}
          >
            {t("loadMore")}
          </button>
        </div>
      )}
    </section>
  );
}

"use client";
import { useId } from "react";
import clsx from "clsx";
import Link from "next/link";
import { Bell } from "lucide-react";

import { DropdownPanel, useDropdown } from "@/components/Overlays/Dropdown";
import { Text } from "@/components/Primitives/Text";
import { useLanguage } from "@/hooks/useLanguage";
import { useTranslation } from "@/i18n/context";
import { useIsAuthenticated } from "@/store/useAuthStore";
import { NAMESPACE } from "../i18n";
import { useNotifications } from "../hooks/useNotifications";
import { useNotificationsBadge } from "../hooks/useNotificationsBadge";
import { NotificationItem } from "./NotificationItem";

/** How many rows the panel previews before deferring to the full page. */
const PREVIEW_SIZE = 6;

/**
 * Navbar bell: unread badge plus a preview panel.
 *
 * The badge count polls on every page (it's a single integer), but the list
 * itself is only fetched once the panel has been opened — most page views never
 * open it, and the rows are the expensive half.
 *
 * Hidden entirely for guests: there is nothing to show and the query would be
 * skipped anyway.
 */
export function NotificationBell() {
  const panelId = useId();
  const [language] = useLanguage();
  const { t } = useTranslation(NAMESPACE);
  const isAuthenticated = useIsAuthenticated();

  const { isOpen, close, toggle, containerRef, triggerRef } =
    useDropdown<HTMLButtonElement>();

  const unreadCount = useNotificationsBadge();
  const { notifications, loading, markRead, markAllRead, markingAll } =
    useNotifications({
      pageSize: PREVIEW_SIZE,
      // `hasOpened` would keep it mounted after closing; `isOpen` is enough
      // because Apollo caches the result for the next open.
      enabled: isOpen,
    });

  if (!isAuthenticated) return null;

  const accessibleName =
    unreadCount === 0
      ? t("a11y.bellNoUnread")
      : unreadCount === 1
        ? t("a11y.bellOneUnread")
        : t("a11y.bellUnread", { count: String(unreadCount) });

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center"
    >
      <button
        ref={triggerRef}
        type="button"
        onClick={toggle}
        aria-label={accessibleName}
        aria-expanded={isOpen}
        aria-controls={panelId}
        aria-haspopup="menu"
        className={clsx(
          "relative flex w-10 h-10 shrink-0 cursor-pointer items-center justify-center",
          "rounded-full border border-white/25 bg-white/10 outline-none",
          "transition-all duration-150 hover:border-white/50 hover:bg-white/20",
          "focus-visible:border-white focus-visible:ring-2 focus-visible:ring-white/80",
        )}
      >
        <Bell size={18} color="#fff" strokeWidth={1.6} aria-hidden />
        {unreadCount > 0 && (
          // The count is already in the button's accessible name above.
          <span
            aria-hidden
            className={clsx(
              "absolute -right-2 -top-1 flex h-5 min-w-5 items-center justify-center",
              "rounded-full border border-white/40 bg-secondary-dark font-bold leading-none",
              unreadCount > 9 ? "px-1" : "px-0",
            )}
          >
            <Text variant="span" weight="bold" size="xs" color="white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Text>
          </span>
        )}
      </button>

      <DropdownPanel
        id={panelId}
        isOpen={isOpen}
        keepMounted
        width="w-[22rem] max-w-[calc(100vw-2rem)]"
        className="top-[calc(100%+10px)]"
      >
        <div className="flex items-center justify-between gap-2 border-b border-border-light px-4 py-3">
          <Text variant="span" size="sm" weight="bold">
            {t("title")}
          </Text>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={() => void markAllRead()}
              disabled={markingAll}
              className={clsx(
                "cursor-pointer rounded-md px-1.5 py-0.5 text-xs font-semibold",
                "text-primary outline-none transition-colors",
                "hover:bg-primary-light-bg focus-visible:ring-2 focus-visible:ring-primary",
                "disabled:cursor-not-allowed disabled:opacity-50",
              )}
            >
              {t("markAllRead")}
            </button>
          )}
        </div>

        <div
          role="region"
          aria-label={t("a11y.panel")}
          className="max-h-[22rem] divide-y divide-border-light overflow-y-auto"
        >
          {loading && (
            <p className="px-4 py-6 text-center text-xs text-foreground-tertiary">
              {t("loading")}
            </p>
          )}

          {!loading && notifications.length === 0 && (
            <div className="px-4 py-8 text-center">
              <Text variant="p" size="sm" weight="semibold">
                {t("empty.title")}
              </Text>
              <Text
                variant="p"
                size="xs"
                className="mt-1 text-foreground-secondary"
              >
                {t("empty.description")}
              </Text>
            </div>
          )}

          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              lang={language}
              onRead={(id) => void markRead(id)}
              onNavigate={close}
              compact
            />
          ))}
        </div>

        <Link
          href={`/${language}/notifications`}
          onClick={close}
          className={clsx(
            "block border-t border-border-light px-4 py-2.5 text-center",
            "text-xs font-semibold text-primary outline-none transition-colors",
            "hover:bg-background-secondary focus-visible:bg-background-secondary",
          )}
        >
          {t("viewAll")}
        </Link>
      </DropdownPanel>
    </div>
  );
}

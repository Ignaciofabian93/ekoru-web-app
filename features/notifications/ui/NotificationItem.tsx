"use client";
import clsx from "clsx";
import Link from "next/link";

import { Text } from "@/components/Primitives/Text";
import { useTranslation } from "@/i18n/context";
import { NAMESPACE } from "../i18n";
import { notificationHref } from "../lib/notificationHref";
import { notificationIcon } from "../lib/notificationIcon";
import { relativeTime } from "../lib/relativeTime";
import type { AppNotification } from "../types";

interface NotificationItemProps {
  notification: AppNotification;
  lang: string;
  /** Marks read; the row navigates whether or not this succeeds. */
  onRead: (id: number) => void;
  /** Lets the bell close its panel on navigation. */
  onNavigate?: () => void;
  compact?: boolean;
}

/**
 * One row of the feed. The whole row is a single link — the title and message
 * are already the description of where it goes, so there is no separate
 * "view" affordance to tab past.
 */
export function NotificationItem({
  notification,
  lang,
  onRead,
  onNavigate,
  compact = false,
}: NotificationItemProps) {
  const { t } = useTranslation(NAMESPACE);
  const { icon: Icon, accent } = notificationIcon(notification.type);
  const href = notificationHref(notification, lang);

  const handleClick = () => {
    if (!notification.isRead) onRead(notification.id);
    onNavigate?.();
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      aria-current={notification.isRead ? undefined : "true"}
      className={clsx(
        "group flex w-full items-start gap-3 text-left outline-none transition-colors",
        "hover:bg-background-secondary focus-visible:bg-background-secondary",
        compact ? "px-3 py-2.5" : "px-4 py-3.5",
        !notification.isRead && "bg-primary-light-bg/40",
      )}
    >
      <span
        aria-hidden
        className={clsx(
          "mt-0.5 flex shrink-0 items-center justify-center rounded-full",
          "bg-background-secondary",
          compact ? "size-8" : "size-9",
          accent,
        )}
      >
        <Icon size={compact ? 15 : 17} strokeWidth={2} />
      </span>

      <span className="min-w-0 flex-1">
        <Text
          variant="span"
          size="sm"
          weight={notification.isRead ? "semibold" : "bold"}
          className="block line-clamp-1"
        >
          {notification.title}
        </Text>
        <Text
          variant="span"
          size="xs"
          className="block text-foreground-secondary line-clamp-2"
        >
          {notification.message}
        </Text>
        <Text
          variant="span"
          size="xs"
          className="mt-0.5 block text-foreground-tertiary"
        >
          {relativeTime(notification.createdAt, t, lang)}
        </Text>
      </span>

      {!notification.isRead && (
        // The row's `aria-current` already conveys unread state; this is the
        // visual half of the same signal.
        <span
          aria-hidden
          title={t("a11y.unreadDot")}
          className="mt-2 size-2 shrink-0 rounded-full bg-primary"
        />
      )}
    </Link>
  );
}

"use client";
import clsx from "clsx";
import { MessageCircle } from "lucide-react";
import Link from "next/link";

import { Text } from "@/components/Primitives/Text";
import { useLanguage } from "@/hooks/useLanguage";
import { useTranslation } from "@/i18n/context";
import { useIsAuthenticated } from "@/store/useAuthStore";
import { useUnreadConversations } from "../hooks/useUnreadConversations";

/**
 * Navbar link to the inbox with the unread badge (WEB-22), styled like the
 * notification bell beside it. Hidden for guests.
 */
export function MessagesNavButton() {
  const [language] = useLanguage();
  const { t } = useTranslation();
  const isAuthenticated = useIsAuthenticated();
  const unread = useUnreadConversations();

  if (!isAuthenticated) return null;

  const label =
    unread === 0
      ? t("chatActions.navLabel")
      : t("chatActions.navUnread", { count: String(unread) });

  return (
    <Link
      href={`/${language}/profile/messages`}
      aria-label={label}
      className={clsx(
        "relative flex h-10 w-10 shrink-0 items-center justify-center",
        "rounded-full border border-white/25 bg-white/10 outline-none",
        "transition-all duration-150 hover:border-white/50 hover:bg-white/20",
        "focus-visible:border-white focus-visible:ring-2 focus-visible:ring-white/80",
      )}
    >
      <MessageCircle size={18} color="#fff" strokeWidth={1.6} aria-hidden />
      {unread > 0 && (
        // The count is already in the link's accessible name.
        <span
          aria-hidden
          className={clsx(
            "absolute -right-2 -top-1 flex h-5 min-w-5 items-center justify-center",
            "rounded-full border border-white/40 bg-secondary-dark font-bold leading-none",
            unread > 9 ? "px-1" : "px-0",
          )}
        >
          <Text variant="span" weight="bold" size="xs" color="white">
            {unread > 99 ? "99+" : unread}
          </Text>
        </span>
      )}
    </Link>
  );
}

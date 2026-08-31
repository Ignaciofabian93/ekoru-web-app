import clsx from "clsx";
import { Info, type LucideIcon } from "lucide-react";
import type React from "react";
import {
  notificationBannerClass,
  notificationBannerContentClass,
  notificationBannerTextClass,
} from "@/design/notification-banner";

export type NotificationBannerVariant = "neutral" | "info" | "warning";

export interface NotificationBannerProps {
  /** Already-translated copy — callers pass it from their own dictionary. */
  message: string;
  variant?: NotificationBannerVariant;
  /** Leading icon. Decorative: the message carries the meaning on its own. */
  icon?: LucideIcon;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
}

/**
 * A single-line site-wide notice — the beta announcement above the navbar
 * today. Deliberately thin and non-interactive: it states something and gets
 * out of the way, so it never competes with the header it sits on.
 *
 * `role="status"` rather than `alert`: the message is informational and already
 * on the page at load, so it should never interrupt a screen reader mid-flow.
 */
export function NotificationBanner({
  message,
  variant = "neutral",
  icon: Icon = Info,
  className,
  ref,
}: NotificationBannerProps) {
  return (
    <div
      ref={ref}
      role="status"
      className={clsx(notificationBannerClass[variant], className)}
    >
      <div className={notificationBannerContentClass}>
        <Icon
          size={14}
          color="currentColor"
          strokeWidth={2}
          aria-hidden
          className="shrink-0"
        />
        <span className={notificationBannerTextClass}>{message}</span>
      </div>
    </div>
  );
}

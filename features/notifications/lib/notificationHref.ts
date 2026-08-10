import type { AppNotification, NotificationType } from "../types";

/**
 * Where tapping a notification should take you, as a `/[lang]`-prefixed path.
 *
 * Routing is derived from the notification `type`, not from the `actionUrl` the
 * backend stores. That field is written by whichever service raised the event
 * and describes the *domain* ("the order detail"), while web and mobile lay
 * their screens out differently — so each client owns its own mapping and the
 * backend never has to know this app's route table.
 *
 * Unknown types land on the notifications list, which is always a valid page.
 */
const ROUTE_BY_TYPE: Partial<Record<NotificationType, string>> = {
  SALE_PROPOSAL: "/deals",
  EXCHANGE_PROPOSAL: "/deals",
  EXCHANGE_ACCEPTED: "/deals",
  EXCHANGE_DECLINED: "/deals",
  EXCHANGE_COMPLETED: "/deals",

  ORDER_RECEIVED: "/profile/orders",
  ORDER_CONFIRMED: "/profile/orders",
  ORDER_SHIPPED: "/profile/orders",
  ORDER_DELIVERED: "/profile/orders",
  ORDER_CANCELLED: "/profile/orders",
  PAYMENT_RECEIVED: "/profile/orders",
  PAYMENT_FAILED: "/profile/orders",
  PAYMENT_REFUNDED: "/profile/orders",

  SECURITY_LOGIN_ALERT: "/profile/settings",
};

export function notificationHref(
  notification: Pick<AppNotification, "type">,
  lang: string,
): string {
  const route = ROUTE_BY_TYPE[notification.type] ?? "/notifications";
  return `/${lang}${route}`;
}

/** True when following the notification would just reload the current list. */
export function isSelfLink(
  notification: Pick<AppNotification, "type">,
): boolean {
  return !(notification.type in ROUTE_BY_TYPE);
}

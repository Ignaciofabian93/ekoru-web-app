import {
  Bell,
  BadgeCheck,
  CalendarCheck,
  CalendarClock,
  CalendarX,
  FileText,
  Handshake,
  PackageCheck,
  ShieldAlert,
  Truck,
  XCircle,
  RotateCcw,
  type LucideIcon,
} from "lucide-react";

import type { NotificationType } from "../types";

/**
 * Icon + accent per notification type. The accent is a Tailwind text colour;
 * it carries tone (a cancellation reads differently from a delivery) but is
 * never the only signal — the title says what happened.
 */
interface IconSpec {
  icon: LucideIcon;
  accent: string;
}

const DEFAULT_SPEC: IconSpec = {
  icon: Bell,
  accent: "text-foreground-secondary",
};

const SPEC_BY_TYPE: Partial<Record<NotificationType, IconSpec>> = {
  SALE_PROPOSAL: { icon: Handshake, accent: "text-primary" },
  EXCHANGE_PROPOSAL: { icon: Handshake, accent: "text-primary" },
  EXCHANGE_ACCEPTED: { icon: BadgeCheck, accent: "text-primary" },
  EXCHANGE_COMPLETED: { icon: BadgeCheck, accent: "text-primary" },
  EXCHANGE_DECLINED: { icon: XCircle, accent: "text-red-500" },

  ORDER_RECEIVED: { icon: PackageCheck, accent: "text-primary" },
  ORDER_CONFIRMED: { icon: BadgeCheck, accent: "text-primary" },
  ORDER_SHIPPED: { icon: Truck, accent: "text-secondary-dark" },
  ORDER_DELIVERED: { icon: PackageCheck, accent: "text-primary" },
  ORDER_CANCELLED: { icon: XCircle, accent: "text-red-500" },

  PAYMENT_RECEIVED: { icon: BadgeCheck, accent: "text-primary" },
  PAYMENT_FAILED: { icon: XCircle, accent: "text-red-500" },
  PAYMENT_REFUNDED: { icon: RotateCcw, accent: "text-secondary-dark" },

  QUOTATION_REQUEST: { icon: FileText, accent: "text-primary" },
  QUOTATION_RECEIVED: { icon: FileText, accent: "text-primary" },
  QUOTATION_ACCEPTED: { icon: BadgeCheck, accent: "text-primary" },
  QUOTATION_DECLINED: { icon: XCircle, accent: "text-red-500" },
  QUOTATION_COMPLETED: { icon: BadgeCheck, accent: "text-primary" },

  BOOKING_REQUEST: { icon: CalendarClock, accent: "text-primary" },
  BOOKING_CONFIRMED: { icon: CalendarCheck, accent: "text-primary" },
  BOOKING_CANCELLED: { icon: CalendarX, accent: "text-red-500" },
  BOOKING_COMPLETED: { icon: BadgeCheck, accent: "text-primary" },

  SECURITY_LOGIN_ALERT: { icon: ShieldAlert, accent: "text-amber-500" },
};

export function notificationIcon(type: NotificationType): IconSpec {
  return SPEC_BY_TYPE[type] ?? DEFAULT_SPEC;
}

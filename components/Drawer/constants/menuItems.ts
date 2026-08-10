import {
  Bell,
  FileText,
  Handshake,
  Info,
  Leaf,
  MessageCircle,
  Package,
  Settings,
  UserRound,
  type LucideIcon,
} from "lucide-react";

/**
 * Config-driven drawer menu, same shape as the settings screen
 * (`features/profile/constants/menuItems.ts`). The difference: drawer items are
 * plain links, not toggles — each one carries the route it navigates to.
 *
 * `available: false` renders the row disabled with a "Proximamente" (coming
 * soon) chip instead of navigating — flip it to `true` once the page ships.
 * Labels are dictionary keys resolved against the `drawer` namespace.
 */
export type MenuField =
  | "profile"
  | "notifications"
  | "deals"
  | "settings"
  | "orders"
  | "environmentalImpact";

export type SupportMenuField = "contact" | "termsAndConditions" | "aboutEKORU";

export const MENU_FIELDS: MenuField[] = [
  "profile",
  "notifications",
  "deals",
  "settings",
  "orders",
  "environmentalImpact",
];

export const SUPPORT_MENU_FIELDS: SupportMenuField[] = [
  "contact",
  "termsAndConditions",
  "aboutEKORU",
];

export type MenuItem = {
  route: string;
  label: MenuField;
  icon: LucideIcon;
  available: boolean;
};

export type SupportMenuItem = {
  route: string;
  label: SupportMenuField;
  icon: LucideIcon;
  available: boolean;
};

export type DrawerMenuItem = MenuItem | SupportMenuItem;

export type DrawerMenuSection = {
  key: string;
  label: string;
  items: DrawerMenuItem[];
};

export const ACCOUNT_MENU_SECTIONS: DrawerMenuSection[] = [
  {
    key: "account",
    label: "sections.account",
    items: [
      { route: "/profile", label: "profile", icon: UserRound, available: true },
      {
        route: "/notifications",
        label: "notifications",
        icon: Bell,
        available: true,
      },
      { route: "/deals", label: "deals", icon: Handshake, available: true },
      {
        route: "/profile/settings",
        label: "settings",
        icon: Settings,
        available: true,
      },
      {
        route: "/profile/orders",
        label: "orders",
        icon: Package,
        available: false,
      },
      {
        route: "/profile/environmental-impact",
        label: "environmentalImpact",
        icon: Leaf,
        available: false,
      },
    ],
  },
];

export const SUPPORT_MENU_SECTIONS: DrawerMenuSection[] = [
  {
    key: "support",
    label: "sections.support",
    items: [
      {
        route: "/contact",
        label: "contact",
        icon: MessageCircle,
        available: true,
      },
      {
        route: "/terms-and-conditions",
        label: "termsAndConditions",
        icon: FileText,
        available: true,
      },
      {
        route: "/about-ekoru",
        label: "aboutEKORU",
        icon: Info,
        available: true,
      },
    ],
  },
];

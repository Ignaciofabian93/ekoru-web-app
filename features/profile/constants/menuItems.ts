import {
  Bell,
  BellRing,
  Building2,
  EyeOff,
  Flag,
  Gem,
  Globe,
  Heart,
  KeyRound,
  Leaf,
  Mail,
  MapPin,
  PackagePlus,
  Phone,
  Pin,
  Repeat2,
  Settings,
  Shield,
  ShieldCheck,
  Trash2,
  UserRoundPen,
  type LucideIcon,
} from "lucide-react";

import type { Seller } from "@/types/user";

/**
 * Config-driven settings pattern.
 *
 * The whole settings screen is described by data: each item is either a
 * `toggle` (bound to a boolean `SellerPreferences` field) or an `action`
 * (a button, e.g. deactivate/delete). `available: false` renders the item
 * disabled with a "Proximamente" (coming soon) chip — flip it to `true` to
 * ship the feature. Add a new preference by adding one entry (and the matching
 * field on the SellerPreferences table). Reuse this shape for other option
 * screens.
 */
export type PreferenceField =
  | "enableEmailNotifications"
  | "enablePushNotifications"
  | "showMySocials"
  | "showMyAddress"
  | "enableTwoFactorAuth"
  | "enableLoginAlerts";

/** The persisted preference fields, in one place (for state + dirty checks). */
export const PREFERENCE_FIELDS: PreferenceField[] = [
  "enableEmailNotifications",
  "enablePushNotifications",
  "showMySocials",
  "showMyAddress",
  "enableTwoFactorAuth",
  "enableLoginAlerts",
];

export type SettingToggleItem = {
  kind: "toggle";
  field: PreferenceField;
  label: string;
  description: string;
  icon: LucideIcon;
  available: boolean;
};

export type SettingActionItem = {
  kind: "action";
  action: "deactivate" | "delete";
  label: string;
  description: string;
  icon: LucideIcon;
  available: boolean;
  danger?: boolean;
};

export type SettingItem = SettingToggleItem | SettingActionItem;

export type SettingsSection = {
  key: string;
  label: string;
  subtitle: string;
  icon: LucideIcon;
  tone?: "default" | "success" | "danger";
  items: SettingItem[];
};

export const SETTINGS_SECTIONS: SettingsSection[] = [
  {
    key: "notifications",
    label: "settings.notifications",
    subtitle: "settings.notificationsSubtitle",
    icon: Bell,
    items: [
      {
        kind: "toggle",
        field: "enableEmailNotifications",
        label: "settings.emailNotifications",
        description: "settings.emailNotificationsDescription",
        icon: Mail,
        available: true,
      },
      {
        kind: "toggle",
        field: "enablePushNotifications",
        label: "settings.pushNotifications",
        description: "settings.pushNotificationsDescription",
        icon: BellRing,
        available: false,
      },
    ],
  },
  {
    key: "privacy",
    label: "settings.privacy",
    subtitle: "settings.privacySubtitle",
    icon: Shield,
    items: [
      {
        kind: "toggle",
        field: "showMySocials",
        label: "settings.showMySocials",
        description: "settings.showMySocialsDescription",
        icon: Globe,
        available: true,
      },
      {
        kind: "toggle",
        field: "showMyAddress",
        label: "settings.showMyAddress",
        description: "settings.showMyAddressDescription",
        icon: MapPin,
        available: true,
      },
    ],
  },
  {
    key: "security",
    label: "settings.security",
    subtitle: "settings.securitySubtitle",
    icon: ShieldCheck,
    tone: "success",
    items: [
      {
        kind: "toggle",
        field: "enableTwoFactorAuth",
        label: "settings.twoFactorAuth",
        description: "settings.twoFactorAuthDescription",
        icon: KeyRound,
        available: false,
      },
      {
        kind: "toggle",
        field: "enableLoginAlerts",
        label: "settings.loginAlerts",
        description: "settings.loginAlertsDescription",
        icon: BellRing,
        available: false,
      },
    ],
  },
  {
    key: "danger",
    label: "settings.dangerZone",
    subtitle: "settings.dangerZoneSubtitle",
    icon: Trash2,
    tone: "danger",
    items: [
      {
        kind: "action",
        action: "deactivate",
        label: "settings.deactivateAccount",
        description: "settings.deactivateAccountDescription",
        icon: EyeOff,
        available: true,
      },
      {
        kind: "action",
        action: "delete",
        label: "settings.deleteAccount",
        description: "settings.deleteAccountDescription",
        icon: Trash2,
        available: true,
        danger: true,
      },
    ],
  },
];

/**
 * Config-driven account card — the drawer's link pattern, on the profile.
 *
 * Every item is a plain link: a route (without the `/[lang]` prefix), a
 * dictionary key, an icon, and `available`. Setting `available: false` renders
 * the row inert with a "Proximamente" chip instead of navigating, so a page
 * that hasn't shipped never becomes a dead link.
 */
export type ProfileMenuField =
  | "editProfile"
  | "changePassword"
  | "orderHistory"
  | "exchanges"
  | "favorites"
  | "environmentalImpact"
  | "subscription"
  | "settings";

export const PROFILE_MENU_FIELDS: ProfileMenuField[] = [
  "editProfile",
  "changePassword",
  "orderHistory",
  "exchanges",
  "favorites",
  "environmentalImpact",
  "subscription",
  "settings",
];

export type ProfileMenuItem = {
  route: string;
  label: string;
  icon: LucideIcon;
  available: boolean;
};

export type ProfileMenuSection = {
  key: string;
  label: string;
  description: string;
  items: ProfileMenuItem[];
};

export const PROFILE_MENU_SECTIONS: ProfileMenuSection[] = [
  {
    key: "account",
    label: "account.title",
    description: "account.subtitle",
    items: [
      {
        route: "/profile/edit-profile",
        label: "account.editProfile",
        icon: UserRoundPen,
        available: true,
      },
      {
        route: "/profile/change-password",
        label: "account.changePassword",
        icon: KeyRound,
        available: true,
      },
      {
        route: "/profile/orders",
        label: "account.orderHistory",
        icon: PackagePlus,
        available: false,
      },
      {
        route: "/profile/exchanges",
        label: "account.exchanges",
        icon: Repeat2,
        available: false,
      },
      {
        route: "/profile/favorites",
        label: "account.favorites",
        icon: Heart,
        available: true,
      },
      {
        route: "/profile/environmental-impact",
        label: "account.environmentalImpact",
        icon: Leaf,
        available: false,
      },
      {
        route: "/profile/subscription",
        label: "account.subscription",
        icon: Gem,
        available: false,
      },
      {
        route: "/profile/settings",
        label: "account.settings",
        icon: Settings,
        available: true,
      },
    ],
  },
];

/**
 * Config-driven details card. Same section/item shape as the account links,
 * minus the interaction: these rows only read. Each item pulls its own value
 * off the seller, so the component stays a renderer and adding a field is one
 * entry plus its label in the three locales.
 */
export type ProfileDetailField =
  | "phone"
  | "address"
  | "county"
  | "city"
  | "region"
  | "country";

export const PROFILE_DETAIL_FIELDS: ProfileDetailField[] = [
  "phone",
  "address",
  "county",
  "city",
  "region",
  "country",
];

export type ProfileDetailItem = {
  field: ProfileDetailField;
  label: string;
  icon: LucideIcon;
  /** Reads the displayed value. Missing values render as an em dash. */
  value: (seller: Seller | null | undefined) => string | null | undefined;
};

export type ProfileDetailSection = {
  key: string;
  label: string;
  description: string;
  items: ProfileDetailItem[];
};

export const PROFILE_DETAIL_SECTIONS: ProfileDetailSection[] = [
  {
    key: "details",
    label: "details.title",
    description: "details.subtitle",
    items: [
      {
        field: "phone",
        label: "details.phone",
        icon: Phone,
        // Stored with its `+` already (see useEditProfile), so it is shown as-is.
        value: (seller) => seller?.phone,
      },
      {
        field: "address",
        label: "details.address",
        icon: MapPin,
        value: (seller) => seller?.address,
      },
      {
        field: "county",
        label: "details.county",
        icon: Pin,
        value: (seller) => seller?.county?.county,
      },
      {
        field: "city",
        label: "details.city",
        icon: Building2,
        value: (seller) => seller?.city?.city,
      },
      {
        field: "region",
        label: "details.region",
        icon: Flag,
        value: (seller) => seller?.region?.region,
      },
      {
        field: "country",
        label: "details.country",
        icon: Globe,
        value: (seller) => seller?.country?.country,
      },
    ],
  },
];

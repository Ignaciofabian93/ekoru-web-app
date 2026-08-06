import {
  Bell,
  BellRing,
  EyeOff,
  Globe,
  KeyRound,
  Mail,
  MapPin,
  Shield,
  ShieldCheck,
  Trash2,
  type LucideIcon,
} from "lucide-react";

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

import {
  Bell,
  FileText,
  Handshake,
  Info,
  LogIn,
  MessageCircle,
  PackagePlus,
  Recycle,
  UserRound,
  UserRoundPlus,
  type LucideIcon,
} from "lucide-react";

/**
 * Config-driven avatar dropdown — the same shape as the drawer's menu and the
 * settings screen.
 *
 * Every item is a plain link: a route (without the `/[lang]` prefix), a
 * dictionary key, an icon, and `available`. Setting `available: false` renders
 * the row inert with a "coming soon" note under its label, so a page that
 * hasn't shipped never becomes a dead link — flip it to `true` to ship.
 *
 * The dropdown is the desktop counterpart of the drawer, so the two carry the
 * same entries; keep them in step when either changes.
 */
export type DropdownField =
  | "myProfile"
  | "deals"
  | "recycle"
  | "publish"
  | "notifications"
  | "signIn"
  | "signUp"
  | "contact"
  | "termsAndConditions"
  | "aboutEkoru";

export type DropdownMenuItem = {
  route: string;
  label: string;
  icon: LucideIcon;
  available: boolean;
};

export type DropdownMenuSection = {
  key: string;
  /** Heading above the run of items. */
  label: string;
  items: DropdownMenuItem[];
};

/** Signed-in account actions. */
export const DROPDOWN_ACCOUNT_SECTION: DropdownMenuSection = {
  key: "account",
  label: "dropdown.account",
  items: [
    {
      route: "/profile",
      label: "dropdown.myProfile",
      icon: UserRound,
      available: true,
    },
    { route: "/deals", label: "dropdown.deals", icon: Handshake, available: true },
    { route: "/recycle", label: "dropdown.recycle", icon: Recycle, available: true },
    {
      route: "/publish",
      label: "dropdown.publish",
      icon: PackagePlus,
      available: true,
    },
    {
      route: "/notifications",
      label: "dropdown.notifications",
      icon: Bell,
      available: true,
    },
  ],
};

/** What a guest sees in place of the account section. */
export const DROPDOWN_GUEST_SECTION: DropdownMenuSection = {
  key: "guest",
  label: "dropdown.account",
  items: [
    { route: "/login", label: "dropdown.signIn", icon: LogIn, available: true },
    {
      route: "/register",
      label: "dropdown.signUp",
      icon: UserRoundPlus,
      available: true,
    },
  ],
};

/**
 * Shown to guests and signed-in visitors alike, mirroring the drawer's Support
 * section. Routes match `components/Drawer/constants/menuItems.ts`.
 */
export const DROPDOWN_SUPPORT_SECTION: DropdownMenuSection = {
  key: "support",
  label: "dropdown.support",
  items: [
    {
      route: "/contact",
      label: "dropdown.contact",
      icon: MessageCircle,
      available: true,
    },
    {
      route: "/terms-and-conditions",
      label: "dropdown.termsAndConditions",
      icon: FileText,
      available: true,
    },
    {
      route: "/about-ekoru",
      label: "dropdown.aboutEkoru",
      icon: Info,
      available: true,
    },
  ],
};

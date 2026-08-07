import {
  Recycle,
  Repeat,
  ScanBarcode,
  Store,
  UsersRound,
  Wrench,
  type LucideIcon,
} from "lucide-react";

/**
 * The page, described as data. Every entry is a dictionary key under the
 * `aboutEkoru` namespace — copy lives in `i18n/locales`, never here.
 */
export type AboutFeature = {
  key: string;
  icon: LucideIcon;
  /** Where the feature lives in the app, without the `/[lang]` prefix. */
  route: string;
};

/** What the platform actually does, one card each. */
export const ABOUT_FEATURES: readonly AboutFeature[] = [
  { key: "marketplace", icon: Store, route: "/marketplace" },
  { key: "exchange", icon: Repeat, route: "/deals" },
  { key: "stores", icon: ScanBarcode, route: "/stores" },
  { key: "services", icon: Wrench, route: "/services" },
  { key: "recycle", icon: Recycle, route: "/recycle" },
  { key: "community", icon: UsersRound, route: "/community" },
] as const;

/** Manifesto lines, rendered as a single block. */
export const ABOUT_BELIEFS: readonly string[] = [
  "repair",
  "reuse",
  "share",
  "intention",
] as const;

/**
 * UN Sustainable Development Goals the platform contributes to. The number is
 * the official SDG number, shown as the card's marker.
 */
export const ABOUT_GOALS: readonly { key: string; number: number }[] = [
  { key: "sdg11", number: 11 },
  { key: "sdg12", number: 12 },
  { key: "sdg13", number: 13 },
  { key: "sdg17", number: 17 },
] as const;

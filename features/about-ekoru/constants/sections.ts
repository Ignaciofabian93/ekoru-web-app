import {
  Recycle,
  Repeat,
  ScanBarcode,
  Store,
  UsersRound,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { FEATURES, type FeatureKey } from "@/constants/features";
import type { NavCardTone } from "@/design/nav-card";

/**
 * The page, described as data. Every entry is a dictionary key under the
 * `aboutEkoru` namespace — copy lives in `i18n/locales`, never here.
 */
export type AboutFeature = {
  key: string;
  icon: LucideIcon;
  /** Where the feature lives in the app, without the `/[lang]` prefix. */
  route: string;
  /** Tints the card's icon chip. Cycled so the rail doesn't read as one block. */
  tone: NavCardTone;
  /** The switch the feature sits behind; its card is dropped while it is off. */
  feature?: FeatureKey;
};

const ALL_FEATURES: readonly AboutFeature[] = [
  { key: "marketplace", icon: Store, route: "/marketplace", tone: "primary" },
  { key: "exchange", icon: Repeat, route: "/deals", tone: "secondary" },
  { key: "stores", icon: ScanBarcode, route: "/stores", tone: "accent" },
  { key: "services", icon: Wrench, route: "/services", tone: "primary" },
  { key: "recycle", icon: Recycle, route: "/recycle", tone: "secondary" },
  {
    key: "community",
    icon: UsersRound,
    route: "/community",
    tone: "accent",
    feature: "community",
  },
];

/** What the platform actually does, one card each. */
export const ABOUT_FEATURES: readonly AboutFeature[] = ALL_FEATURES.filter(
  (item) => !item.feature || FEATURES[item.feature].available,
);

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

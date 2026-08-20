import type { SupportedLanguage } from "@/constants/settings";
import type { BusinessType, ProductCondition } from "@/types/enums";
import type { ItemType } from "../types/Card.types";

const loaders = {
  en: () => import("./locales/en.json").then((m) => m.default),
  es: () => import("./locales/es.json").then((m) => m.default),
  fr: () => import("./locales/fr.json").then((m) => m.default),
} satisfies Record<SupportedLanguage, () => Promise<unknown>>;

export const NAMESPACE = "cards";

// All static card chrome lives here. Anything that varies per item (name,
// price, seller, impact amounts) is a prop injected at render time — the only
// dynamic pieces in the copy itself are `{{value}}` placeholders.
export type CardsDictionary = {
  /** Keyed by ProductCondition so a new enum member fails to compile until translated. */
  condition: Record<ProductCondition, string>;
  badges: {
    exchangeable: string;
    /** Generic promotion badge, used when no percentage is known. */
    offer: string;
    /** e.g. "-{{value}}%" — pass the whole-number discount as `value`. */
    discount: string;
    soldOut: string;
    /** Pill on the seller brand panel. */
    verified: string;
  };
  meta: {
    noBrand: string;
    noBusinessName: string;
    noBusinessType: string;
    /** Back-face fallback when a service carries no blurb. */
    noDescription: string;
  };
  price: {
    /** Prefix on a "from" price, e.g. services quoted from a base rate. */
    from: string;
  };
  /** Keyed by BusinessType so a new enum member fails to compile until translated. */
  businessType: Record<BusinessType, string>;
  stock: {
    /** e.g. "Only {{value}} left" — pass the remaining count as `value`. */
    lowStock: string;
    outOfStock: string;
  };
  rating: {
    /** Accessible name, e.g. "{{value}} out of 5". */
    label: string;
    /** e.g. "({{value}})" — pass the review count as `value`. */
    reviews: string;
  };
  quantity: {
    /** Accessible name of the stepper group. */
    label: string;
    decrease: string;
    increase: string;
  };
  actions: {
    like: string;
    unlike: string;
    /** Front → back flip control on products (leads to the impact panel). */
    showImpact: string;
    /** Front → back flip control on services (leads to the description). */
    showDetails: string;
    /** Back → front flip control. */
    flipBack: string;
    /** Confirmation flashed on the CTA after a successful add-to-cart. */
    added: string;
  };
  /** Primary call-to-action label, chosen by the card's ItemType. */
  cta: Record<ItemType, string>;
  impact: {
    title: string;
    /** Label on the button that opens the full impact modal. */
    viewImpact: string;
    co2: string;
    water: string;
    /** Compact labels shown below the `sm` breakpoint. */
    co2Short: string;
    waterShort: string;
    /** e.g. "{{value}} kg" — pass the number as `value`. */
    co2Value: string;
    /** e.g. "{{value}} L" — pass the number as `value`. */
    waterValue: string;
  };
  exchange: {
    /** aria-label on the trigger icon button. */
    trigger: string;
    title: string;
    /** Shown when the seller listed no specific interests. */
    anyOffer: string;
    propose: string;
    close: string;
  };
};

export const getCardsDictionary = (lang: SupportedLanguage) =>
  loaders[lang]() as Promise<CardsDictionary>;

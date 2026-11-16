import type { SupportedLanguage } from "@/constants/settings";
import type { ProductCondition } from "@/types/enums";
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
    /** Label under a product's name when the seller takes swaps. */
    acceptsExchange: string;
    /** Generic promotion badge, used when no percentage is known. */
    offer: string;
    /** e.g. "-{{value}}%" — pass the whole-number discount as `value`. */
    discount: string;
    soldOut: string;
    /** Accessible name of the check beside a verified business's name. */
    verified: string;
  };
  meta: {
    noBusinessName: string;
    /** Back-face fallback when a service carries no blurb. */
    noDescription: string;
  };
  price: {
    /** Prefix on a "from" price, e.g. services quoted from a base rate. */
    from: string;
  };
  /**
   * Business card footer, e.g. "{{value}} products". Split by plural form
   * rather than interpolated, since the noun agrees with the number.
   */
  count: {
    productsOne: string;
    productsOther: string;
    servicesOne: string;
    servicesOther: string;
  };
  /**
   * The pill over a business card's cover, keyed by tag id. Mirrors
   * `editProfile.tags.options` in the profile locales — the catalog is open
   * (served by USR-11), so an id missing here simply shows no pill.
   */
  businessTag: Record<string, string>;
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
  };
  /** Primary call-to-action label, chosen by the card's ItemType. */
  /** `BROWSE` is the neutral CTA a card falls back to when it can't transact. */
  cta: Record<ItemType | "BROWSE", string>;
  /** Arrow buttons on a product rail (`ProductScroller`). */
  scroller: {
    previous: string;
    next: string;
  };
  impact: {
    /** Titles the card's back face. Short: it shares a line with the flip control. */
    saved: string;
    /** Label on the link that opens the full impact modal. */
    viewImpact: string;
    /** Heads the material breakdown on the card's back face. */
    composition: string;
    co2: string;
    water: string;
    /** Compact labels shown below the `sm` breakpoint. */
    co2Short: string;
    waterShort: string;
    /**
     * Units, kept apart from the figure so the back face can set the number
     * large and the unit small. Not translated in practice — they are SI — but
     * they live here so a locale can change them without a code change.
     */
    co2Unit: string;
    waterUnit: string;
  };
};

export const getCardsDictionary = (lang: SupportedLanguage) =>
  loaders[lang]() as Promise<CardsDictionary>;

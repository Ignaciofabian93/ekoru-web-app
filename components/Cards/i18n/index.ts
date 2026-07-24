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
    exchangeable: string;
  };
  meta: {
    noBrand: string;
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
  cta: Record<ItemType, string>;
  impact: {
    title: string;
    viewFull: string;
    /** Compact label for the flip-panel button on narrow cards. */
    viewFullShort: string;
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

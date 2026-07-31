import type { SupportedLanguage } from "@/constants/settings";
import type en from "./locales/en.json";

const loaders = {
  en: () => import("./locales/en.json").then((m) => m.default),
  es: () => import("./locales/es.json").then((m) => m.default),
  fr: () => import("./locales/fr.json").then((m) => m.default),
} satisfies Record<SupportedLanguage, () => Promise<unknown>>;

export const NAMESPACE = "deals";

export type DealsDictionary = typeof en;

type NestedKeyOf<T extends object> = {
  [K in keyof T & string]: T[K] extends object
    ? `${K}` | `${K}.${NestedKeyOf<T[K]>}`
    : `${K}`;
}[keyof T & string];

export type DealsKey = NestedKeyOf<DealsDictionary>;

export const getDealsDictionary = (lang: SupportedLanguage) =>
  loaders[lang]() as Promise<DealsDictionary>;

import type { SupportedLanguage } from "@/constants/settings";

const loaders = {
  en: () => import("./locales/en.json").then((m) => m.default),
  es: () => import("./locales/es.json").then((m) => m.default),
  fr: () => import("./locales/fr.json").then((m) => m.default),
} satisfies Record<SupportedLanguage, () => Promise<unknown>>;

export const NAMESPACE = "localeSwitcher";

export type LocaleSwitcherDictionary = {
  trigger: string;
  country: string;
  language: string;
  singleLanguage: string;
};

export const getLocaleSwitcherDictionary = (lang: SupportedLanguage) =>
  loaders[lang]() as Promise<LocaleSwitcherDictionary>;

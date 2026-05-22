import type { SupportedLanguage } from "@/constants/settings";

const loaders = {
  en: () => import("./locales/en.json").then((m) => m.default),
  es: () => import("./locales/es.json").then((m) => m.default),
  fr: () => import("./locales/fr.json").then((m) => m.default),
} satisfies Record<SupportedLanguage, () => Promise<unknown>>;

export const NAMESPACE = "drawer";

export type DrawerDictionary = {
  header: string;
  sections: { account: string; explore: string; support: string };
  home: string;
  marketplace: string;
  stores: string;
  services: string;
  community: string;
  blog: string;
  upload: string;
  help: string;
  contact: string;
  profile: string;
  settings: string;
  orders: string;
  environmentalImpact: string;
  logOut: string;
  logIn: string;
  sellerType: Record<string, string>;
};

export const getDrawerDictionary = (lang: SupportedLanguage) =>
  loaders[lang]() as Promise<DrawerDictionary>;

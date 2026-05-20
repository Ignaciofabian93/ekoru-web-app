import type { SupportedLanguage } from "@/constants/settings";

const loaders = {
  en: () => import("./locales/en.json").then((m) => m.default),
  es: () => import("./locales/es.json").then((m) => m.default),
  fr: () => import("./locales/fr.json").then((m) => m.default),
} satisfies Record<SupportedLanguage, () => Promise<unknown>>;

export const NAMESPACE = "navigation";

export const getNavigationDictionary = (lang: SupportedLanguage) =>
  loaders[lang]() as Promise<{
    nav: string;
    marketplace: string;
    stores: string;
    services: string;
    community: string;
    blog: string;
    searchPlaceholder: string;
    dropdown: {
      myProfile: string;
      recycle: string;
      publish: string;
      notifications: string;
      signIn: string;
      signUp: string;
    };
  }>;

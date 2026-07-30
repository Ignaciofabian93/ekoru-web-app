import type { SupportedLanguage } from "@/constants/settings";

const loaders = {
  en: () => import("./locales/en.json").then((m) => m.default),
  es: () => import("./locales/es.json").then((m) => m.default),
  fr: () => import("./locales/fr.json").then((m) => m.default),
} satisfies Record<SupportedLanguage, () => Promise<unknown>>;

export const NAMESPACE = "navigation";

/** Keys of the subheader section links — matches SUBHEADER_LINKS in Subheader. */
export type NavigationSection =
  | "marketplace"
  | "stores"
  | "services"
  | "community"
  | "blog";

export type NavigationDictionary = {
  brand: string;
  sections: Record<NavigationSection, string>;
  search: {
    placeholder: string;
  };
  localeSwitcher: {
    country: string;
    language: string;
    singleLanguage: string;
  };
  dropdown: {
    myProfile: string;
    recycle: string;
    publish: string;
    notifications: string;
    signIn: string;
    signUp: string;
    signOut: string;
  };
  /** Screen-reader-only copy: landmark names, control labels and states. */
  a11y: {
    headerLabel: string;
    skipToContent: string;
    primaryNav: string;
    sectionsNav: string;
    homeLink: string;
    searchLabel: string;
    searchSubmit: string;
    cart: string;
    cartWithOneItem: string;
    /** Interpolates `{{count}}`. */
    cartWithItems: string;
    openMenu: string;
    accountMenu: string;
    openAccountMenu: string;
    closeAccountMenu: string;
    localeTrigger: string;
    localePanel: string;
    countrySelect: string;
    languageSelect: string;
  };
};

export const getNavigationDictionary = (lang: SupportedLanguage) =>
  loaders[lang]() as Promise<NavigationDictionary>;

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
    /** Visible label of the submit button inside the search bar. */
    submit: string;
  };
  /** The subheader's "Exploring in: <comuna>" pill (geolocation only). */
  location: {
    /** Lead-in before the comuna name, e.g. "Explorando en:". */
    exploring: string;
    /** Shown in place of the comuna while it is being detected. */
    locating: string;
    /** The pill's whole label before a comuna is set. */
    useMyLocation: string;
    /** Tooltip / description: what clicking the pill does. */
    update: string;
    /** Live feedback on a "use my location" request. */
    status: {
      locating: string;
      /** Interpolates `{{county}}`. */
      detected: string;
      denied: string;
      /** Permission granted but the device returned no position. */
      unavailable: string;
      unsupported: string;
      /** Position found, comuna name not. */
      error: string;
    };
  };
  banner: {
    /** Site-wide beta notice shown above the navbar. */
    beta: string;
  };
  languageSwitcher: {
    /** Heading above the list of languages in the popover. */
    heading: string;
  };
  /** The desktop dropdown each subheader section opens. */
  megaMenu: {
    /** Link to a section's or category's landing page. Interpolates `{{section}}`. */
    seeAll: string;
    /** A section whose catalog came back empty. */
    empty: string;
    /** Screen-reader announcement while a catalog loads. */
    loading: string;
  };
  dropdown: {
    myProfile: string;
    recycle: string;
    publish: string;
    /** Visible label of the header's cart button, e.g. "Mi carro". */
    cart: string;
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
    cart: string;
    cartWithOneItem: string;
    /** Interpolates `{{count}}`. */
    cartWithItems: string;
    openMenu: string;
    accountMenu: string;
    languageTrigger: string;
    languageSelect: string;
  };
};

export const getNavigationDictionary = (lang: SupportedLanguage) =>
  loaders[lang]() as Promise<NavigationDictionary>;

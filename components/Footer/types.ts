import type { ReactNode } from "react";

/**
 * Footer entries that open an informational modal instead of navigating. Each
 * key resolves to `platform.<key>` / `resources.<key>` for the link label and
 * to `modal.<key>.*` for the panel copy.
 */
export type FooterLinkKey =
  | "howItWorks"
  | "forPeople"
  | "forShops"
  | "forCompanies"
  | "ourImpact"
  | "blog"
  | "guides"
  | "faq"
  | "helpCenter"
  | "community";

export interface SocialLink {
  key: string;
  icon: ReactNode;
  href: string;
  /** Key of the accessible name, resolved in the `footer` namespace. */
  ariaLabelKey: string;
}

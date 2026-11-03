import type { LucideIcon } from "lucide-react";
import type { NavigationSection } from "./i18n";

/**
 * A subheader entry. `path` is locale-less — the component prefixes the active
 * `/[lang]` segment so links stay inside the visitor's locale.
 */
export interface SubHeaderLink {
  key: NavigationSection;
  path: string;
  icon: LucideIcon;
}

/**
 * One node of a section's catalog tree, as the drawer hooks map it: up to three
 * levels for the marketplace (department › category › product category), two
 * for stores, services and community, one for the blog. `route` is locale-less.
 */
export interface CatalogNode {
  label: string;
  route: string;
  children?: CatalogNode[];
}

export interface CatalogTree {
  items: CatalogNode[];
  loading: boolean;
}

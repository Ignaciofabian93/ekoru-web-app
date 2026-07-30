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

/** An entry of the profile dropdown. `labelKey` is resolved in the `navigation` namespace. */
export interface ProfileMenuItem {
  labelKey: string;
  path: string;
  icon: LucideIcon;
}

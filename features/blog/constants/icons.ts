import {
  BookOpen,
  Globe,
  Leaf,
  Lightbulb,
  ShoppingBag,
  Sprout,
  Users,
  type LucideIcon,
} from "lucide-react";

/**
 * Maps the `icon` string returned by `getBlogCatalog` to a lucide icon.
 * Unknown values fall back to `BookOpen` so the UI never breaks on new
 * categories the backend introduces.
 */
const ICON_MAP: Record<string, LucideIcon> = {
  leaf: Leaf,
  "shopping-bag": ShoppingBag,
  globe: Globe,
  seedling: Sprout,
  users: Users,
  lightbulb: Lightbulb,
};

export function resolveCategoryIcon(icon: string): LucideIcon {
  return ICON_MAP[icon] ?? BookOpen;
}

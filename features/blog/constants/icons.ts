import {
  Bike,
  BookOpen,
  Carrot,
  Globe,
  GraduationCap,
  Heart,
  House,
  Leaf,
  Lightbulb,
  Recycle,
  Repeat,
  Scale,
  Shirt,
  ShoppingBag,
  Sprout,
  Trees,
  Users,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

/**
 * Maps the `icon` string returned by `getBlogCatalog` to a lucide icon.
 * Unknown values fall back to `BookOpen` so the UI never breaks on new
 * categories the backend introduces. The keys are the ones seeded in
 * catalogs/blog/blog.json; add a key here before using it there.
 */
const ICON_MAP: Record<string, LucideIcon> = {
  leaf: Leaf,
  "shopping-bag": ShoppingBag,
  globe: Globe,
  seedling: Sprout,
  users: Users,
  lightbulb: Lightbulb,
  wrench: Wrench,
  repeat: Repeat,
  home: House,
  carrot: Carrot,
  shirt: Shirt,
  zap: Zap,
  recycle: Recycle,
  bike: Bike,
  trees: Trees,
  scale: Scale,
  heart: Heart,
  "graduation-cap": GraduationCap,
};

export function resolveCategoryIcon(icon: string): LucideIcon {
  return ICON_MAP[icon] ?? BookOpen;
}

import {
  CalendarDays,
  GraduationCap,
  HandHeart,
  House,
  Megaphone,
  Palette,
  Users,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

/**
 * Icons for the community categories. Unlike blog categories, the API sends
 * no icon, so they are keyed by category id: the ids seeded from
 * catalogs/community/<n>-<slug> (slugs change with the language, ids don't).
 * Unknown ids fall back to `Users`.
 */
const ICON_BY_ID: Record<number, LucideIcon> = {
  1: CalendarDays, // Eventos y actividades
  2: GraduationCap, // Educación y difusión
  3: Megaphone, // Activismo e incidencia
  4: House, // Espacios comunitarios
  5: UsersRound, // Grupos y colectivos
  6: HandHeart, // Donaciones y ayuda mutua
  7: Palette, // Cultura y arte sustentable
};

export function resolveCommunityCategoryIcon(id: number): LucideIcon {
  return ICON_BY_ID[id] ?? Users;
}

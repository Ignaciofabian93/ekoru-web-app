import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";
import {
  pageHeroContentClass,
  pageHeroOverlayClass,
  pageHeroSectionClass,
  pageHeroSubtitleClass,
} from "@/design/page-hero";

const DEFAULT_WALLPAPER = "/wallpapers/wallpaper-1.jpg";

export interface PageHeroProps {
  /** Already-translated heading — shared components don't read feature namespaces. */
  title: string;
  subtitle: string;
  wallpaper?: string;
}

/**
 * Full-bleed hero for a section landing page (marketplace, stores, services,
 * blog, community). For inner pages that also need a breadcrumb trail, use
 * `Patterns/BreadcrumbHero`.
 */
export function PageHero({
  title,
  subtitle,
  wallpaper = DEFAULT_WALLPAPER,
}: PageHeroProps) {
  return (
    <section
      className={pageHeroSectionClass}
      style={{ backgroundImage: `url(${wallpaper})` }}
    >
      <div className={pageHeroOverlayClass} aria-hidden />
      <div className={pageHeroContentClass}>
        <Title level="h1" size="h2" color="white" weight="semibold">
          {title}
        </Title>
        <Text
          size="lg"
          color="white"
          className={pageHeroSubtitleClass}
          weight="semibold"
          align="center"
        >
          {subtitle}
        </Text>
      </div>
    </section>
  );
}

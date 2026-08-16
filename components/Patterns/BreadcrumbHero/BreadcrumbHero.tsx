"use client";

import { Breadcrumb, type Crumb } from "@/components/Patterns/Breadcrumb";
import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";
import {
  breadcrumbHeroContentClass,
  breadcrumbHeroHeadingClass,
  breadcrumbHeroOverlayClass,
  breadcrumbHeroSectionClass,
} from "@/design/breadcrumb-hero";
import { useNavigation } from "@/hooks/useNavigation";

const DEFAULT_WALLPAPER = "/wallpapers/wallpaper-1.jpg";

export interface BreadcrumbHeroProps {
  /** Already-translated heading — shared components don't read feature namespaces. */
  title: string;
  subtitle: string;
  breadCrumbs: Crumb[];
  wallpaper?: string;
}

/**
 * Hero for an inner page: same full-bleed treatment as `Patterns/PageHero`
 * plus a breadcrumb trail. Crumbs carrying an `href` become navigable.
 */
export function BreadcrumbHero({
  title,
  subtitle,
  breadCrumbs,
  wallpaper = DEFAULT_WALLPAPER,
}: BreadcrumbHeroProps) {
  const { navigateTo } = useNavigation();

  return (
    <section
      className={breadcrumbHeroSectionClass}
      style={{ backgroundImage: `url(${wallpaper})` }}
    >
      <div className={breadcrumbHeroOverlayClass} aria-hidden />
      <div className={breadcrumbHeroContentClass}>
        <Breadcrumb
          items={breadCrumbs.map((c) => ({
            label: c.label,
            onPress: c.href ? () => navigateTo({ route: c.href as string }) : undefined,
          }))}
          crumbColor="inverted"
          chevronColor="inverted"
        />

        <div className={breadcrumbHeroHeadingClass}>
          <Title level="h1" size="h3" color="white" align="center">
            {title}
          </Title>
          <Text color="white" align="center">
            {subtitle}
          </Text>
        </div>
      </div>
    </section>
  );
}

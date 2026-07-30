"use client";

import { Breadcrumb, type Crumb } from "@/components/Patterns/Breadcrumb";
import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";
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
      className="w-full mx-auto h-[40vh] bg-cover bg-center relative"
      style={{ backgroundImage: `url(${wallpaper})` }}
    >
      <div className="absolute inset-0 bg-black/70" aria-hidden />
      <div className="relative z-10 mx-auto max-w-4xl flex flex-col gap-2 items-start justify-start h-full text-white px-2 py-4">
        <Breadcrumb
          items={breadCrumbs.map((c) => ({
            label: c.label,
            onPress: c.href ? () => navigateTo({ route: c.href as string }) : undefined,
          }))}
          crumbColor="inverted"
          chevronColor="inverted"
        />

        <div className="flex flex-col gap-1 w-full h-full items-center justify-center mb-12">
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

import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";

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
export function PageHero({ title, subtitle, wallpaper = DEFAULT_WALLPAPER }: PageHeroProps) {
  return (
    <section
      className="w-full mx-auto h-[40vh] min-h-60 bg-cover bg-center relative"
      style={{ backgroundImage: `url(${wallpaper})` }}
    >
      <div className="absolute inset-0 bg-black/70" aria-hidden />
      <div className="relative z-10 mx-auto max-w-5xl flex flex-col gap-2 items-center justify-center h-full text-white px-4">
        <Title level="h1" size="h2" color="white" weight="semibold">
          {title}
        </Title>
        <Text
          size="lg"
          color="white"
          className="opacity-90 text-center"
          weight="semibold"
          align="center"
        >
          {subtitle}
        </Text>
      </div>
    </section>
  );
}

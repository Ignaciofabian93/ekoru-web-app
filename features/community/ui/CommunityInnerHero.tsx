import Breadcrumb, { type Crumb } from "@/components/BreadCrumbs/Breadcrumb";
import { useNavigation } from "@/hooks/useNavigation";
import { Title } from "@/components/Title/Title";
import { Text } from "@/components/Text/Text";

interface CommunityInnerHeroProps {
  categoryTitle: string;
  categorySubtitle: string;
  breadCrumbs: Crumb[];
}

export function CommunityInnerHero({
  categoryTitle,
  categorySubtitle,
  breadCrumbs,
}: CommunityInnerHeroProps) {
  const { navigateTo } = useNavigation();

  const WALLPAPER = "/wallpapers/wallpaper-1.jpg";

  return (
    <section
      className="w-full mx-auto h-[40vh] bg-cover bg-center relative"
      style={{ backgroundImage: `url(${WALLPAPER})` }}
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
            {categoryTitle}
          </Title>
          <Text color="white" align="center">
            {categorySubtitle}
          </Text>
        </div>
      </div>
    </section>
  );
}

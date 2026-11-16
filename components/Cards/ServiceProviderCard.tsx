import type { Seller } from "@/types/user";
import { getBusinessProfile } from "@/utils/sellerInformation";
import { BusinessCard } from "./BusinessCard";

interface ServiceProviderCardProps {
  provider: Seller;
  lang: string;
  /**
   * Active services, when the source knows it (`getServiceProviders`). `Seller`
   * itself carries no count, so without this the footer shows the link alone.
   */
  serviceCount?: number;
  priority?: boolean;
}

export function ServiceProviderCard({
  provider,
  lang,
  serviceCount,
  priority,
}: ServiceProviderCardProps) {
  const profile = getBusinessProfile(provider);

  return (
    <BusinessCard
      href={`/${lang}/seller/${provider.id}`}
      itemType="PROVIDER"
      name={profile?.businessName}
      description={profile?.description}
      coverImage={profile?.coverImage}
      logo={profile?.logo}
      tagId={profile?.tags?.[0]}
      location={provider.county?.county}
      isVerified={Boolean(provider.isVerified)}
      count={serviceCount}
      countKind="services"
      // Charcoal separates providers from stores at a glance.
      accent="charcoal"
      priority={priority}
    />
  );
}

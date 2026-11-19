import type { Seller } from "@/types/user";
import { getBusinessProfile } from "@/utils/sellerInformation";
import CardWrapper from "./CardWrapper";
import FrontSide from "./FrontSide";

interface ServiceProviderCardProps {
  provider: Seller;
  lang: string;
  /** Active services, when the source knows it; `Seller` carries no count. */
  serviceCount?: number;
  priority?: boolean;
}

export default function ServiceProviderCard({
  provider,
  lang,
  serviceCount,
  priority,
}: ServiceProviderCardProps) {
  const { id, county, isVerified } = provider;
  const profile = getBusinessProfile(provider);

  return (
    <CardWrapper>
      <FrontSide
        cardType="provider"
        href={`/${lang}/seller/${id}`}
        name={profile?.businessName}
        description={profile?.description}
        coverImage={profile?.coverImage}
        logo={profile?.logo}
        tagId={profile?.tags?.[0]}
        location={county?.county}
        isVerified={Boolean(isVerified)}
        count={serviceCount}
        priority={priority}
      />
    </CardWrapper>
  );
}

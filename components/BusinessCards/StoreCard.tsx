import type { Seller } from "@/types/user";
import { getBusinessProfile } from "@/utils/sellerInformation";
import CardWrapper from "./CardWrapper";
import FrontSide from "./FrontSide";

interface StoreCardProps {
  store: Seller;
  lang: string;
  /** Visible products, when the source knows it; `Seller` carries no count. */
  productCount?: number;
  priority?: boolean;
}

export default function StoreCard({ store, lang, productCount, priority }: StoreCardProps) {
  const { id, county, isVerified } = store;
  const profile = getBusinessProfile(store);

  return (
    <CardWrapper>
      <FrontSide
        cardType="store"
        href={`/${lang}/seller/${id}`}
        name={profile?.businessName}
        description={profile?.description}
        coverImage={profile?.coverImage}
        logo={profile?.logo}
        tagId={profile?.tags?.[0]}
        location={county?.county}
        isVerified={Boolean(isVerified)}
        count={productCount}
        priority={priority}
      />
    </CardWrapper>
  );
}

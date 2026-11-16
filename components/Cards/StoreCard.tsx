import type { Seller } from "@/types/user";
import { getBusinessProfile } from "@/utils/sellerInformation";
import { BusinessCard } from "./BusinessCard";

interface StoresCardProps {
  store: Seller;
  lang: string;
  /**
   * Visible products, when the source knows it (`getStoreSellers`). `Seller`
   * itself carries no count, so without this the footer shows the link alone.
   */
  productCount?: number;
  priority?: boolean;
}

export function StoresCard({ store, lang, productCount, priority }: StoresCardProps) {
  const profile = getBusinessProfile(store);

  return (
    <BusinessCard
      href={`/${lang}/seller/${store.id}`}
      itemType="BUSINESS"
      name={profile?.businessName}
      description={profile?.description}
      coverImage={profile?.coverImage}
      logo={profile?.logo}
      tagId={profile?.tags?.[0]}
      location={store.county?.county}
      isVerified={Boolean(store.isVerified)}
      count={productCount}
      countKind="products"
      accent="primary"
      priority={priority}
    />
  );
}

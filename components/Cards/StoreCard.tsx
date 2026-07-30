import type { Seller } from "@/types/user";
import { getBusinessProfile, getSellerLocation } from "@/utils/sellerInformation";
import { Card } from "./Card";
import { getInitials } from "./utils/initials";

export function StoresCard({ store, lang }: { store: Seller; lang: string }) {
  const profile = getBusinessProfile(store);
  const href = `/${lang}/seller/${store.id}`;
  const businessName = profile?.businessName;

  return (
    <Card
      href={href}
      orientation="horizontal"
      hasBackSide={false}
      ariaLabel={businessName}
    >
      <Card.FrontSide>
        <Card.Header
          coverImageString={profile?.logo ?? ""}
          imageAlt={businessName ?? ""}
          priority
          isProduct={false}
          isLikeEnabled={false}
          isVerified={Boolean(store.isVerified)}
          initials={getInitials(businessName)}
          accent="secondary"
        />
        <div className="flex w-full min-w-0 flex-col">
          <Card.Body
            isProduct={false}
            businessName={businessName}
            businessType={profile?.businessType}
            location={getSellerLocation(store)}
            description={profile?.description ?? undefined}
          />
          <Card.Footer itemType="BUSINESS" url={href} />
        </div>
      </Card.FrontSide>
    </Card>
  );
}

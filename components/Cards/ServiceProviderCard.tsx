import type { Seller } from "@/types/user";
import { getBusinessProfile, getSellerLocation } from "@/utils/sellerInformation";
import { Card } from "./Card";
import { getInitials } from "./utils/initials";

export function ServiceProviderCard({
  provider,
  lang,
}: {
  provider: Seller;
  lang: string;
}) {
  const profile = getBusinessProfile(provider);
  const href = `/${lang}/seller/${provider.id}`;
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
          isVerified={Boolean(provider.isVerified)}
          initials={getInitials(businessName)}
          // Amber separates providers from stores at a glance.
          accent="amber"
        />
        <div className="flex w-full min-w-0 flex-col">
          <Card.Body
            isProduct={false}
            businessName={businessName}
            businessType={profile?.businessType}
            location={getSellerLocation(provider)}
            description={profile?.description ?? undefined}
          />
          <Card.Footer itemType="PROVIDER" url={href} />
        </div>
      </Card.FrontSide>
    </Card>
  );
}

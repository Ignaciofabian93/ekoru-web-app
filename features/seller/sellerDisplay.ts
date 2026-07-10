import type { SellerType } from "@/types/enums";
import type { Seller } from "@/types/user";
import { resolveImageUrl } from "@/utils/resolveImage";

import type { SellerKind } from "./types";

// STARTUP and COMPANY accounts are stores (BusinessProfile); PERSON accounts are
// marketplace sellers (PersonProfile). Defaults to marketplace when the type is
// not yet known (e.g. while the profile is still loading).
export function resolveSellerKind(sellerType: SellerType | undefined): SellerKind {
  return sellerType === "STARTUP" || sellerType === "COMPANY"
    ? "business"
    : "marketplace";
}

export function getSellerName(seller: Seller): string {
  const profile = seller.profile;
  if (!profile) return seller.email;
  if (profile.__typename === "PersonProfile") {
    return (
      profile.displayName ||
      [profile.firstName, profile.lastName].filter(Boolean).join(" ") ||
      seller.email
    );
  }
  return profile.businessName ?? seller.email;
}

export function getSellerAvatar(seller: Seller): string | undefined {
  const profile = seller.profile;
  if (!profile) return undefined;
  const raw =
    profile.__typename === "PersonProfile" ? profile.profileImage : profile.logo;
  return resolveImageUrl(raw);
}

export function getSellerCover(seller: Seller): string | undefined {
  return resolveImageUrl(seller.profile?.coverImage);
}

export function getSellerBio(seller: Seller): string | undefined {
  const profile = seller.profile;
  if (!profile) return undefined;
  if (profile.__typename === "PersonProfile") return profile.bio ?? undefined;
  return profile.description ?? undefined;
}

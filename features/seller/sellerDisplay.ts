import type { Seller } from "@/types/user";
import { resolveImageUrl } from "@/utils/resolveImage";

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
  if (profile.__typename === "PersonProfile") return profile.bio;
  return profile.description;
}

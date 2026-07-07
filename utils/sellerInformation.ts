import type { BusinessProfile, Seller } from "@/types/user";
import { resolveImageUrl } from "./resolveImage";

export const getProfileImage = (seller: Seller): string | undefined => {
  const profile = seller?.profile;
  if (!profile) return undefined;
  const rawPath =
    profile.__typename === "PersonProfile" ? profile.profileImage : profile.logo;
  return resolveImageUrl(rawPath);
};

export const getCoverImage = (seller: Seller): string | undefined => {
  return resolveImageUrl(seller?.profile?.coverImage);
};

export const getSellerLocation = (seller: Seller): string | null => {
  const county = seller.county?.county ?? "";
  const region = seller.region?.region ?? "";

  return `${county}, ${region}`.trim() || null;
};

export const getBusinessProfile = (seller: Seller): BusinessProfile | null => {
  return seller.profile && seller.profile.__typename === "BusinessProfile"
    ? (seller.profile as BusinessProfile)
    : null;
};

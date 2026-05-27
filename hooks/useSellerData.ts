"use client";

import type { SellerType } from "@/types/enums";
import type { Seller } from "@/types/user";
import { formatInitials } from "@/utils/formatters";
import { resolveImageUrl } from "@/utils/resolveImage";

type SellerArg = Seller | null | undefined;

export const useIsAuthenticated = (seller: SellerArg) =>
  seller !== null && seller !== undefined;

export const useSeller = (seller: SellerArg) => seller ?? null;

export const useSellerType = (seller: SellerArg) => seller?.sellerType ?? null;

export const useIsSellerType = (seller: SellerArg, type: SellerType) =>
  seller?.sellerType === type;

export const useHasSellerType = (seller: SellerArg, ...types: SellerType[]) =>
  seller !== null && seller !== undefined && types.includes(seller.sellerType);

export const useSellerProfile = (seller: SellerArg) => seller?.profile;

export const useIsPersonProfile = (seller: SellerArg) =>
  seller?.profile?.__typename === "PersonProfile";

export const usePersonProfile = (seller: SellerArg) =>
  seller?.profile?.__typename === "PersonProfile" ? seller.profile : null;

export const useBusinessProfile = (seller: SellerArg) =>
  seller?.profile?.__typename === "BusinessProfile" ? seller.profile : null;

export const useIsBusinessProfile = (seller: SellerArg) =>
  seller?.profile?.__typename === "BusinessProfile";

export const useDisplayName = (seller: SellerArg) => {
  const profile = seller?.profile;
  if (!profile) return seller?.email ?? "";
  if (profile.__typename === "PersonProfile") {
    if (profile.displayName) return profile.displayName;
    return (
      [profile.firstName, profile.lastName].filter(Boolean).join(" ") ||
      seller?.email ||
      ""
    );
  }
  return profile.businessName ?? seller?.email ?? "";
};

export const useSellerEmail = (seller: SellerArg) => seller?.email;

export const useSellerPoints = (seller: SellerArg) => seller?.points ?? 0;

export const useProfileImage = (seller: SellerArg) => {
  const profile = seller?.profile;
  if (!profile) return undefined;
  const rawPath =
    profile.__typename === "PersonProfile" ? profile.profileImage : profile.logo;
  return resolveImageUrl(rawPath);
};

export const useCoverImage = (seller: SellerArg) =>
  resolveImageUrl(seller?.profile?.coverImage);

export const useInitials = (seller: SellerArg) => {
  const profile = seller?.profile;
  const name =
    profile?.__typename === "PersonProfile"
      ? profile.displayName ||
        [profile.firstName, profile.lastName].filter(Boolean).join(" ")
      : profile?.businessName;
  return formatInitials(name || seller?.email || "");
};

export const useSellerLocation = (seller: SellerArg) =>
  [seller?.county?.county, seller?.address].filter(Boolean).join(" · ");

export const useBusinessType = (seller: SellerArg) =>
  seller?.profile?.__typename === "BusinessProfile"
    ? seller.profile.businessType
    : undefined;

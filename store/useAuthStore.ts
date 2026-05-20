"use client";

import { create } from "zustand";
import type {
  PersonSubscriptionPlan,
  BusinessSubscriptionPlan,
  SellerType,
} from "@/types/enums";
import type { Seller } from "@/types/user";
import { resolveImageUrl } from "@/utils/resolveImage";
import { formatInitials } from "@/utils/formatters";

// Web auth uses HttpOnly cookies set by the gateway via the Next.js proxy.
// Tokens are not held in JS — this store only caches the authenticated seller
// for the duration of the session (refilled on hydrate by a /me-style call,
// usually via GraphQL after the cookies are present).
interface AuthState {
  seller: Seller | null;
  isHydrated: boolean;

  setSeller: (seller: Seller | null) => void;
  updateProfileImage: (imageUrl: string) => void;
  updateCoverImage: (imageUrl: string) => void;
  updateSubscriptionPlan: (plan: string) => void;
  logout: () => void;
  setHydrated: (value: boolean) => void;
}

const useAuthStore = create<AuthState>()((set) => ({
  seller: null,
  isHydrated: false,

  setSeller: (seller) => set({ seller }),

  updateProfileImage: (imageUrl) =>
    set((state) => {
      if (!state.seller?.profile) return state;
      const updatedProfile =
        state.seller.profile.__typename === "PersonProfile"
          ? { ...state.seller.profile, profileImage: imageUrl }
          : { ...state.seller.profile, logo: imageUrl };
      return { seller: { ...state.seller, profile: updatedProfile } };
    }),

  updateCoverImage: (imageUrl) =>
    set((state) => {
      if (!state.seller?.profile) return state;
      return {
        seller: {
          ...state.seller,
          profile: { ...state.seller.profile, coverImage: imageUrl },
        },
      };
    }),

  updateSubscriptionPlan: (plan) =>
    set((state) => {
      if (!state.seller?.profile) return state;
      const updatedProfile =
        state.seller.profile.__typename === "PersonProfile"
          ? {
              ...state.seller.profile,
              personSubscriptionPlan: plan as PersonSubscriptionPlan,
            }
          : {
              ...state.seller.profile,
              businessSubscriptionPlan: plan as BusinessSubscriptionPlan,
            };
      return { seller: { ...state.seller, profile: updatedProfile } };
    }),

  logout: () => set({ seller: null }),

  setHydrated: (value) => set({ isHydrated: value }),
}));

// Selectors
export const useIsAuthenticated = () => useAuthStore((s) => s.seller !== null);

export const useSeller = () => useAuthStore((s) => s.seller);

export const useSellerType = () => useAuthStore((s) => s.seller?.sellerType ?? null);

export const useIsSellerType = (type: SellerType) =>
  useAuthStore((s) => s.seller?.sellerType === type);

export const useHasSellerType = (...types: SellerType[]) =>
  useAuthStore((s) => s.seller !== null && types.includes(s.seller.sellerType));

export const useSellerProfile = () => useAuthStore((s) => s.seller?.profile);

export const useIsPersonProfile = () =>
  useAuthStore((s) => s.seller?.profile?.__typename === "PersonProfile");

export const usePersonProfile = () =>
  useAuthStore((s) =>
    s.seller?.profile?.__typename === "PersonProfile" ? s.seller.profile : null,
  );

export const useBusinessProfile = () =>
  useAuthStore((s) =>
    s.seller?.profile?.__typename === "BusinessProfile" ? s.seller.profile : null,
  );

export const useIsBusinessProfile = () =>
  useAuthStore((s) => s.seller?.profile?.__typename === "BusinessProfile");

export const useDisplayName = () =>
  useAuthStore((s) => {
    const profile = s.seller?.profile;
    if (!profile) return s.seller?.email ?? "";
    if (profile.__typename === "PersonProfile") {
      if (profile.displayName) return profile.displayName;
      return (
        [profile.firstName, profile.lastName].filter(Boolean).join(" ") ||
        s.seller?.email ||
        ""
      );
    }
    return profile.businessName ?? s.seller?.email ?? "";
  });

export const useSellerEmail = () => useAuthStore((s) => s.seller?.email);

export const useSellerPoints = () => useAuthStore((s) => s.seller?.points ?? 0);

export const useProfileImage = () =>
  useAuthStore((s) => {
    const profile = s.seller?.profile;
    if (!profile) return undefined;
    const rawPath =
      profile.__typename === "PersonProfile" ? profile.profileImage : profile.logo;
    return resolveImageUrl(rawPath);
  });

export const useCoverImage = () =>
  useAuthStore((s) => resolveImageUrl(s.seller?.profile?.coverImage));

export const useInitials = () =>
  useAuthStore((s) => {
    const profile = s.seller?.profile;
    const name =
      profile?.__typename === "PersonProfile"
        ? profile.displayName ||
          [profile.firstName, profile.lastName].filter(Boolean).join(" ")
        : profile?.businessName;
    return formatInitials(name || s.seller?.email || "");
  });

export default useAuthStore;

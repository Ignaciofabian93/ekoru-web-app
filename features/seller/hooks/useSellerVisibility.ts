"use client";

import { useMemo } from "react";

import {
  SOCIAL_LINKS,
  type SocialLinkField,
} from "@/constants/socialLinks";
import { useIsBusinessProfile } from "@/hooks/useSellerData";
import type { Seller } from "@/types/user";

export type VisibleSocial = SocialLinkField & { url: string };

export interface SellerVisibility {
  /** Country → region → county, as far as the seller allows it to be shown. */
  locationLine: string;
  /** Street address. Empty unless it may be shown. */
  street: string;
  /** Whether the fine-grained location (county + street) is public. */
  showsAddress: boolean;
  /** Social profiles to link out to. Empty when hidden or none are set. */
  socials: VisibleSocial[];
}

/**
 * What a visitor is allowed to see on a seller's public profile.
 *
 * Location is tiered rather than all-or-nothing: country and region are always
 * public, because a marketplace is useless if you can't tell roughly where a
 * listing is. The parts that identify a home — county and street — are private
 * by default and appear only when the seller opts in with `showMyAddress`.
 *
 * A business is a different case: it trades from a place, and buyers need that
 * address, so it is always shown regardless of the preference.
 *
 * Social links follow `showMySocials` for everyone. Preferences may be absent
 * (an older account, or a viewer the subgraph doesn't expose them to); the
 * private-by-default reading is used then, so a missing record never leaks.
 */
export function useSellerVisibility(seller: Seller | null | undefined): SellerVisibility {
  const isBusiness = useIsBusinessProfile(seller);

  return useMemo(() => {
    const preferences = seller?.preferences;
    const showsAddress = isBusiness || preferences?.showMyAddress === true;
    const showsSocials = preferences?.showMySocials === true;

    const locationLine = [
      seller?.country?.country,
      seller?.region?.region,
      showsAddress ? seller?.county?.county : undefined,
    ]
      .filter(Boolean)
      .join(" · ");

    const links = seller?.socialMediaLinks ?? {};
    const socials = showsSocials
      ? SOCIAL_LINKS.flatMap((field) => {
          const url = links[field.key]?.trim();
          return url ? [{ ...field, url }] : [];
        })
      : [];

    return {
      locationLine,
      street: showsAddress ? (seller?.address ?? "") : "",
      showsAddress,
      socials,
    };
  }, [seller, isBusiness]);
}

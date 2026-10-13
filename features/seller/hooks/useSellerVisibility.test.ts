import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Seller, SellerPreferences } from "@/types/user";
import { useSellerVisibility } from "./useSellerVisibility";

const LOCATION = {
  country: { id: 1, country: "Chile" },
  region: { id: 2, region: "Valparaíso", countryId: 1 },
  county: { id: 3, county: "Viña del Mar", cityId: 9 },
};

const seller = (over: Partial<Seller>) =>
  ({ id: "s1", email: null, sellerType: "PERSON", ...LOCATION, ...over }) as Seller;
const prefs = (showMyAddress: boolean, showMySocials: boolean) =>
  ({ showMyAddress, showMySocials }) as SellerPreferences;
const business = {
  __typename: "BusinessProfile",
  id: "b1",
  businessName: "Verde",
} as const;

const visibility = (s: Seller) => renderHook(() => useSellerVisibility(s)).result.current;

describe("useSellerVisibility", () => {
  it("shows a visitor what the API returned (USR-10)", () => {
    // The API sends the street and the links only when they may be shown.
    const shared = visibility(
      seller({
        address: "Calle 1",
        socialMediaLinks: { instagram: "https://instagram.com/ana" },
      }),
    );
    expect(shared.street).toBe("Calle 1");
    expect(shared.locationLine).toBe("Chile · Valparaíso · Viña del Mar");
    expect(shared.socials.map((s) => s.key)).toEqual(["instagram"]);

    const hidden = visibility(seller({}));
    expect(hidden.street).toBe("");
    expect(hidden.locationLine).toBe("Chile · Valparaíso");
    expect(hidden.socials).toEqual([]);
  });

  it("lets the seller's own switches decide on their own page", () => {
    const own = visibility(
      seller({
        address: "Calle 1",
        socialMediaLinks: { instagram: "https://instagram.com/ana" },
        preferences: prefs(false, false),
      }),
    );
    expect(own.showsAddress).toBe(false);
    expect(own.street).toBe("");
    expect(own.socials).toEqual([]);
  });

  it("always shows a business's address", () => {
    const shop = visibility(seller({ address: "Local 4", profile: business as never }));
    expect(shop.showsAddress).toBe(true);
    expect(shop.street).toBe("Local 4");
  });
});
